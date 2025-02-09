"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PartnersPage() {
  // New state for partners list.
  const [partners, setPartners] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const response = await fetch("http://localhost:3008/api/characters");
        const data = await response.json();
        // Assume the response is of the form: { characters: string[] }
        if (data && Array.isArray(data.characters)) {
          // Retrieve the user's twitter handle from localStorage if available.
          const twitterHandle = localStorage.getItem("twitterHandle");
          // Filter out the element that matches the user's twitter handle.
          const filteredCharacters = twitterHandle
            ? data.characters.filter((name: string) => name !== twitterHandle)
            : data.characters;
          // Map each character name into a partner object.
          setPartners(filteredCharacters.map((name: string) => ({ id: name, name })));
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    }
    fetchCharacters();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100 p-8">
        <h1 className="text-4xl font-bold mb-4 text-center">Available Partners</h1>
        <ul className="max-w-md mx-auto space-y-4">
          {partners.map((partner) => (
            <li
              key={partner.id}
              className="border-4 border-black p-4 bg-white rounded shadow-[4px_4px_0px_0px] transition-transform transform hover:scale-105"
            >
              <Link
                href={`/partners/${partner.id}`}
                className="block font-bold text-xl text-center"
              >
                {partner.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
} 