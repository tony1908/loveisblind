"use client";

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DynamicWidget } from "@/lib/dynamic";
import OnboardingWizard from '@/components/OnboardingWizard';
import HomeDashboard from '@/components/HomeDashboard';
import Header from '@/components/Header';
import TwitterHandleForm from "@/components/TwitterHandleForm";

export default function Main() {
  const { primaryWallet } = useDynamicContext();
  const isLoggedIn = Boolean(primaryWallet);
  const router = useRouter();

  const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
  const [stage, setStage] = useState<string>('twitter');

  useEffect(() => {
    const storedHandle = localStorage.getItem("twitterHandle");
    if (storedHandle) {
      setTwitterHandle(storedHandle);
      setStage("home");
    } else {
      const storedStage = localStorage.getItem("stage");
      if (storedStage) {
        setStage(storedStage);
      }
    }
  }, []);

  const handleTwitterComplete = (handle: string) => {
    setTwitterHandle(handle);
    localStorage.setItem("twitterHandle", handle);
    setStage("onboarding");
    localStorage.setItem("stage", "onboarding");
  };

  const handleWizardComplete = async (responses: {
    perfectDate: string;
    funniestJoke: string;
    funniestMeme: string;
    funniestTiktok: string;
  }) => {
    const url = `http://localhost:3006/api/convert-to-dating/${twitterHandle}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responses),
      });
      if (!response.ok) {
        throw new Error("Failed to convert to dating");
      }
    } catch (error) {
      console.error("Error during convert-to-dating request:", error);
    }
    setStage("chat");
    localStorage.setItem("stage", "chat");
  };

  const handleChatComplete = () => {
    setStage("home");
    localStorage.setItem("stage", "home");
    localStorage.setItem("onboarded", "true");
  };

  if (stage === "chat") {
    router.push("/chat");
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-yellow-300 text-black p-4">
        {!isLoggedIn ? (
          <div className="max-w-3xl bg-white border-4 border-black p-8 rounded-lg shadow-[10px_10px_0px_0px] transition-transform transform hover:scale-105">
            <h1 className="text-5xl font-extrabold mb-4 text-center">Love is Blind</h1>
            <p className="text-xl mb-6 text-center">
              Experience dating like never before with your very own personality agent clone.
              Connect, interact, and discover if you can find potential romantic partners by allowing your agent to communicate with other agents.
              Embrace the excitement of exploring new connections and step into a world where love is truly blind.
            </p>
          </div>
        ) : stage === "twitter" ? (
          <TwitterHandleForm onComplete={handleTwitterComplete} />
        ) : stage === "onboarding" ? (
          <OnboardingWizard onComplete={handleWizardComplete} />
        ) : (
          <HomeDashboard showChatButton={false} />
        )}
      </main>
    </>
  );
}
