import { GoogleGenerativeAI } from "@google/generative-ai";

// Mock ground truth for the "Broken Demo"
const groundTruth = {
    expectedActions: [
        "click button 'Submit'",
        "verify text 'Success'",
    ],
    selectors: {
        "button 'Submit'": "#submit-button",
    }
};

interface AuditorResult {
    stability_score: number;
    healing_factor: string;
    critical_failures: string[];
    verdict: string;
}

export async function runAuditor(log: string, transcript: string): Promise<AuditorResult> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
    You are "The Auditor", a skeptical and technical AI QA analyst.
    Your task is to analyze a raw execution log and a video transcript from a Playwright test run to assess the performance of an AI testing tool.

    **Ground Truth for "Broken Demo":**
    - Expected Actions: ${JSON.stringify(groundTruth.expectedActions)}
    - Known Selectors: ${JSON.stringify(groundTruth.selectors)}

    **Analysis Required:**
    1.  **Parse for Retries:** Count the number of "Retry" attempts in the log.
    2.  **Action Comparison:** Compare the tool's actions from the log against the expected actions from the ground truth.
    3.  **Detect Hallucinated Selectors:** Identify any instance where the tool claims to interact with an element (e.g., "click button 'Login'") but that element's selector does not exist in the known selectors.
    4.  **Verdict Formulation:** Based on your analysis, provide a technical and skeptical verdict on the tool's performance.

    **Raw Execution Log:**
    ---
    ${log}
    ---

    **Video Transcript:**
    ---
    ${transcript}
    ---

    **Output Format:**
    Return a structured JSON object with the following schema:
    {
      "stability_score": number (0-100, where 100 is perfectly stable, decrease for each retry),
      "healing_factor": string (e.g., "Self-healed after 2 retries", "No healing detected"),
      "critical_failures": array of strings (e.g., ["Failed to find element 'Submit'", "Hallucinated selector 'button \\'Login\\''"]),
      "verdict": string (Your technical, skeptical summary)
    }
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        // The model output is expected to be a JSON string.
        return JSON.parse(text) as AuditorResult;
    } catch (error) {
        console.error("Error running The Auditor:", error);
        return {
            stability_score: 0,
            healing_factor: "Error during analysis",
            critical_failures: ["Analysis failed"],
            verdict: "Could not determine the verdict due to an internal error.",
        };
    }
}
