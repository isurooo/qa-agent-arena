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

async function auditLog(toolLog: string, context: string): Promise<AuditResult> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

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
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

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

    // In a real loop, we would fetch pending ArenaRuns from DB
    // const pendingRuns = await prisma.arenaRun.findMany({ where: { status: 'PENDING' } });

    console.log("Analyzing sample log...");
    const audit = await auditLog(SAMPLE_LOG, SAMPLE_BROKEN_DEMO_CONTEXT);

    console.log("\n--- 📝 AUDITOR VERDICT ---");
    console.log(JSON.stringify(audit, null, 2));
    console.log("--------------------------\n");

    // Simulate saving to DB
    /*
    await prisma.arenaRun.update({
      where: { id: 1 },
      data: {
          stability_score: audit.stability_score,
          video_url: "http://...",
          raw_logs: JSON.stringify(audit) // Storing full audit in logs or separate column
      }
    });
    */
}

runAuditor();
