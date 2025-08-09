'use client';

import { useParams } from 'next/navigation';
import Navigation from '../../../components/Navigation';
import TapCounter from '../../../components/games/TapCounter';
import MemoryClicker from '../../../components/games/MemoryClicker';
import LuckyBox from '../../../components/games/LuckyBox';

const gameComponents = {
  'tap-counter': TapCounter,
  'memory-clicker': MemoryClicker,
  'lucky-box': LuckyBox
};

const gameInfo = {
  'tap-counter': {
    name: 'Tap Counter',
    emoji: '👆',
    description: 'Tap as fast as you can in 10 seconds!',
    instructions: 'Click the button as many times as possible before time runs out.'
  },
  'memory-clicker': {
    name: 'Memory Clicker',
    emoji: '🧠',
    description: 'Remember and repeat the sequence',
    instructions: 'Watch the sequence of highlighted buttons, then click them in the same order.'
  },
  'lucky-box': {
    name: 'Lucky Box',
    emoji: '🎁',
    description: 'Pick a box and discover your prize!',
    instructions: 'Choose one of the three boxes to reveal what\'s inside.'
  }
};

export default function GamePage() {
  const params = useParams();
  const slug = params.slug;
  
  const GameComponent = gameComponents[slug];
  const info = gameInfo[slug];

  if (!GameComponent || !info) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Game Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The game you're looking for doesn't exist.</p>
          <a href="/games" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-500 transition duration-200">
            Back to Games
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{info.emoji}</div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">{info.name}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{info.description}</p>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800 dark:text-blue-300">
              <strong>How to play:</strong> {info.instructions}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-800">
          <GameComponent />
        </div>
      </div>
    </div>
  );
}
