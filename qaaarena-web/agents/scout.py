import os
import httpx
import asyncio
from datetime import datetime, timedelta
from dateutil.parser import parse as parse_date
from supabase import create_client, Client
import google.genai as genai
from dotenv import load_dotenv, find_dotenv

# --- Configuration ---
# Load environment variables from .env.local file
load_dotenv(find_dotenv(filename='.env.local'))

GITHUB_API_URL = "https://api.github.com/search/repositories"
ARXIV_API_URL = "https://export.arxiv.org/api/query"
KEYWORDS = ["Agentic QA", "Autonomous Testing"]
TIME_FILTER = timedelta(days=180)  # 6 months

# Supabase and Gemini Configuration
SUPABASE_URL = os.environ.get("PROJECT_URL")
SUPABASE_KEY = os.environ.get("PUBLISHABLE_API_KEY")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY, GOOGLE_API_KEY]):
    raise EnvironmentError("Supabase and Google API keys must be set in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
# Initialize the Google GenAI client with the correct API
client_ai = genai.Client(api_key=GOOGLE_API_KEY)

# --- Helper Functions ---
async def get_usp_from_text(text: str) -> str:
    """Extracts the Unique Selling Proposition (USP) from text using Gemini."""
    prompt = f"""
    Analyze the following text from a project's README or abstract.
    Extract the Unique Selling Proposition (USP) in a single, concise sentence.
    The USP should highlight what makes this project novel or powerful.

    Text:
    ---
    {text}
    ---

    USP:
    """
    try:
        response = await client_ai.aio.models.generate_content(
            model='gemini-pro',
            contents=[prompt]
        )
        return response.candidates[0].content.parts[0].text.strip()
    except Exception as e:
        print(f"Error with Gemini API: {e}")
        return "USP could not be determined."

async def search_github(query: str, client: httpx.AsyncClient):
    """Searches GitHub repositories."""
    headers = {"Accept": "application/vnd.github.v3+json"}
    params = {"q": query, "sort": "updated", "order": "desc"}
    try:
        res = await client.get(GITHUB_API_URL, headers=headers, params=params)
        res.raise_for_status()
        return res.json().get("items", [])
    except httpx.HTTPStatusError as e:
        print(f"GitHub API request failed: {e.response.status_code}")
        return []


async def search_arxiv(query: str, client: httpx.AsyncClient):
    """Searches arXiv for papers."""
    params = {
        "search_query": f'all:"{query}"',
        "start": 0,
        "max_results": 20,
        "sortBy": "lastUpdatedDate",
        "sortOrder": "descending"
    }
    try:
        res = await client.get(ARXIV_API_URL, params=params)
        res.raise_for_status()
        # This is a simplified XML parser. A more robust solution would use a library like feedparser.
        content = res.text
        entries = content.split('<entry>')
        results = []
        for entry in entries[1:]:
            updated = entry.split('<updated>')[1].split('</updated>')[0]
            summary = entry.split('<summary>')[1].split('</summary>')[0]
            results.append({"updated_at": updated, "abstract": summary})
        return results
    except httpx.HTTPStatusError as e:
        print(f"ArXiv API request failed: {e.response.status_code}")
        return []

async def process_and_store_trends(results: list, source: str):
    """Processes search results and stores them in Supabase."""
    now = datetime.utcnow()
    trends_to_insert = []

    for item in results:
        updated_at_str = item.get("updated_at") or item.get("pushed_at")
        if not updated_at_str:
            continue

        updated_at = parse_date(updated_at_str).replace(tzinfo=None)

        if (now - updated_at) > TIME_FILTER:
            continue # Skip legacy results

        text_content = item.get("description") or item.get("abstract", "")
        if not text_content:
            continue

        usp = await get_usp_from_text(text_content)

        trends_to_insert.append({
            "market_sentiment": usp,
            "tech_stack_flags": source,
            "created_at": now.isoformat(),
        })

    if trends_to_insert:
        try:
            data, count = supabase.table('Trend').insert(trends_to_insert).execute()
            print(f"Successfully inserted {len(data[1])} trends from {source}.")
        except Exception as e:
            print(f"Supabase insert failed: {e}")


async def main():
    """Main function to run the scraper."""
    # Use a rate-limited async client
    limits = httpx.Limits(max_keepalive_connections=5, max_connections=10)
    timeout = httpx.Timeout(10.0, connect=5.0)

    async with httpx.AsyncClient(limits=limits, timeout=timeout) as client:
        for keyword in KEYWORDS:
            print(f"--- Searching for '{keyword}' ---")

            # GitHub
            github_results = await search_github(keyword, client)
            if github_results:
                await process_and_store_trends(github_results, "GitHub")

            # ArXiv
            arxiv_results = await search_arxiv(keyword, client)
            if arxiv_results:
                await process_and_store_trends(arxiv_results, "ArXiv")

            # Rate limiting delay
            await asyncio.sleep(2) # Be respectful to APIs

if __name__ == "__main__":
    asyncio.run(main())
