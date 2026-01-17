import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export interface AuditResult {
    stability_score: number;
    healing_factor: string;
    critical_failures: string[];
    verdict: string;
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
                let delay = 2000 * (i + 1);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
    throw new Error("Max retries exceeded");
}

export async function auditLog(toolLog: string, context: string): Promise<AuditResult> {
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
        return {
            stability_score: 0,
            healing_factor: "Audit Failed",
            critical_failures: ["AI Processing Error"],
            verdict: "Auditor malfunctioned."
        };
    }
}
