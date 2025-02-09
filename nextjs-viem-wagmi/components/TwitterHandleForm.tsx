import { useState } from "react";

interface TwitterHandleFormProps {
  onComplete: (twitterHandle: string) => void;
}

export default function TwitterHandleForm({ onComplete }: TwitterHandleFormProps) {
  const [twitterHandle, setTwitterHandle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twitterHandle.trim()) {
      // Display error message and stay on current view if no handle is provided
      setErrorMessage("Please enter your Twitter handle.");
      return;
    }
    // Clear any previous error
    setErrorMessage("");
    
    setLoading(true);
    try {
      // Make GET request to scrape Twitter endpoint
      const response = await fetch(`http://localhost:3005/scrape-twitter/${twitterHandle}`, {
        method: "GET",
      });
      // Validate that the response status is exactly 200
      if (response.status !== 200) {
        setErrorMessage("Failed to scrape Twitter. Please check your handle and try again.");
        setLoading(false);
        return;
      }
      // Optionally handle the response here
    } catch (error) {
      console.error("Error scraping Twitter:", error);
      setErrorMessage("Error scraping Twitter. Please try again.");
      setLoading(false);
      return;
    }
    // Simulate a 10-second loader period before proceeding to the next stage
    setTimeout(() => {
      setLoading(false);
      onComplete(twitterHandle);
    }, 10000);
  };

  return (
    <div className="max-w-md w-full border-4 border-black p-8 bg-white rounded-lg shadow-[10px_10px_0px_0px] transition-transform transform hover:scale-105">
      {loading ? (
        <div className="text-center">
          <p className="text-xl mb-4">Scraping Twitter data...</p>
          {/* Placeholder for a loader (e.g., spinner) */}
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4 text-center">Enter Your Twitter Handle</h2>
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              placeholder="your_twitter_handle"
              className="w-full border-2 border-black p-2 mb-4 focus:outline-none"
            />
            <button 
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-2 border-black rounded"
            >
              Submit
            </button>
          </form>
        </>
      )}
    </div>
  );
} 