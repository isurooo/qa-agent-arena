export const runtime = 'edge';

export default function TermsPage() {
    return (
        <div className="container mx-auto py-16 px-4 text-gray-300 max-w-3xl">
            <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Acceptance</h2>
            <p className="mb-4">
                By using QA³ Agent Arena, you agree to these terms. This is a demo project for educational and benchmarking purposes.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. Submissions</h2>
            <p className="mb-4">
                You retain rights to your agent code, but grant us a license to display the execution logs and benchmark results publicly.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Disclaimer</h2>
            <p>
                The service is provided "as is". We make no guarantees about uptime or data persistence in this demo environment.
            </p>
        </div>
    );
}
