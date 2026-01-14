'use client';

import { useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Tool {
    id: number;
    name: string;
    claims: string[];
    realityCheck: {
        stability_score: number;
        healing_factor: string;
        critical_failures: string[];
        verdict: string;
    };
    flakinessData: Array<{ day: number; flakiness: number }>;
}

interface ComparisonProps {
    tool: Tool;
    isAdmin?: boolean;
    onVerify?: (toolId: number) => void;
}

export default function Comparison({ tool, isAdmin = false, onVerify }: ComparisonProps) {
    const [isVerified, setIsVerified] = useState(false);

    const handleVerify = () => {
        if (onVerify) {
            onVerify(tool.id);
            setIsVerified(true);
        }
    };

    const getStabilityColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getStabilityIcon = (score: number) => {
        if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-500" />;
        if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        return <XCircle className="h-5 w-5 text-red-500" />;
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    The Arena: {tool.name}
                </h1>
                <p className="text-muted-foreground">
                    Claims vs Reality - The cold, hard truth about AI QA tools
                </p>
            </div>

            {/* Versus Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                {/* Left Side: Tool Claims */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <h2 className="text-xl font-semibold text-foreground">
                            Tool Claims
                        </h2>
                        <span className="text-sm text-muted-foreground">
                            (Marketing Promises)
                        </span>
                    </div>

                    <div className="space-y-3">
                        {tool.claims.map((claim, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <p className="text-foreground">{claim}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground italic">
                            "Trust us, it just works!" - Marketing Team
                        </p>
                    </div>
                </div>

                {/* Right Side: Reality Check */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-destructive rounded-full"></div>
                        <h2 className="text-xl font-semibold text-foreground">
                            Auditor Reality Check
                        </h2>
                        <span className="text-sm text-muted-foreground">
                            (Actual Test Results)
                        </span>
                    </div>

                    {/* Stability Score */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">Stability Score</span>
                            <div className="flex items-center gap-2">
                                {getStabilityIcon(tool.realityCheck.stability_score)}
                                <span className={`text-lg font-bold ${getStabilityColor(tool.realityCheck.stability_score)}`}>
                                    {tool.realityCheck.stability_score}/100
                                </span>
                            </div>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${tool.realityCheck.stability_score >= 80 ? 'bg-success' :
                                    tool.realityCheck.stability_score >= 60 ? 'bg-warning' : 'bg-destructive'
                                    }`}
                                style={{ width: `${tool.realityCheck.stability_score}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Healing Factor */}
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-foreground mb-2">Healing Factor</h3>
                        <p className="text-sm text-muted-foreground">{tool.realityCheck.healing_factor}</p>
                    </div>

                    {/* Critical Failures */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-foreground mb-2">Critical Failures</h3>
                        <div className="space-y-2">
                            {tool.realityCheck.critical_failures.map((failure, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-destructive">{failure}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Verdict */}
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <h3 className="text-sm font-medium text-foreground mb-2">Auditor Verdict</h3>
                        <p className="text-sm text-foreground font-mono">
                            "{tool.realityCheck.verdict}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Flakiness Index Chart */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Flakiness Index</h2>
                    <span className="text-sm text-muted-foreground">Last 7 Days</span>
                </div>

                <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={tool.flakinessData}>
                            <Line
                                type="monotone"
                                dataKey="flakiness"
                                stroke="hsl(var(--destructive))"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                    Higher values indicate more test instability and unreliable results
                </p>
            </div>

            {/* Admin Verification */}
            {isAdmin && (
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                                Human Verification Required
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Verify these results for the weekly newsletter and add to public profile
                            </p>
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={isVerified}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${isVerified
                                ? 'bg-success text-success-foreground'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                }`}
                        >
                            {isVerified ? '✓ Verified' : 'Verify Results'}
                        </button>
                    </div>

                    {isVerified && (
                        <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-lg">
                            <p className="text-sm text-success">
                                ✓ Results verified and queued for newsletter publication
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}