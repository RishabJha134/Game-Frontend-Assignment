"use client";

import Navigation from "../../components/Navigation";
import Link from "next/link";
import { useEffect, useState } from 'react';

const games = [
  {
    id: "tap-counter",
    name: "Tap Counter",
    emoji: "👆",
    description: "Count as many taps as you can in 10 seconds!",
    tag: "Quick Play",
    difficulty: "Easy",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "memory-clicker",
    name: "Memory Clicker",
    emoji: "🧠",
    description: "Remember and click the sequence of icons",
    tag: "Memory",
    difficulty: "Medium",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "lucky-box",
    name: "Lucky Box",
    emoji: "🎁",
    description: "Pick a box and discover what prize awaits you!",
    tag: "Luck",
    difficulty: "Easy",
    color: "from-green-500 to-emerald-500",
  },
];

const MOCK_USERS = ["Alice","Bob","Charlie","Daisy","Ethan","Farah","Gabe","Hiro","Ivy","Jules"];

function generateLeaderboard() {
  const history = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('gameHub_history') || '[]' : '[]');
  const bestByUser = {};
  history.forEach(h => {
    const key = h.userId || 'anon';
    if (!bestByUser[key] || h.score > bestByUser[key].score) {
      bestByUser[key] = { user: key, score: h.score };
    }
  });
  const randomFakes = MOCK_USERS.map(name => ({ user: name.toLowerCase()+"@demo.com", score: Math.floor(Math.random()*250)+20 }));
  const combined = [...Object.values(bestByUser), ...randomFakes];
  return combined.sort((a,b)=>b.score-a.score).slice(0,10);
}

export default function GamesPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [nextFreeGame, setNextFreeGame] = useState(0);

  useEffect(() => {
    setLeaderboard(generateLeaderboard());
    const last = parseInt(localStorage.getItem('gameHub_lastFree') || '0',10);
    const now = Date.now();
    if (now - last >= 3600000) {
      localStorage.setItem('gameHub_lastFree', now.toString());
      setNextFreeGame(now + 3600000);
    } else {
      setNextFreeGame(last + 3600000);
    }
    const interval = setInterval(()=>{
      setLeaderboard(generateLeaderboard());
    }, 30000);
    return ()=>clearInterval(interval);
  }, []);

  const [countdown, setCountdown] = useState('');
  useEffect(()=>{
    if(!nextFreeGame) return;
    const t = setInterval(()=>{
      const diff = nextFreeGame - Date.now();
      if (diff <= 0) {
        setCountdown('Ready Now!');
      } else {
        const m = Math.floor(diff/60000);
        const s = Math.floor((diff%60000)/1000);
        setCountdown(`${m}m ${s}s`);
      }
    },1000);
    return ()=>clearInterval(t);
  },[nextFreeGame]);
  return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            🎮 Game Library
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from our collection of fun mini-games. Test your reflexes,
            memory, and luck!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-800"
            >
              <div
                className={`bg-gradient-to-r ${game.color} p-6 text-white relative`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{game.emoji}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {game.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
                <p className="text-white/90">{game.description}</p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Difficulty:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        game.difficulty === "Easy"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : game.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                    >
                      {game.difficulty}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/games/${game.id}`}
                  className={`w-full bg-gradient-to-r ${game.color} text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 block text-center group-hover:shadow-xl`}
                >
                  Play Now! 🚀
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
            🏆 Your Gaming Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {
                  JSON.parse(localStorage.getItem("gameHub_history") || "[]")
                    .length
                }
              </div>
              <div className="text-gray-600 dark:text-gray-400">Games Played</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {Math.max(
                  ...JSON.parse(
                    localStorage.getItem("gameHub_history") || "[]"
                  ).map((h) => h.score || 0),
                  0
                )}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Best Score</div>
            </div>
          </div>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">🏅 Leaderboard (Top 10)</h3>
            <ul className="space-y-2 text-sm">
              {leaderboard.map((row, idx)=>(
                <li key={row.user+idx} className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{idx+1}. {row.user.split('@')[0]}</span>
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">{row.score}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">⏰ Hourly Free Game</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-center">Come back every hour for a fresh luck boost!</p>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{countdown}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
