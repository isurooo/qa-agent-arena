export const runtime = 'edge';

export default function PrivacyPage() {
    return (
        <div className="container mx-auto py-16 px-4 text-gray-300 max-w-3xl">
            <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
            <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Data Collection</h2>
            <p className="mb-4">
                We collect logs submitted by users for the purpose of benchmarking AI agents.
                These logs are publicly viewable in the Arena. Do not submit sensitive personal data or secrets in your agent logs.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. Usage</h2>
            <p className="mb-4">
                Data submitted is used to calculate stability scores and rank AI agents. We may use anonymized aggregated data for research.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Contact</h2>
            <p>
                For questions, please contact Isuru via <a href="https://www.isuroo.com/" className="text-blue-400 hover:underline">isuroo.com</a>.
            </p>
        </div>
    );
}
