import { useState } from "react";

const questions = [
  "What is your idea of a perfect date?",
  "What's the funniest joke you know?",
  "What is the funniest meme you like?",
  "What is the funniest TikTok video you have seen?"
];

interface OnboardingWizardProps {
  onComplete: (responses: {
    perfectDate: string;
    funniestJoke: string;
    funniestMeme: string;
    funniestTiktok: string;
  }) => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed wizard - pass the responses from the wizard as an object
      onComplete({
        perfectDate: answers[0],
        funniestJoke: answers[1],
        funniestMeme: answers[2],
        funniestTiktok: answers[3],
      });
      console.log("Onboarding responses:", answers);
    }
  };

  return (
    <div className="max-w-md w-full border-4 border-black p-8 bg-gradient-to-r from-pink-100 to-yellow-100 rounded-lg shadow-[10px_10px_0px_0px] transition-transform transform hover:scale-105">
      <h2 className="text-2xl font-bold mb-4 text-center">Onboarding Wizard</h2>
      <p className="mb-2 text-lg">{questions[currentStep]}</p>
      <input
        type="text"
        value={answers[currentStep]}
        onChange={handleChange}
        className="w-full border-2 border-black p-2 mb-4 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-400"
        placeholder="Your answer..."
      />
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 px-4 border-2 border-black rounded transition-transform duration-200 hover:scale-105"
        >
          {currentStep === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
      <div className="mt-4 text-sm text-center">
        Step {currentStep + 1} of {questions.length}
      </div>
    </div>
  );
} 