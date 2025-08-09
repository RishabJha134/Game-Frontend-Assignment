'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../AuthProvider';

export default function TapCounter() {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'finished'
  const [bestScore, setBestScore] = useState(0);
  const intervalRef = useRef(null);
  const router = useRouter();
  const { user } = useAuthContext();

  useEffect(() => {
    // Load best score from localStorage
    const history = JSON.parse(localStorage.getItem('gameHub_history') || '[]');
    const tapCounterHistory = history.filter(h => h.gameId === 'tap-counter');
    if (tapCounterHistory.length > 0) {
      const best = Math.max(...tapCounterHistory.map(h => h.score));
      setBestScore(best);
    }
  }, []);

  const startGame = () => {
    setGameState('playing');
    setTaps(0);
    setTimeLeft(10);
    
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finishGame = () => {
    setGameState('finished');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Save to history
    const gameResult = {
      id: Date.now(),
      gameId: 'tap-counter',
      gameName: 'Tap Counter',
      score: taps,
      playedAt: new Date().toISOString(),
      userId: user.email
    };
    
    const history = JSON.parse(localStorage.getItem('gameHub_history') || '[]');
    history.push(gameResult);
    localStorage.setItem('gameHub_history', JSON.stringify(history));
    
    // Update best score
    if (taps > bestScore) {
      setBestScore(taps);
    }
  };

  const handleTap = () => {
    if (gameState === 'playing') {
      setTaps(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setGameState('ready');
    setTaps(0);
    setTimeLeft(10);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="text-center">
      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{taps}</div>
          <div className="text-sm text-gray-600">Current Taps</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{timeLeft}</div>
          <div className="text-sm text-gray-600">Time Left</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{bestScore}</div>
          <div className="text-sm text-gray-600">Best Score</div>
        </div>
      </div>

      {/* Game Area */}
      {gameState === 'ready' && (
        <div className="space-y-6">
          <div className="text-lg text-gray-600 mb-6">
            Ready to test your tapping speed? You have 10 seconds!
          </div>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl font-bold py-6 px-12 rounded-full hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            🚀 Start Game
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-6">
          <div className="text-lg font-semibold text-gray-700 mb-6">
            Tap as fast as you can! ⚡
          </div>
          <button
            onClick={handleTap}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold py-20 px-20 rounded-full hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 active:scale-95 transition-all duration-100 shadow-xl select-none"
            style={{ 
              background: `linear-gradient(45deg, hsl(${(taps * 10) % 360}, 70%, 60%), hsl(${(taps * 10 + 60) % 360}, 70%, 60%))`
            }}
          >
            👆 TAP ME!
          </button>
          <div className="text-sm text-gray-500">
            Taps: {taps} | Time: {timeLeft}s
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="space-y-6">
          <div className="text-6xl mb-4">
            {taps > bestScore ? '🎉' : taps >= 20 ? '👏' : '👍'}
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            Game Over!
          </div>
          <div className="text-lg text-gray-600 mb-6">
            You got <span className="font-bold text-blue-600">{taps}</span> taps in 10 seconds!
            {taps > bestScore && (
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
    </div>
  );
}
