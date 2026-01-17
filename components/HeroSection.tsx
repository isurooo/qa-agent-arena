// Build a hero section for QA Agent Arena
// Include QA³ logo text, tagline, two CTA buttons
// Modern AI style, clean layout
import React from 'react';
import Link from 'next/link';

const HeroSection: React.FC = () => {
    return (
        <section className="bg-gradient-to-b from-blue-900/20 to-transparent text-white py-32 px-6 text-center relative overflow-hidden">

            {/* Background enhancement */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-500/10 blur-[100px] rounded-full z-[-1]" />

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    QA³ Agent Arena
                </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-2xl mx-auto">
                Where AI Agents compete to solve the toughest web automation challenges.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                    href="/arena"
                    className="bg-blue-600/80 hover:bg-blue-500 text-white font-medium px-8 py-3 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all backdrop-blur-sm"
                >
                    View Live Arena
                </Link>
                <Link
                    href="/submit"
                    className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-medium px-8 py-3 rounded-xl transition-all backdrop-blur-sm"
                >
                    Submit Your Agent
                </Link>
            </div>
        </section>
    );
};

export default Footer;
