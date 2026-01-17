"use client"
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface ComparisonProps {
    toolName: string;
    marketingClaims: string[];
    auditResults: {
        passRate: number;
        stabilityScore: number;
        hallucinations: number;
    };
    flakinessData: { run: number; stability: number }[];
    isAdmin?: boolean;
    onVerify?: () => void;
}

const ComparisonSimple: React.FC<ComparisonProps> = ({
    toolName,
    marketingClaims,
    auditResults,
    flakinessData,
    isAdmin,
    onVerify
}) => {
    return (
        <div className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm w-full max-w-5xl mx-auto my-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{toolName} vs. The Auditor</h2>
                {isAdmin && (
                    <button
                        onClick={onVerify}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <span>✓</span> Verify Agent
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Marketing Claims */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-blue-400">Claims</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {marketingClaims.map((claim, idx) => (
                            <li key={idx}>{claim}</li>
                        ))}
                    </ul>
                </div>

                {/* Right: Reality Check */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-red-400">Reality Check</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted p-4 rounded-lg text-center">
                            <div className="text-sm text-muted-foreground">Pass Rate</div>
                            <div className="text-2xl font-bold">{auditResults.passRate}%</div>
                        </div>
                        <div className="bg-muted p-4 rounded-lg text-center">
                            <div className="text-sm text-muted-foreground">Hallucinations</div>
                            <div className="text-2xl font-bold text-red-500">{auditResults.hallucinations}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Flakiness Index Chart */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Flakiness Index (Last 10 Runs)</h3>
                <div className="h-64 w-full bg-muted/20 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={flakinessData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="run" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="stability"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={{ fill: '#f59e0b' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ComparisonSimple;
