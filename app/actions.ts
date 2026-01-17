'use server'

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { auditLog } from '@/lib/auditor';

export async function submitRun(formData: FormData) {
    const toolName = formData.get('toolName') as string;
    const logs = formData.get('logs') as string;

    if (!toolName || !logs) {
        throw new Error("Missing fields");
    }

    // 1. Create Tool
    const tool = await prisma.tool.create({
        data: {
            name: toolName,
            url: "https://user-submitted.demo",
            version: "1.0.0",
            category: "AGENTIC" // Default
        }
    });

    // 2. Find or Create Default Benchmark
    let benchmark = await prisma.benchmark.findFirst({
        where: { scenario_name: "User Submission Audit" }
    });

    if (!benchmark) {
        benchmark = await prisma.benchmark.create({
            data: {
                scenario_name: "User Submission Audit",
                difficulty_level: "HARD"
            }
        });
    }

    // 3. Create ArenaRun (PENDING)
    console.log(`Creating pending run for ${toolName}...`);
    const run = await prisma.arenaRun.create({
        data: {
            toolId: tool.id,
            benchmarkId: benchmark.id,
            status: "PENDING",
            stability_score: 0,
            hallucination_detected: false,
            raw_logs: { content: logs }, // Storing as JSON object
            video_url: ""
        }
    });

    // 4. Trigger Audit Immediately (Serverless Pattern)
    console.log(`Triggering immediate audit for run ${run.id}...`);
    const context = `Scenario: User Submission Audit\nDifficulty: HARD\nNote: This is a user-submitted log for immediate analysis.`;

    // START AUDIT
    const audit = await auditLog(logs, context);
    console.log(`Audit complete. Score: ${audit.stability_score}`);

    // 5. Update Record
    await prisma.arenaRun.update({
        where: { id: run.id },
        data: {
            status: audit.stability_score > 80 ? 'PASS' : 'FAIL',
            stability_score: audit.stability_score,
            hallucination_detected: audit.critical_failures.length > 0,
            // We could store the full audit result in raw_logs or a new column, but keeping it simple for now
        }
    });

    // Redirect to the Arena to see it processed
    redirect('/arena');
}
