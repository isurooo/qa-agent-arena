import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QA³ Agent Arena",
  description: "Benchmarking the next generation of AI Agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <header className="p-4 bg-background/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-white/10">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              QA³ Agent Arena
            </Link>
            <nav className="flex gap-4">
              <Link href="/arena" className="text-sm text-gray-400 hover:text-white transition">Benchmark</Link>
              <Link href="/submit" className="text-sm text-gray-400 hover:text-white transition">Submit Agent</Link>
            </nav>
          </div>
        </header>
        <main className="flex-grow flex flex-col pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
