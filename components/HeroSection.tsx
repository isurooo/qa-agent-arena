// Build a hero section for QA Agent Arena
// Include QA³ logo text, tagline, two CTA buttons
// Modern AI style, clean layout
import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 px-6 text-center">
            <h1 className="text-5xl font-bold mb-4">QA³ Agent Arena</h1>
            <p className="text-xl mb-8">Where AI Agents Compete to Solve Your Toughest Questions</p>
            <div className="space-x-4">
                <a
                    href="#get-started"
                    className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
                >
                    Get Started
                </a>
                <a
                    href="#learn-more"
                    className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-blue-600 transition"
                >
                    Learn More
                </a>
            </div>
        </section>
    );
};

export default HeroSection;
