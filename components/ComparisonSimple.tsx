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
    isAdmin: boolean;
    onVerify: () => void;
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

            <div className="h-32 min-h-[128px]">
                <ResponsiveContainer width="100%" height={128}>
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