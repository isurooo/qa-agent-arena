import asyncio
from playwright.async_api import async_playwright, TimeoutError

async def run_benchmark():
    """
    Opens a URL using Playwright, clicks a button, logs success/failure,
    and saves the output to a text file.
    """
    log_entries = []
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            
            # Using a public test page for this example
            url = "http://uitestingplayground.com/click"
            log_entries.append(f"Navigating to {url}")
            await page.goto(url)
            
            # The button's ID is 'badButton' on this test page.
            # We'll use a standard selector. If this were to change, more robust
            # selectors like text-based or multi-attribute selectors would be needed.
            button_selector = "#badButton"
            
            try:
                log_entries.append(f"Attempting to click button with selector: {button_selector}")
                # Click the button with a timeout
                await page.click(button_selector, timeout=5000)
                log_entries.append("SUCCESS: Button clicked successfully.")
                
            except TimeoutError:
                log_entries.append(f"FAILURE: Could not click the button with selector '{button_selector}' within the time limit.")
            except Exception as e:
                log_entries.append(f"FAILURE: An unexpected error occurred while trying to click the button: {e}")
                
            await browser.close()
            
    except Exception as e:
        log_entries.append(f"FAILURE: An error occurred during the browser automation setup: {e}")

    # Save the log to a file
    log_file_path = "benchmark_log.txt"
    with open(log_file_path, "w") as f:
        for entry in log_entries:
            f.write(entry + "\n")
            
    print(f"Benchmark finished. Log saved to {log_file_path}")
    print("\n--- Log Summary ---")
    for entry in log_entries:
        print(entry)
    print("--- End of Summary ---")


if __name__ == "__main__":
    asyncio.run(run_benchmark())