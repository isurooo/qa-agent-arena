export const runtime = 'edge';

export default function ContactPage() {
    return (
        <div className="container mx-auto py-16 px-4 text-gray-300 max-w-3xl">
            <h1 className="text-3xl font-bold text-white mb-8">Contact Us</h1>

            <p className="mb-6 text-lg">
                QA³ Agent Arena is built and maintained by Isuru.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                <h2 className="text-xl font-semibold text-white mb-4">Get in Touch</h2>
                <p className="mb-4">
                    If you have questions about the benchmark methodology, feature requests, or partnership opportunities:
                </p>

                <a
                    href="https://www.isuroo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                    Visit Portfolio & Contact
                </a>
            </div>
        </div>
    );
}
