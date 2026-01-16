'use client';

import ComparisonSimple from '@/components/ComparisonSimple';

// Mock data - in production this would come from your Supabase database
const mockTool = {
    id: 1,
    name: "AutoQA Pro",
    claims: [
        "99.9% test reliability with self-healing selectors",
        "Zero maintenance test automation",
        "AI-powered visual regression detection",
        "Supports any web application out of the box"
    ],
    realityCheck: {
        stability_score: 34,
        healing_factor: "Self-healed after 3 retries, still failed on Shadow DOM elements",
        critical_failures: [
            "Failed to find element 'Submit' button - selector was hallucinated",
            "Retry loop exceeded 5 attempts on dynamic content",
            "Visual regression test reported false positives on 40% of screens"
        ],
        verdict: "Marketing claims do not align with observed performance. Tool struggles with modern web frameworks and dynamic content. Reliability score indicates significant flakiness."
    },
    flakinessData: [
        { day: 1, flakiness: 25 },
        { day: 2, flakiness: 42 },
        { day: 3, flakiness: 31 },
        { day: 4, flakiness: 58 },
        { day: 5, flakiness: 67 },
        { day: 6, flakiness: 44 },
        { day: 7, flakiness: 51 }
    ]
};

// ...existing code...
export default function ArenaPage() {
    const handleVerify = (toolId: number) => {
        console.log(`Verifying tool ${toolId}`);
        // TODO: Implement server action for verification
    };

    return (
        <div className="bg-background w-full">
            <div className="container mx-auto py-8">
                <ComparisonSimple
                    toolName={mockTool.name}
                    marketingClaims={mockTool.claims}
                    auditResults={{
                        passRate: 0,
                        stabilityScore: mockTool.realityCheck.stability_score,
                        hallucinations: mockTool.realityCheck.critical_failures.length
                    }}
                    flakinessData={mockTool.flakinessData.map(d => ({ run: d.day, stability: d.flakiness }))}
                    isAdmin={true}
                    onVerify={() => handleVerify(mockTool.id)}
                />
            </div>
        </div>
    );
}