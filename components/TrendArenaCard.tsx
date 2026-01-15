"use client"
// Create a React component with two columns:
// Left: "The Past (Deprecated)"
// Right: "The Future (Agentic)"
// Each column has a title, short description, and upvote/downvote buttons
// Use Tailwind and keep it clean and modern
import React, { useState } from 'react';

const TrendArenaCard: React.FC = () => {
    const [leftVotes, setLeftVotes] = useState(0);
    const [rightVotes, setRightVotes] = useState(0);

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 flex space-x-6">
            {/* Left Column */}
            <div className="w-1/2 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">The Past (Deprecated)</h2>
                <p className="text-gray-600 mb-6 text-center">
                    Embrace the legacy systems and traditional methods that have shaped our industry.
                </p>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setLeftVotes(leftVotes + 1)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Upvote
                    </button>
                    <span className="text-lg font-semibold">{leftVotes}</span>
                    <button
                        onClick={() => setLeftVotes(leftVotes - 1)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Downvote
                    </button>
                </div>
            </div>

            {/* Right Column */}
            <div className="w-1/2 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">The Future (Agentic)</h2>
                <p className="text-gray-600 mb-6 text-center">
                    Explore innovative, autonomous systems that drive progress and efficiency.
                </p>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setRightVotes(rightVotes + 1)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Upvote
                    </button>
                    <span className="text-lg font-semibold">{rightVotes}</span>
                    <button
                        onClick={() => setRightVotes(rightVotes - 1)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Downvote
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrendArenaCard;  
