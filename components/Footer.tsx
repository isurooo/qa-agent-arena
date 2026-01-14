// Create a footer component for QA Agent Arena
// Include links to Privacy Policy, Terms of Service, Contact Us
// Simple and modern design with Tailwind CSS
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-gray-400 py-6">
            <div className="max-w-4xl mx-auto flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
                <p>&copy; {new Date().getFullYear()} QA³ Agent Arena. All rights reserved.</p>
                <div className="space-x-6">
                    <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
                    <a href="/terms-of-service" className="hover:text-white">Terms of Service</a>
                    <a href="/contact-us" className="hover:text-white">Contact Us</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
