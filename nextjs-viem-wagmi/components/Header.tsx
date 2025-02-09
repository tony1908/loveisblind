"use client";

import React from "react";
import { DynamicWidget } from "@/lib/dynamic";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between p-4 border-b-4 border-black bg-pink-100 shadow-[2px_2px_0px_0px]">
      <div className="flex items-center">
        <img src="https://ntvb.tmsimg.com/assets/p17821114_b_h10_aq.jpg?w=960&h=540" alt="logo" className="w-16 h-16 shadow-[4px_4px_0px_0px]" />
        <h1 className="text-3xl font-bold ml-4">Love is Blind</h1>
      </div>
      <div className="transition-transform hover:scale-105">
        <DynamicWidget />
      </div>
    </header>
  );
} 