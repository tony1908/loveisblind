"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  
  const router = useRouter();

  const handleSend = async () => {
    if (input.trim() === "") return;
    const currentInput = input;
    setMessages((prev) => [...prev, { sender: "You", text: currentInput }]);
    setInput("");

    const payload = {
      text: currentInput,
      userId: "user5",
      userName: "User6",
    };

    setIsLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/5ff425c7-64ba-0df7-8b90-7b4ac055b5ed/message",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      if (data && Array.isArray(data) && data.length > 0) {
        const agentResponse = data[0];
        setMessages((prev) => [
          ...prev,
          { sender: agentResponse.user, text: agentResponse.text },
        ]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100">
      <Header />
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4 text-center">Chat with Agent</h1>
        <div className="max-w-2xl mx-auto bg-white border-4 border-black p-4 rounded shadow-[4px_4px_0px_0px] h-96 overflow-y-auto mb-4 transition-transform transform hover:scale-105">
          {messages.length === 0 && !isLoading ? (
            <p className="text-gray-500">No messages yet.</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold">{msg.sender}:</span> {msg.text}
              </div>
            ))
          )}
          {isLoading && (
            <div className="mb-2 text-gray-500 italic">Agent is thinking...</div>
          )}
        </div>
        <div className="max-w-2xl mx-auto flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border-2 border-black p-2 rounded-l focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-400"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="bg-yellow-300 hover:bg-yellow-400 border-2 border-black p-2 rounded-r font-bold transition-transform duration-200 hover:scale-105"
          >
            Send
          </button>
        </div>
        {messages.filter((msg) => msg.sender === "You").length >= 5 && (
          <div className="max-w-2xl mx-auto mt-4">
            <button
              onClick={() => router.push("/refuel")}
              className="bg-green-300 hover:bg-green-400 border-2 border-black p-2 rounded font-bold transition-transform duration-200 hover:scale-105"
            >
              Finish Creating Agent
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 