"use client"
// Create a reusable button component with Tailwind CSS
// Props: text, onClick, type (primary, secondary)
import React from 'react';

interface ButtonProps {
    text: string;
    onClick: () => void;
    type?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ text, onClick, type = 'primary' }) => {
    const baseClasses = "px-6 py-3 rounded-full font-semibold transition";
    const typeClasses = type === 'primary'
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300";

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${typeClasses}`}
        >
            {text}
        </button>
    );
};

export default Button;
