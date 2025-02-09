"use client";

import React, { createContext, ReactNode, useState, useEffect } from 'react';

export type StageType = "twitter" | "onboarding" | "chat" | "home";

// Create a context for the onboarding stage
export const StageContext = createContext<{
  stage: StageType;
  setStage: (stage: StageType) => void;
  twitterHandle: string | null;
  setTwitterHandle: (handle: string | null) => void;
}>({
  stage: "twitter",
  setStage: () => {},
  twitterHandle: null,
  setTwitterHandle: () => {},
});

export function StageProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<StageType>("twitter");
  const [twitterHandle, setTwitterHandle] = useState<string | null>(null);

  // Optionally, you can add useEffect to hydrate from localStorage if needed
  useEffect(() => {
    const storedStage = localStorage.getItem("stage") as StageType;
    const storedHandle = localStorage.getItem("twitterHandle");
    if (storedStage) {
      setStage(storedStage);
    }
    if (storedHandle) {
      setTwitterHandle(storedHandle);
    }
  }, []);

  return (
    <StageContext.Provider value={{ stage, setStage, twitterHandle, setTwitterHandle }}>
      {children}
    </StageContext.Provider>
  );
} 