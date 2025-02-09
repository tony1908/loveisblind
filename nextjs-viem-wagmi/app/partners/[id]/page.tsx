"use client";

import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { useState, useEffect } from "react";

export default function PartnerConversationPage() {
  const params = useParams();
  const partnerId = params.id; // This is the chosen partner's username.
  // State for conversation messages.
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  // New state to hold the final reply from Partner.
  const [finalMessage, setFinalMessage] = useState<string>("");

  useEffect(() => {
    // Retrieve the user's twitter handle from localStorage.
    const twitterHandle = localStorage.getItem("twitterHandle");
    if (!twitterHandle) {
      console.error("Twitter handle not found in localStorage");
      return;
    }
    // Use partnerId as the partner's username.
    const partnerUsername = partnerId;

    async function simulateConversation() {
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
      // Define the maximum messages per side.
      const maxMessages = 7;
      // We'll count messages from "You" and "Partner".
      // Note: The initial "You" message counts as one.
      let countYou = 1;
      let countPartner = 0;
      // Start with the initial message that the user sends.
      let currentMessage = "Hey there";
      // Initialize the UI with the initial message from "You".
      setMessages([{ sender: "You", text: currentMessage }]);

      // The conversation loop: first call Partner, then You.
      while (countYou < maxMessages || countPartner < maxMessages) {
        // If Partner hasn't reached the max, simulate Partner's thinking and reply.
        if (countPartner < maxMessages) {
          // Show thinking message for Partner.
          setMessages((prev) => [...prev, { sender: "Partner", text: "Partner is thinking..." }]);
          await delay(4000);

          try {
            // Updated endpoint for Partner's response using partnerUsername.
            const partnerResponse = await fetch(
              `http://localhost:3008/api/conversations/7/${partnerUsername}/sendMessage`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: currentMessage }),
              }
            );
            const partnerData = await partnerResponse.json();
            const partnerReply = partnerData.reply;
            if (!partnerReply) {
              console.error("Partner response did not include a message. Stopping conversation.");
              break;
            }

            // Replace the thinking message with Partner's actual reply.
            setMessages((prev) => {
              const newMessages = [...prev];
              if (
                newMessages.length > 0 &&
                newMessages[newMessages.length - 1].sender === "Partner" &&
                newMessages[newMessages.length - 1].text === "Partner is thinking..."
              ) {
                newMessages[newMessages.length - 1] = { sender: "Partner", text: partnerReply };
              } else {
                newMessages.push({ sender: "Partner", text: partnerReply });
              }
              return newMessages;
            });
            countPartner++;
            currentMessage = partnerReply;
          } catch (error) {
            console.error("Error during Partner request:", error);
            break;
          }
        }

        // If Your messages count is below limit, simulate Your thinking and reply.
        if (countYou < maxMessages) {
          // Show thinking message for You.
          setMessages((prev) => [...prev, { sender: "You", text: "You are thinking..." }]);
          await delay(4000);

          try {
            // Updated endpoint for Your response using twitterHandle.
            const youResponse = await fetch(
              `http://localhost:3008/api/conversations/7/${twitterHandle}/sendMessage`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: currentMessage }),
              }
            );
            const youData = await youResponse.json();
            const yourReply = youData.reply;
            if (!yourReply) {
              console.error("You response did not include a message. Stopping conversation.");
              break;
            }

            // Replace the thinking message with Your actual reply.
            setMessages((prev) => {
              const newMessages = [...prev];
              if (
                newMessages.length > 0 &&
                newMessages[newMessages.length - 1].sender === "You" &&
                newMessages[newMessages.length - 1].text === "You are thinking..."
              ) {
                newMessages[newMessages.length - 1] = { sender: "You", text: yourReply };
              } else {
                newMessages.push({ sender: "You", text: yourReply });
              }
              return newMessages;
            });
            countYou++;
            currentMessage = yourReply;
          } catch (error) {
            console.error("Error during You request:", error);
            break;
          }
        }
      }

      // After conversation simulation is complete, ask the final question.
      if (countYou === maxMessages && countPartner === maxMessages) {
        const finalQuestion = "would your personality match to me for date?";
        // Append the final question from "You" to the conversation box.
        setMessages((prev) => [...prev, { sender: "You", text: finalQuestion }]);
        await delay(4000);

        try {
          // Final message sent only to your endpoint using twitterHandle.
          const finalResponse = await fetch(
            `http://localhost:3008/api/conversations/5/${twitterHandle}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: finalQuestion }),
            }
          );
          const finalData = await finalResponse.json();
          const finalReply = finalData.reply;
          if (!finalReply) {
            console.error("Final Partner response did not include a reply.");
          } else {
            setFinalMessage(finalReply);
          }
        } catch (error) {
          console.error("Error during final Partner request:", error);
        }
      }
    }
    simulateConversation();
  }, [partnerId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100">
      {/* Header container without padding */}
      <div className="w-full">
        <Header />
      </div>
      {/* Main content container with padding */}
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Conversation with Partner {partnerId}
        </h1>
        <div className="max-w-2xl mx-auto bg-white border-4 border-black p-4 rounded shadow-[4px_4px_0px_0px] h-[600px] overflow-y-auto mb-4 transition-transform transform hover:scale-105">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <span className="font-bold">{msg.sender}:</span> {msg.text}
            </div>
          ))}
        </div>
        {/* Input field removed as conversation is read-only */}
      </div>
      {finalMessage && (
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-white border-4 border-black p-4 rounded shadow-[4px_4px_0px_0px]">
            <span className="font-bold">Partner (Final Reply):</span> {finalMessage}
          </div>
        </div>
      )}
    </div>
  );
} 