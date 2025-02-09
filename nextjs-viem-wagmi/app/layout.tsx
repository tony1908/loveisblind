import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import Header from "../components/Header";

import { Providers } from "./providers";
import { StageProvider } from '@/contexts/StageContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neobrutalism App",
  description: "A neobrutalism styled Next.js application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-black`}>
        <StageProvider>
          <Providers>
            {children}
          </Providers>
        </StageProvider>
      </body>
    </html>
  );
}
