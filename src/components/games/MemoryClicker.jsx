'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../AuthProvider';

const COLORS = ['red', 'blue', 'green', 'yellow'];

export default function MemoryClicker() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [gameState, setGameState] = useState('ready');
  const [showingIndex, setShowingIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [message, setMessage] = useState('');
  
  const router = useRouter();
  const { user } = useAuthContext();

  useEffect(() => {
    const savedHighScore = localStorage.getItem('memoryClicker_highScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const startGame = () => {
    const newSequence = [Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    setPlayerSequence([]);
    setScore(0);
    setMessage('Watch carefully...');
    showSequence(newSequence);
  };

  const showSequence = (seq) => {
    setGameState('showing');
    setShowingIndex(-1);
    
    let index = 0;
    const showNext = () => {
      if (index < seq.length) {
        setShowingIndex(seq[index]);
        setTimeout(() => {
          setShowingIndex(-1);
          setTimeout(() => {
            index++;
            showNext();
          }, 500);
        }, 1000);
      } else {
        setGameState('playing');
        setMessage('Now click the colors in the same order!');
      }
    };
    
    setTimeout(showNext, 1000);
  };

  const handleColorClick = (colorIndex) => {
    if (gameState !== 'playing') return;

    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);

    if (colorIndex !== sequence[newPlayerSequence.length - 1]) {
      finishGame();
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      setMessage('Correct! Next round...');
      
      setTimeout(() => {
        const nextSequence = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(nextSequence);
        setPlayerSequence([]);
        setMessage('Watch carefully...');
        showSequence(nextSequence);
      }, 1500);
    }
  };

  const finishGame = () => {
    setGameState('finished');
    setMessage('Wrong color! Game Over!');

    const gameResult = {
      id: Date.now(),
      gameId: 'memory-clicker',
      gameName: 'Memory Clicker',
      score: score,
      playedAt: new Date().toISOString(),
      userId: user?.email || 'guest'
    };

    const history = JSON.parse(localStorage.getItem('gameHub_history') || '[]');
    history.push(gameResult);
    localStorage.setItem('gameHub_history', JSON.stringify(history));

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('memoryClicker_highScore', score.toString());
    }
  };

  const resetGame = () => {
    setGameState('ready');
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setShowingIndex(-1);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Memory Clicker
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Remember and repeat the sequence
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">
              {score}
            </div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {highScore}
            </div>
            <div className="text-sm text-gray-600">High Score</div>
          </div>
        </div>

        {message && (
          <div className="text-center text-lg font-semibold text-gray-700 mb-6">
            {message}
          </div>
        )}

        {gameState === 'ready' && (
          <div className="text-center mb-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-blue-800">
                <strong>How to play:</strong><br />
                1. Watch the colors light up<br />
                2. Click them in the same order<br />
                3. Each round adds one more color!
              </p>
            </div>
            <button
              onClick={startGame}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 px-8 rounded-lg"
            >
              Start Game
            </button>
          </div>
        )}

        {(gameState === 'showing' || gameState === 'playing') && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {COLORS.map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorClick(index)}
                disabled={gameState === 'showing'}
                className={`w-24 h-24 rounded-lg transition-all duration-300 ${
                  showingIndex === index
                    ? 'scale-110 shadow-2xl'
                    : gameState === 'playing'
                    ? 'hover:scale-105 shadow-lg'
                    : 'shadow-md'
                } ${
                  color === 'red' ? 'bg-red-500' :
                  color === 'blue' ? 'bg-blue-500' :
                  color === 'green' ? 'bg-green-500' :
                  'bg-yellow-500'
                } ${
                  showingIndex === index ? 'brightness-150' : 'brightness-100'
                }`}
              >
                <span className="text-white font-bold text-sm">
                  {color.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        )}

        {gameState === 'playing' && (
          <div className="text-center text-sm text-gray-600 mb-4">
            Progress: {playerSequence.length} / {sequence.length}
          </div>
        )}

        {gameState === 'finished' && (
          <div className="text-center">
            <div className="text-4xl mb-4">
              {score >= 5 ? '�' : '😅'}
            </div>
            <div className="text-xl font-bold text-gray-800 mb-4">
              Game Over!
            </div>
            <div className="text-lg text-gray-600 mb-6">
              Final Score: <span className="font-bold text-blue-600">{score}</span>
              {score === highScore && score > 0 && (
                <div className="text-green-600 font-semibold mt-2">
                  🎉 New High Score!
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <button
                onClick={resetGame}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold"
              >
                Play Again
              </button>
              <button
                onClick={() => router.push('/games')}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold"
              >
                Back to Games
              </button>
              <button
                onClick={() => router.push('/history')}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold"
              >
                View History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
