import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

async function generateNewsletter() {
    console.log("📰 Content Architect Agent Starting...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 1. Fetch Data
    console.log("Gathering intel from the Arena Database...");

    // A. Top Tool
    const topRun = await prisma.arenaRun.findFirst({
        where: { status: 'PASS' },
        orderBy: { stability_score: 'desc' },
        include: { tool: true }
    });

    // B. Legacy Trends
    const trends = await prisma.trend.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    });

    // C. Shadow DOM Results
    const shadowDomRuns = await prisma.arenaRun.findMany({
        where: {
            benchmark: {
                scenario_name: {
                    contains: 'Shadow DOM',
                    mode: 'insensitive'
                }
            }
        },
        include: { tool: true, benchmark: true }
    });

    // Prepare Context for Gemini via a structured object represented as string
    const contextData = {
        top_performer: topRun ? {
            name: topRun.tool.name,
            score: topRun.stability_score,
            verdict: "High stability observed."
        } : "No successful runs recorded this week.",

        market_trends: trends.map(t => ({
            sentiment: t.market_sentiment,
            stack_flags: t.tech_stack_flags
        })),

        shadow_dom_war_report: shadowDomRuns.length > 0 ? shadowDomRuns.map(r => ({
            tool: r.tool.name,
            result: r.status,
            score: r.stability_score
        })) : "No tools dared to enter the Shadow DOM arena this week."
    };

    console.log("Intel gathered. Drafting 'The Cold, Hard Truth'...");

    // 2. Generate Content
    const prompt = `
    You are "The Content Architect", a cynical, high-technical editor for a specialized QA newsletter.
    
    Your goal: Write a markdown newsletter section based on the following real data from our "Arena".
    
    DATA SOURCE:
    ${JSON.stringify(contextData, null, 2)}
    
    REQUIREMENTS:
    1. Title: "The Cold, Hard Truth about AI QA" (add current date).
    2. Section "🏆 Tool of the Week": Highlight the top performer. If none, mock the industry for failing.
    3. Section "👻 The Shadow DOM Graveyard": Summarize how tools fared against Shadow DOM.
    4. Section "📉 Legacy Watch": Call out deprecated tech trends found by the Scout.
    5. Tone: Professional but cutting. Use words like "Brittle", "Flaky", "Robust", "Hallucination".
    
    Output purely Markdown.
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // 3. Output
        const filename = `newsletter_${new Date().toISOString().split('T')[0]}.md`;
        fs.writeFileSync(filename, text);
        console.log(`✅ Newsletter generated: ${filename}`);
        console.log("\n--- PREVIEW ---\n");
        console.log(text.substring(0, 500) + "...");

    } catch (e) {
        console.error("Architect failed to draft:", e);
    }
}

// Allow running directly
if (require.main === module) {
    generateNewsletter();
}
