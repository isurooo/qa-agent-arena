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
        <div className="w-full max-w-6xl mx-auto p-6 bg-gray-900 text-white">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    The Arena: {tool.name}
                </h1>
                <p className="text-gray-400">
                    Claims vs Reality - The cold, hard truth about AI QA tools
                </p>
            </div>

            {/* Versus Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                {/* Left Side: Tool Claims */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <h2 className="text-xl font-semibold text-white">
                            Tool Claims
                        </h2>
                        <span className="text-sm text-gray-400">
                            (Marketing Promises)
                        </span>
                    </div>

                    <div className="space-y-3">
                        {tool.claims.map((claim, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                <p className="text-white">{claim}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-400 italic">
                            "Trust us, it just works!" - Marketing Team
                        </p>
                    </div>
                </div>

                {/* Right Side: Reality Check */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <h2 className="text-xl font-semibold text-white">
                            Auditor Reality Check
                        </h2>
                        <span className="text-sm text-gray-400">
                            (Actual Test Results)
                        </span>
                    </div>

                    {/* Stability Score */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">Stability Score</span>
                            <div className="flex items-center gap-2">
                                {getStabilityIcon(tool.realityCheck.stability_score)}
                                <span className={`text-lg font-bold ${getStabilityColor(tool.realityCheck.stability_score)}`}>
                                    {tool.realityCheck.stability_score}/100
                                </span>
                            </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${tool.realityCheck.stability_score >= 80 ? 'bg-green-500' :
                                        tool.realityCheck.stability_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${tool.realityCheck.stability_score}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Healing Factor */}
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-white mb-2">Healing Factor</h3>
                        <p className="text-sm text-gray-400">{tool.realityCheck.healing_factor}</p>
                    </div>

                    {/* Critical Failures */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-white mb-2">Critical Failures</h3>
                        <div className="space-y-2">
                            {tool.realityCheck.critical_failures.map((failure, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-red-400">{failure}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Verdict */}
                    <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
                        <h3 className="text-sm font-medium text-white mb-2">Auditor Verdict</h3>
                        <p className="text-sm text-white font-mono">
                            "{tool.realityCheck.verdict}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Flakiness Index Chart */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Flakiness Index</h2>
                    <span className="text-sm text-gray-400">Last 7 Days</span>
                </div>

                <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={tool.flakinessData}>
                            <Line
                                type="monotone"
                                dataKey="flakiness"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                    Higher values indicate more test instability and unreliable results
                </p>
            </div>

            {/* Admin Verification */}
            {isAdmin && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                                Human Verification Required
                            </h3>
                            <p className="text-sm text-gray-400">
                                Verify these results for the weekly newsletter and add to public profile
                            </p>
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={isVerified}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${isVerified
                                    ? 'bg-green-600 text-white'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {isVerified ? '✓ Verified' : 'Verify Results'}
                        </button>
                    </div>

                    {isVerified && (
                        <div className="mt-4 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                            <p className="text-sm text-green-400">
                                ✓ Results verified and queued for newsletter publication
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}