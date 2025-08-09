'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../AuthProvider';

const COLORS = ['🔴', '🟡', '🟢', '🔵', '🟣', '🟠'];

export default function MemoryClicker() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [gameState, setGameState] = useState('ready'); // 'ready', 'showing', 'playing', 'finished'
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showingIndex, setShowingIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [message, setMessage] = useState('');
  
  const router = useRouter();
  const { user } = useAuthContext();
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Load best score from localStorage
    const history = JSON.parse(localStorage.getItem('gameHub_history') || '[]');
    const memoryHistory = history.filter(h => h.gameId === 'memory-clicker');
    if (memoryHistory.length > 0) {
      const best = Math.max(...memoryHistory.map(h => h.score));
      setBestScore(best);
    }
  }, []);

  const generateSequence = (length) => {
    const newSequence = [];
    for (let i = 0; i < length; i++) {
      newSequence.push(Math.floor(Math.random() * 6));
    }
    return newSequence;
  };

  const startGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setPlayerSequence([]);
    setMessage('Watch the sequence...');
    const newSequence = generateSequence(3);
    setSequence(newSequence);
    showSequence(newSequence);
  };

  const showSequence = (seq) => {
    setGameState('showing');
    setShowingIndex(-1);
    
    let index = 0;
    const showNext = () => {
      if (index < seq.length) {
        setShowingIndex(index);
        timeoutRef.current = setTimeout(() => {
          setShowingIndex(-1);
          timeoutRef.current = setTimeout(() => {
            index++;
            showNext();
          }, 300);
        }, 600);
      } else {
        setGameState('playing');
        setMessage('Now repeat the sequence!');
      }
    };
    
    timeoutRef.current = setTimeout(showNext, 1000);
  };

  const handleColorClick = (colorIndex) => {
    if (gameState !== 'playing') return;

    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);

    // Check if the click is correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      // Wrong sequence
      finishGame(false);
      return;
    }

    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      // Correct sequence completed
      const newScore = score + sequence.length * 10;
      setScore(newScore);
      setMessage('Correct! Next level...');
      
      setTimeout(() => {
        const nextLevel = currentLevel + 1;
        setCurrentLevel(nextLevel);
        setPlayerSequence([]);
        
        if (nextLevel <= 5) {
          // Generate longer sequence
          const newSequence = generateSequence(2 + nextLevel);
          setSequence(newSequence);
          setMessage('Watch the new sequence...');
          showSequence(newSequence);
        } else {
          // Game completed successfully
          finishGame(true, newScore);
        }
      }, 1500);
    }
  };

  const finishGame = (success, finalScore = score) => {
    setGameState('finished');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Save to history
    const gameResult = {
      id: Date.now(),
      gameId: 'memory-clicker',
      gameName: 'Memory Clicker',
      score: finalScore,
      level: success ? 5 : currentLevel - 1,
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
    
    setMessage(success ? 'Amazing! You completed all levels!' : 'Oops! Wrong sequence. Try again!');
  };

  const resetGame = () => {
    setGameState('ready');
    setSequence([]);
    setPlayerSequence([]);
    setCurrentLevel(1);
    setScore(0);
    setShowingIndex(-1);
    setMessage('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="text-center">
      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{currentLevel}</div>
          <div className="text-sm text-gray-600">Level</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{score}</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{bestScore}</div>
          <div className="text-sm text-gray-600">Best Score</div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="text-lg font-semibold text-gray-700 mb-6 h-8">
          {message}
        </div>
      )}

      {/* Game Area */}
      {gameState === 'ready' && (
        <div className="space-y-6">
          <div className="text-lg text-gray-600 mb-6">
            Watch the sequence of colors, then repeat it by clicking in the same order!
          </div>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold py-6 px-12 rounded-full hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            🧠 Start Memory Test
          </button>
        </div>
      )}

      {(gameState === 'showing' || gameState === 'playing') && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {COLORS.map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorClick(index)}
                disabled={gameState === 'showing'}
                className={`w-20 h-20 text-4xl rounded-lg transition-all duration-200 transform ${
                  showingIndex === index
                    ? 'scale-110 shadow-2xl bg-yellow-200'
                    : gameState === 'playing'
                    ? 'hover:scale-105 bg-gray-100 hover:bg-gray-200 active:scale-95 shadow-lg'
                    : 'bg-gray-100 shadow-lg'
                } ${
                  gameState === 'showing' && showingIndex !== index
                    ? 'opacity-50'
                    : ''
                }`}
              >
                {color}
              </button>
            ))}
          </div>
          
          {gameState === 'playing' && (
            <div className="text-sm text-gray-500">
              Progress: {playerSequence.length} / {sequence.length}
            </div>
          )}
        </div>
      )}

      {gameState === 'finished' && (
        <div className="space-y-6">
          <div className="text-6xl mb-4">
            {score > bestScore ? '🎉' : score >= 50 ? '🌟' : '🎯'}
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            Game Over!
          </div>
          <div className="text-lg text-gray-600 mb-6">
            Final Score: <span className="font-bold text-purple-600">{score}</span>
            <br />
            Reached Level: <span className="font-bold text-blue-600">{currentLevel}</span>
            {score > bestScore && (
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
