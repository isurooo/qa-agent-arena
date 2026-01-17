import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import axios from "axios";
import * as cheerio from "cheerio";

dotenv.config();

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// MOCK SOURCES (In real life, we'd use GitHub API or Serper.dev)
const SOURCES = [
    "https://github.com/topics/agentic-ai",
    "https://arxiv.org/list/cs.AI/recent"
];

// MOCK CONTENT to simulate a finding if scraping fails or for demo
const MOCK_README = `
# AutoQA-Genius (v0.1)
The first autonomous QA agent that uses vision-based reinforcement learning.
Last Updated: 2 weeks ago.
USP: "Self-healing selectors using nothing but screenshots."
`;

async function scoutTrends() {
    console.log("🔭 Scout Agent Starting...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 1. Scraping (Simulated for stability in this env)
    console.log(`Searching sources: ${SOURCES.join(", ")}...`);
    // In a real implementation:
    // const { data } = await axios.get(SOURCES[0]);
    // const $ = cheerio.load(data);
    // ... extract texts ...

    const scannedContent = MOCK_README; // Using mock for reliable demo

    // 2. Analysis with Gemini
    const prompt = `
    You are "The Scout", a tech trend hunter.
    Analyze the following text from a software repository/paper:
    
    "${scannedContent}"
    
    Task:
    1. Filter: Is this related to "Agentic QA" or "Autonomous Testing"? (Bool)
    2. Check freshness: Is it updated in the last 6 months? (Bool)
    3. Extract USP (Unique Selling Proposition).
    4. Categorize market sentiment (Hyped / Practical / Academic).
    5. Identify tech stack flags (e.g., "Vision", "Selenium", "LLM").

    Output JSON:
    {
        "is_relevant": boolean,
        "is_fresh": boolean,
        "usp": "string",
        "market_sentiment": "string",
        "tech_stack_flags": "string"
    }
    `;

    console.log("🧠 Analyzing trends with Gemini...");
    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(text);

        if (analysis.is_relevant && analysis.is_fresh) {
            console.log("✨ Trend Detected:", analysis.usp);

            // 3. Save to DB
            await prisma.trend.create({
                data: {
                    market_sentiment: analysis.market_sentiment,
                    tech_stack_flags: analysis.tech_stack_flags,
                    // Note: Schema 'Trend' needs more fields ideally, but matching current schema:
                    // market_sentiment String, tech_stack_flags String
                }
            });
            console.log("💾 Trend saved to database.");
        } else {
            console.log("No new relevant trends found.");
        }

    } catch (e) {
        console.error("Scout failed:", e);
    }
}

// Allow running directly
if (require.main === module) {
    scoutTrends();
}

export { scoutTrends };
