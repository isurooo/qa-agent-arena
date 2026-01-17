import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fire() {
    console.log("🔥 Firing test event into the Arena...");

    // 1. Ensure a Tool exists
    const tool = await prisma.tool.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: "Agent Zero",
            url: "https://agent-zero.dev",
            version: "1.0.0-beta",
            category: "AGENTIC"
        }
    });

    // 2. Ensure a Benchmark exists
    const benchmark = await prisma.benchmark.upsert({
        where: { id: 1 },
        update: {},
        create: {
            scenario_name: "Shadow DOM Stress Test",
            difficulty_level: "High"
        }
    });

    // 3. Create a PENDING run
    const run = await prisma.arenaRun.create({
        data: {
            toolId: tool.id,
            benchmarkId: benchmark.id,
            status: "PENDING",
            stability_score: 0,
            hallucination_detected: false,
            // Sample log that the Auditor will analyze
            raw_logs: `
[INFO] Initializing Agent Zero...
[INFO] Navigating to target URL...
[INFO] Shadow DOM detected. Injecting piercer script...
[WARN] Element #submit-btn inside shadow-root(open) is shifting.
[ACTION] Attempting click on #submit-btn...
[ERROR] Click intercepted. Element moved by 15px.
[HEALING] Re-calibrating coordinates using visual anchor.
[SUCCESS] Click successful on second attempt.
[INFO] Flow completed.
            `
        }
    });

    console.log(`✅ Run #${run.id} created! status: PENDING`);
    console.log("👀 Watch your 'npm run audit' terminal...");
}

fire()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
