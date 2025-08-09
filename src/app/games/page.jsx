"use client";

import Navigation from "../../components/Navigation";
import Link from "next/link";

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

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎮 Game Library
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our collection of fun mini-games. Test your reflexes,
            memory, and luck!
          </p>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Game Card Header */}
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

              {/* Game Card Body */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Difficulty:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        game.difficulty === "Easy"
                          ? "bg-green-100 text-green-700"
                          : game.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
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

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🏆 Your Gaming Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {
                  JSON.parse(localStorage.getItem("gameHub_history") || "[]")
                    .length
                }
              </div>
              <div className="text-gray-600">Games Played</div>
            </div>
            {/* <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {new Set(JSON.parse(localStorage.getItem('gameHub_history') || '[]').map(h => h.gameId)).size}
              </div>
              <div className="text-gray-600">Games Tried</div>
            </div> */}
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.max(
                  ...JSON.parse(
                    localStorage.getItem("gameHub_history") || "[]"
                  ).map((h) => h.score || 0),
                  0
                )}
              </div>
              <div className="text-gray-600">Best Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
