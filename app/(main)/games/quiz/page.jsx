"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const questions = [
  {
    q: "Which planet has the most moons?",
    options: ["Earth", "Jupiter", "Mars"],
    a: "Jupiter",
  },
  { q: "Hottest planet?", options: ["Venus", "Mercury", "Mars"], a: "Venus" },
  {
    q: "Largest planet?",
    options: ["Saturn", "Jupiter", "Mars"],
    a: "Jupiter",
  },
  { q: "Red Planet?", options: ["Mars", "Venus", "Mercury"], a: "Mars" },
];

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (opt) => {
    if (opt === questions[step].a) setScore(score + 1);
    if (step + 1 < questions.length) setStep(step + 1);
    else setFinished(true);
  };

  const percentage = (score / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white">
      {!finished ? (
        <div className="bg-gray-800 p-6 rounded-xl max-w-md">
          <h2 className="text-xl font-bold mb-4">{questions[step].q}</h2>
          {questions[step].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="block w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-3 mb-3"
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="relative w-full h-[400px] flex items-center justify-center">
          {/* Earth */}
          <div className="absolute left-0 bottom-10 text-4xl">🌍</div>
          {/* Rocket */}
          <motion.div
            className="absolute bottom-20 text-4xl"
            animate={
              percentage === 0
                ? { x: 0, rotate: [0, -10, 10, -10, 0] }
                : percentage < 50
                ? { x: "50vw", y: [0, -20, 0] }
                : { x: "90vw", y: [0, -40, 0] }
            }
            transition={{ duration: 3 }}
          >
            🚀
          </motion.div>
          {/* Mars */}
          <div className="absolute right-0 bottom-20 text-4xl">🪐</div>
          {/* Crash Explosion */}
          {percentage >= 30 && percentage < 50 && (
            <motion.div
              className="absolute left-1/2 bottom-24 text-5xl"
              animate={{ scale: [0, 1.5, 0] }}
              transition={{ duration: 1, delay: 3 }}
            >
              💥
            </motion.div>
          )}
          <div className="absolute top-4 text-center w-full">
            <p className="text-lg">
              Score: {score}/{questions.length} ({Math.round(percentage)}%)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
