// Create a footer component for QA Agent Arena
// Include links to Privacy Policy, Terms of Service, Contact Us
// Simple and modern design with Tailwind CSS
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black/50 border-t border-white/10 text-gray-500 py-8 text-sm">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col items-center md:items-start">
                    <p>&copy; {new Date().getFullYear()} QA³ Agent Arena. All rights reserved.</p>
                    <p className="mt-1">Built by <a href="https://www.isuroo.com/" target="_blank" className="hover:text-blue-400 transition" rel="noopener noreferrer">Isuru</a></p>
                </div>

                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
                    <Link href="/contact" className="hover:text-white transition">Contact Us</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
