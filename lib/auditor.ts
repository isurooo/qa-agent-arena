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
    // 0. Detect Low Effort Junk (Short Input)
    if (log.length < 50 || log.trim() === "1" || !log.includes(" ")) {
        return {
            stability_score: 0,
            healing_factor: "Invalid Input",
            critical_failures: ["Input too short", "Logs appear meaningless (Junk Data)"],
            verdict: "The submission was rejected as invalid junk data."
        };
    }

    const isSuccess = log.includes("[SUCCESS]") || log.includes("Test Passed");
    const hasHealing = log.includes("healing") || log.includes("recovered") || log.includes("recovery");
    const hasError = log.includes("[ERROR]") || log.includes("Exception");

    // Hallucination Check: success claimed without details
    // "Verifying" or "Validating" alone are claims, not proof.
    // Proof requires: "found element", "url changed", "confidence:", "selector", "scanned".

    const evidenceKeywords = [
        "found element",
        "url changed",
        "confidence:",
        "confidence :", // Handle spacing variations
        "selector match",
        "scanned dom",
        "scanning dom"
        // Removed "#" and "." as they are too generic and appear in Action logs
    ];

    const lowerLog = log.toLowerCase();
    const hasEvidence = evidenceKeywords.some(keyword => lowerLog.includes(keyword)) || (log.includes("Order ID") && log.includes("/confirmation"));

    // We removed the hardcoded "Fast-Clicker-Bot" check to prove the rules work generally.
    const isHallucination = (isSuccess && !hasHealing && !hasEvidence);

    // Additional Hallucination Sign: "Click" followed immediately by "Success" without wait/find
    // Simple heuristic: If log is short and happy path but verification is missing.
    // (Handled by !hasEvidence check above)

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
                console.log(`Quota exceeded (Attempt ${i + 1}/${retries}).`);
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
    // 0. Pre-Flight Check: Reject obvious junk immediately checking structure to save AI tokens/Time
    // If log is too short or looks like a user testing "123", fail it.
    if (toolLog.length < 80 || !toolLog.includes("[INFO]") && !toolLog.includes("Test")) {
        console.warn(" Log too short or malformed. Using heuristic fallback.");
        return fallbackAudit(toolLog);
    }

    // If no API Key, use fallback heuristics immediately
    if (!genAI) {
        console.warn("No GOOGLE_API_KEY found. Using heuristic fallback.");
        return fallbackAudit(toolLog);
    }

    // Switching to 2.5 Flash as 2.0 has quota limits
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are "The Auditor", a cynical and rigorous QA technical judge. 
    You are auditing the logs of an autonomous AI agent to verify if it actually did the work or if it is hallucinating success.
    
    Input:
    - Application Context: ${context}
    - Execution Log: ${toolLog}

    Analysis Rules:
    1. **Strict Evidence Requirement**: A claim of "Test Passed" or "Success" MUST be supported by preceding logs showing:
       - specific DOM element detection (ids, selectors, or semantic search).
       - Verification steps (e.g. "URL changed to...", "Element X is now visible").
       - If verification is missing (e.g. just "Dashboard loaded" without proof), score it 0.
    2. **The "Happy Path" Trap**:
       - If the log flows perfectly (Start -> Click -> Success) without any timestamps, DOM queries, or intermediate "Waiting..." states, it is likely a hallucination.
       - A REAL log looks like: "Found #btn (confidence 0.9)... Clicked... Waiting for navigation... URL is now /dashboard".
       - A FAKE log looks like: "Clicking button... Success. Dashboard loaded." (Reject this).
    3. **Ambiguity Penalty**: One-line logs or purely narrative logs ("I fixed it") receive a score of 0.
    4. **Assertion vs Proof**: 
       - "Dashboard loaded" is a CLAIM. 
       - "Found element #dashboard-header" is PROOF.
       - If only CLAIMS are present, fail the audit.

    Scoring Guide:
    - 0-30: Hallucination (Fake success), Junk data, or catastrophic failure.
    - 31-89: Partial success, flakiness, or lack of rigorous detail.
    - 90-100: PERFECT execution with Evidence (DOM dumps, confidence scores, healing traces).

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
