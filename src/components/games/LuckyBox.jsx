'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../AuthProvider';

const PRIZES = [
  { emoji: '💎', name: 'Diamond', points: 100, rarity: 'Legendary' },
  { emoji: '👑', name: 'Crown', points: 80, rarity: 'Epic' },
  { emoji: '🎯', name: 'Target', points: 60, rarity: 'Rare' },
  { emoji: '⭐', name: 'Star', points: 40, rarity: 'Uncommon' },
  { emoji: '🎪', name: 'Circus', points: 30, rarity: 'Common' },
  { emoji: '🎨', name: 'Art', points: 25, rarity: 'Common' },
  { emoji: '🎭', name: 'Drama', points: 20, rarity: 'Common' },
  { emoji: '🎪', name: 'Fun', points: 15, rarity: 'Common' },
  { emoji: '🎈', name: 'Balloon', points: 10, rarity: 'Common' },
  { emoji: '🍀', name: 'Luck', points: 5, rarity: 'Common' }
];

export default function LuckyBox() {
  const [gameState, setGameState] = useState('ready'); // 'ready', 'revealing', 'finished'
  const [selectedBox, setSelectedBox] = useState(null);
  const [prizes, setPrizes] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const router = useRouter();
  const { user } = useAuthContext();

  useEffect(() => {
    // Load best score from localStorage
    const history = JSON.parse(localStorage.getItem('gameHub_history') || '[]');
    const luckyBoxHistory = history.filter(h => h.gameId === 'lucky-box');
    if (luckyBoxHistory.length > 0) {
      const best = Math.max(...luckyBoxHistory.map(h => h.score));
      setBestScore(best);
    }
  }, []);

  const generatePrizes = () => {
    const shuffled = [...PRIZES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const startGame = () => {
    setGameState('ready');
    setPrizes(generatePrizes());
    setSelectedBox(null);
    setRounds(0);
    setTotalScore(0);
  };

  const selectBox = (boxIndex) => {
    if (gameState !== 'ready' || isAnimating) return;
    
    setSelectedBox(boxIndex);
    setIsAnimating(true);
    setGameState('revealing');
    
    setTimeout(() => {
      const selectedPrize = prizes[boxIndex];
      const newScore = totalScore + selectedPrize.points;
      const newRounds = rounds + 1;
      
      setTotalScore(newScore);
      setRounds(newRounds);
      setIsAnimating(false);
      
      // Check if game should continue (max 5 rounds)
      if (newRounds >= 5) {
        finishGame(newScore);
      } else {
        setTimeout(() => {
          if (newRounds < 5) {
            // Continue to next round
            setPrizes(generatePrizes());
            setSelectedBox(null);
            setGameState('ready');
          }
        }, 2000);
      }
    }, 1500);
  };

  const finishGame = (finalScore = totalScore) => {
    setGameState('finished');
    
    // Save to history
    const gameResult = {
      id: Date.now(),
      gameId: 'lucky-box',
      gameName: 'Lucky Box',
      score: finalScore,
      rounds: rounds,
      playedAt: new Date().toISOString(),
      userId: user.email
    };
    
    const history = JSON.parse(localStorage.getItem('gameHub_history') || '[]');
    history.push(gameResult);
    localStorage.setItem('gameHub_history', JSON.stringify(history));
    
    // Update best score
    if (finalScore > bestScore) {
      setBestScore(finalScore);
    }
  };

  const resetGame = () => {
    setGameState('ready');
    setPrizes(generatePrizes());
    setSelectedBox(null);
    setTotalScore(0);
    setRounds(0);
    setIsAnimating(false);
  };

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'Legendary': return 'text-yellow-600 bg-yellow-100';
      case 'Epic': return 'text-purple-600 bg-purple-100';
      case 'Rare': return 'text-blue-600 bg-blue-100';
      case 'Uncommon': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Initial setup
  useEffect(() => {
    if (prizes.length === 0) {
      setPrizes(generatePrizes());
    }
  }, [prizes.length]);

  return (
    <div className="text-center">
      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{rounds}/5</div>
          <div className="text-sm text-gray-600">Rounds</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{totalScore}</div>
          <div className="text-sm text-gray-600">Total Score</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{bestScore}</div>
          <div className="text-sm text-gray-600">Best Score</div>
        </div>
      </div>

      {/* Game Instructions */}
      {rounds === 0 && gameState === 'ready' && (
        <div className="text-lg text-gray-600 mb-8">
          Choose a mystery box to reveal your prize! You get 5 rounds to collect points.
        </div>
      )}

      {rounds > 0 && gameState === 'ready' && (
        <div className="text-lg text-gray-600 mb-8">
          Round {rounds + 1}/5 - Pick another box!
        </div>
      )}

      {/* Boxes */}
      {(gameState === 'ready' || gameState === 'revealing') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          {[0, 1, 2].map((boxIndex) => (
            <div
              key={boxIndex}
              onClick={() => selectBox(boxIndex)}
              className={`relative bg-gradient-to-b from-amber-400 to-amber-600 rounded-2xl p-8 cursor-pointer transform transition-all duration-300 ${
                isAnimating || gameState === 'revealing'
                  ? 'cursor-not-allowed'
                  : 'hover:scale-105 hover:shadow-2xl'
              } ${
                selectedBox === boxIndex && gameState === 'revealing'
                  ? 'scale-110 shadow-2xl ring-4 ring-yellow-400'
                  : ''
              }`}
              style={{
                minHeight: '200px'
              }}
            >
              {/* Box Lid */}
              <div className={`transition-all duration-1000 ${
                selectedBox === boxIndex && gameState === 'revealing'
                  ? 'transform -translate-y-4 rotate-12 opacity-50'
                  : ''
              }`}>
                <div className="text-6xl mb-4">🎁</div>
                <div className="text-white font-bold text-lg">Mystery Box</div>
                <div className="text-yellow-100 text-sm">Click to open!</div>
              </div>

              {/* Revealed Prize */}
              {selectedBox === boxIndex && gameState === 'revealing' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-2xl border-4 border-yellow-400 transition-all duration-500">
                  <div className="text-6xl mb-2 animate-bounce">{prizes[boxIndex]?.emoji}</div>
                  <div className="text-xl font-bold text-gray-800 mb-2">{prizes[boxIndex]?.name}</div>
                  <div className="text-2xl font-bold text-green-600 mb-2">+{prizes[boxIndex]?.points} pts</div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRarityColor(prizes[boxIndex]?.rarity)}`}>
                    {prizes[boxIndex]?.rarity}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Game Finished */}
      {gameState === 'finished' && (
        <div className="space-y-6">
          <div className="text-6xl mb-4">
            {totalScore > bestScore ? '🎉' : totalScore >= 200 ? '🌟' : '🎁'}
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            Game Complete!
          </div>
          <div className="text-lg text-gray-600 mb-6">
            Final Score: <span className="font-bold text-green-600">{totalScore}</span> points
            <br />
            Rounds Played: <span className="font-bold text-yellow-600">{rounds}</span>/5
            {totalScore > bestScore && (
              <div className="text-green-600 font-semibold mt-2">
                🎉 New Personal Best!
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-8 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition duration-200"
            >
              🔄 Play Again
            </button>
            <button
              onClick={() => router.push('/games')}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-8 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition duration-200"
            >
              🎮 Back to Games
            </button>
            <button
              onClick={() => router.push('/history')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition duration-200"
            >
              📜 View History
            </button>
          </div>
        </div>
      )}

      {/* Start Game Button (first time) */}
      {rounds === 0 && gameState === 'ready' && totalScore === 0 && (
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xl font-bold py-6 px-12 rounded-full hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg mt-4"
        >
          🎁 Start Lucky Box Game
        </button>
      )}
    </div>
  );
}
