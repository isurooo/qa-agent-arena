import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

interface AuditResult {
    stability_score: number;
    healing_factor: string;
    critical_failures: string[];
    verdict: string;
}

// Mock Data representing a "Tool" input
const SAMPLE_LOG = `
[INFO] Starting test execution...
[INFO] Locating button ".submit-btn"
[ERROR] Element not found. Retrying (Attempt 1/3)...
[INFO] AI Agent attempting to heal selector...
[INFO] Found button with text "Submit Order". Clicked.
[INFO] Verifying checkout success
[INFO] Test passed.
`;

const SAMPLE_BROKEN_DEMO_CONTEXT = `
The target application is a checkout page. 
The 'Submit' button has a dynamic ID that changes on reload.
There is a Shadow DOM component for the credit card field.
`;

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

                let delay = 10000 * (i + 1); // Default backoff

                // Try to parse 'retryDelay' from error structure if available
                // or parse from message "Please retry in X s."
                const msg = error.toString();
                const match = msg.match(/Please retry in ([\d\.]+)s/);
                if (match && match[1]) {
                    delay = Math.ceil(parseFloat(match[1]) * 1000) + 10000; // Add 1000ms buffer
                }

                console.log(`⏳ Waiting ${Math.round(delay / 1000)}s before retrying...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
    throw new Error("Max retries exceeded");
}

async function auditLog(toolLog: string, context: string): Promise<AuditResult> {
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

async function runAuditor() {
    console.log("🕵️‍♂️ Auditor Agent Starting...");

    if (!process.env.GOOGLE_API_KEY) {
        console.error("CRITICAL: GOOGLE_API_KEY is missing!");
        return;
    }

    console.log("🔌 Connecting to Arena Database...");

    // Polling loop
    while (true) {
        try {
            // Find one pending run
            const pendingRun = await prisma.arenaRun.findFirst({
                where: { status: 'PENDING' },
                include: { benchmark: true, tool: true }
            });

            if (!pendingRun) {
                // console.log("💤 No pending runs. Waiting...");
                await new Promise(r => setTimeout(r, 5000)); // Sleep 5s
                continue;
            }

            console.log(`\n🚀 Processing Run #${pendingRun.id} (Tool: ${pendingRun.tool.name})...`);

            // Extract Log (Assuming JSON or String)
            const rawLog = JSON.stringify(pendingRun.raw_logs);
            const context = `Scenario: ${pendingRun.benchmark.scenario_name}\nDifficulty: ${pendingRun.benchmark.difficulty_level}`;

            // Run Audit
            const audit = await auditLog(rawLog, context);

            console.log(`✅ Audit Complete. Score: ${audit.stability_score}. Verdict: ${audit.verdict.substring(0, 50)}...`);

            // Save Result
            await prisma.arenaRun.update({
                where: { id: pendingRun.id },
                data: {
                    status: audit.stability_score > 80 ? 'PASS' : 'FAIL', // Simple threshold logic
                    stability_score: audit.stability_score,
                    hallucination_detected: audit.critical_failures.length > 0,
                    // raw_logs: JSON.stringify({...pendingRun.raw_logs, audit_result: audit}) // Optionally append result
                }
            });

        } catch (e) {
            console.error("Loop Error:", e);
            await new Promise(r => setTimeout(r, 5000));
        }
    }
}

runAuditor();
