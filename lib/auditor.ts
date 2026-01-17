import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize carefully to allow fallback if key is missing
const apiKey = process.env.GOOGLE_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface AuditResult {
    stability_score: number;
    healing_factor: string;
    critical_failures: string[];
    verdict: string;
}

// Simple heuristic fallback when AI is unavailable
function fallbackAudit(log: string): AuditResult {
    const isSuccess = log.includes("[SUCCESS]") || log.includes("Test Passed");
    const hasHealing = log.includes("healing") || log.includes("recovered") || log.includes("recovery");
    const hasError = log.includes("[ERROR]") || log.includes("Exception");
    const isHallucination = log.includes("Fast-Clicker-Bot") || (isSuccess && !hasHealing && !log.includes("Validating"));
    const isCritical = log.includes("[CRITICAL]") || log.includes("No recovery possible");

    if (isCritical) {
        return {
            stability_score: 10,
            healing_factor: "Catastrophic Failure",
            critical_failures: ["Test suite aborted", "Recovery failed"],
            verdict: "The agent crashed and burned. No recovery was possible."
        };
    }

    if (isHallucination) {
        return {
            stability_score: 0,
            healing_factor: "None detected",
            critical_failures: ["Hallucinated success state", "Action verification missing"],
            verdict: "The agent claims success but performed no verifiable actions. A classic hallucination."
        };
    }

    if (isSuccess && hasHealing) {
        return {
            stability_score: 95,
            healing_factor: "Excellent Semantic Recovery",
            critical_failures: [],
            verdict: "The agent demonstrated robust self-healing, recovering from a selector failure using semantic analysis."
        };
    }

    if (hasError && !isSuccess) {
        return {
            stability_score: 40,
            healing_factor: "Attempted but failed",
            critical_failures: ["Unresolved selector error"],
            verdict: "The agent encountered an error and could not complete the objective."
        };
    }

    // Default Success
    if (isSuccess) {
        return {
            stability_score: 100,
            healing_factor: "N/A (Happy Path)",
            critical_failures: [],
            verdict: "Flawless execution on the happy path."
        };
    }

    return {
        stability_score: 50,
        healing_factor: "Unknown",
        critical_failures: ["Inconclusive logs"],
        verdict: "The logs provided were insufficient for a definitive ruling."
    };
}

// Helper for handling Quota limits
async function generateWithRetry(model: any, prompt: string, retries = 3): Promise<string> {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            // Check for 429 (Quota Exceeded)
            if (error.status === 429 && i < retries - 1) {
                console.log(`⚠️ Quota exceeded (Attempt ${i + 1}/${retries}).`);
                const delay = 2000 * (i + 1);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
    throw new Error("Max retries exceeded");
}

export async function auditLog(toolLog: string, context: string): Promise<AuditResult> {
    // If no API Key, use fallback heuristics immediately
    if (!genAI) {
        console.warn("⚠️ No GOOGLE_API_KEY found. Using heuristic fallback.");
        return fallbackAudit(toolLog);
    }

    // Switching to 2.5 Flash as 2.0 has quota limits
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are "The Auditor", a rigorous QA technical judge.
    Analyze the following execution log from an AI testing agent against the known application context.

    Application Context:
    ${context}

    Execution Log:
    ${toolLog}

    Your task:
    1. Parse the log for 'Retry' attempts and 'Self-healing' actions.
    2. Detect if the agent 'hallucinated' a success (e.g., clicking a button that doesn't exist).
    3. Assign a Stability Score (0-100).
    4. Provide a summarized healing factor (how well did it recover?).
    5. List critical failures if any.
    6. Write a cynical, technical verdict.

    Output STRICT JSON format:
    {
      "stability_score": number, // 0-100
      "healing_factor": "string description",
      "critical_failures": ["array", "of", "strings"],
      "verdict": "string"
    }
  `;

    try {
        const text = await generateWithRetry(model, prompt);

        // Clean code block formatting if present
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("AI Audit failed:", error);
        // Fallback to heuristics if AI fails (e.g. quota, network)
        return fallbackAudit(toolLog);
    }
}
