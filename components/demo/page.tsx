// Create a deliberately broken UI page:
// Button with changing ID
// Input field with dynamic label
// Used to test AI QA tools self-healing ability
import React, { useState, useEffect } from 'react';

const DemoPage: React.FC = () => {
  const [buttonId, setButtonId] = useState('button-1');
  const [inputLabel, setInputLabel] = useState('Enter your name:');

  // Change button ID every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setButtonId(`button-${Math.floor(Math.random() * 1000)}`);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Change input label every 7 seconds
  useEffect(() => {
    const labels = ['Enter your name:', 'Type your name here:', 'What is your name?'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % labels.length;
      setInputLabel(labels[index]);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Demo Page with Broken UI Elements</h1>
      <div className="mb-4">
        <label htmlFor="nameInput" className="block text-lg font-medium mb-2">
          {inputLabel}
        </label>
        <input
          id="nameInput"
          type="text"
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
      </div>
      <button
        id={buttonId}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Click Me
      </button>
    </div>
  );
}