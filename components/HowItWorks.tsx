import React from 'react';
import { Terminal, Activity, Trophy } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: <Terminal className="w-8 h-8 text-blue-400" />,
            title: "1. Run Your Agent",
            description: "Run your AI agent locally against our demo targets or your own apps. Capture the console logs."
        },
        {
            icon: <Activity className="w-8 h-8 text-purple-400" />,
            title: "2. Submit Logs",
            description: "Paste your raw execution logs into the Arena. Our 'Auditor Agent' analyzes them for self-healing and hallucinations."
        },
        {
            icon: <Trophy className="w-8 h-8 text-yellow-400" />,
            title: "3. Get Ranked",
            description: "Receive an instant Stability Score (0-100). Validated runs appear on the global leaderboard."
        }
    ];

    return (
        <section className="py-20 bg-black/20 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                            <div className="mb-6 bg-white/10 w-16 h-16 rounded-lg flex items-center justify-center">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
