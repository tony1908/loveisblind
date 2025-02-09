import Link from "next/link";

export default function HomeDashboard({ showChatButton = true, onRestart }: { showChatButton?: boolean, onRestart?: () => void }) {
  return (
    <div className="max-w-4xl w-full mx-auto p-8 bg-gradient-to-br from-yellow-200 to-pink-200 rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Welcome Home</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {showChatButton && (
          <Link
            href="/chat"
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-200 transition-transform transform hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">Chat with Agent</h2>
            <p className="text-gray-500 text-center">Start a conversation with our agent.</p>
          </Link>
        )}
        <Link
          href="/partners"
          className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-200 transition-transform transform hover:-translate-y-1 hover:shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">Partners</h2>
          <p className="text-gray-500 text-center">View available partners to talk to.</p>
        </Link>
        <Link
          href="/refuel"
          className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-200 transition-transform transform hover:-translate-y-1 hover:shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">Refuel</h2>
          <p className="text-gray-500 text-center">Refuel your smart contract interaction.</p>
        </Link>
      </div>
      {onRestart && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={onRestart}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            Restart Onboarding
          </button>
        </div>
      )}
    </div>
  );
} 