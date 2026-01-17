"use client"

import { submitRun } from '@/app/actions';

export default function SubmitPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-8 text-white">Submit Agent Logs</h1>

            <form action={submitRun} className="w-full max-w-lg bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Agent Name</label>
                    <input
                        type="text"
                        name="toolName"
                        placeholder="e.g. MySuperAgent v1"
                        required
                        className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Execution Logs</label>
                    <textarea
                        name="logs"
                        rows={10}
                        placeholder="[INFO] Clicking button... [ERROR] Failed..."
                        required
                        className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Paste your raw console output or JSON logs here.</p>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                    Analyze Logs
                </button>
            </form>
        </div>
    );
}
