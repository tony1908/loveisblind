import React from "react";

interface ChatProps {
  onComplete: () => void;
}

export default function Chat({ onComplete }: ChatProps) {
  return (
    <div className="max-w-md w-full border-4 border-black p-8 bg-white rounded-lg shadow-[10px_10px_0px_0px] transition-transform transform hover:scale-105">
      <h2 className="text-2xl font-bold mb-4 text-center">Chat Interface</h2>
      <p className="mb-4 text-center">
        Chat with your dating bot here...
      </p>
      <button 
        onClick={onComplete}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 border-2 border-black rounded transition-transform duration-200 hover:scale-105"
      >
        Finish Chat
      </button>
    </div>
  );
} 