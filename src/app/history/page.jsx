'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedGame, setSelectedGame] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'score', 'game'

  useEffect(() => {
    // Load history from localStorage
    const gameHistory = JSON.parse(localStorage.getItem('gameHub_history') || '[]');
    setHistory(gameHistory.reverse()); // Show most recent first
    setFilteredHistory(gameHistory);
  }, []);

  useEffect(() => {
    // Filter and sort history
    let filtered = history;
    
    // Filter by game
    if (selectedGame !== 'all') {
      filtered = history.filter(h => h.gameId === selectedGame);
    }
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch(sortBy) {
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'game':
          return a.gameName.localeCompare(b.gameName);
        case 'date':
        default:
          return new Date(b.playedAt) - new Date(a.playedAt);
      }
    });
    
    setFilteredHistory(filtered);
  }, [history, selectedGame, sortBy]);

  const getGameEmoji = (gameId) => {
    switch(gameId) {
      case 'tap-counter': return '👆';
      case 'memory-clicker': return '🧠';
      case 'lucky-box': return '🎁';
      default: return '🎮';
    }
  };

  const getScoreColor = (gameId, score) => {
    switch(gameId) {
      case 'tap-counter':
        if (score >= 50) return 'text-yellow-600';
        if (score >= 30) return 'text-green-600';
        if (score >= 20) return 'text-blue-600';
        return 'text-gray-600';
      case 'memory-clicker':
        if (score >= 100) return 'text-yellow-600';
        if (score >= 60) return 'text-green-600';
        if (score >= 30) return 'text-blue-600';
        return 'text-gray-600';
      case 'lucky-box':
        if (score >= 250) return 'text-yellow-600';
        if (score >= 200) return 'text-green-600';
        if (score >= 150) return 'text-blue-600';
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getStats = () => {
    const totalGames = history.length;
    const gamesPlayed = new Set(history.map(h => h.gameId)).size;
    const totalScore = history.reduce((sum, h) => sum + (h.score || 0), 0);
    const bestScore = Math.max(...history.map(h => h.score || 0), 0);
    
    return { totalGames, gamesPlayed, totalScore, bestScore };
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all game history? This action cannot be undone.')) {
      localStorage.removeItem('gameHub_history');
      setHistory([]);
      setFilteredHistory([]);
    }
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            📜 Game History
          </h1>
          <p className="text-lg text-gray-600">
            Track your gaming progress and achievements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalGames}</div>
            <div className="text-gray-600 text-sm">Total Games</div>
          </div>
          {/* <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.gamesPlayed}</div>
            <div className="text-gray-600 text-sm">Games Tried</div>
          </div> */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalScore}</div>
            <div className="text-gray-600 text-sm">Total Score</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.bestScore}</div>
            <div className="text-gray-600 text-sm">Best Score</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Game:
                </label>
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Games</option>
                  <option value="tap-counter">👆 Tap Counter</option>
                  <option value="memory-clicker">🧠 Memory Clicker</option>
                  <option value="lucky-box">🎁 Lucky Box</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="date">Date (Newest)</option>
                  <option value="score">Score (Highest)</option>
                  <option value="game">Game Name</option>
                </select>
              </div>
            </div>
            
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                🗑️ Clear History
              </button>
            )}
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Games Played Yet</h3>
            <p className="text-gray-600 mb-6">
              Start playing some games to see your history here!
            </p>
            <a
              href="/games"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition duration-200"
            >
              Play Games
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((game, index) => (
              <div
                key={game.id || index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className="text-4xl">{getGameEmoji(game.gameId)}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {game.gameName}
                      </h3>
                      <p className="text-gray-600">
                        {formatDate(game.playedAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(game.gameId, game.score)}`}>
                        {game.score || 0}
                      </div>
                      <div className="text-sm text-gray-500">Score</div>
                    </div>
                    
                    {game.level && (
                      <div className="text-center">
                        <div className="text-xl font-semibold text-purple-600">
                          {game.level}
                        </div>
                        <div className="text-sm text-gray-500">Level</div>
                      </div>
                    )}
                    
                    {game.rounds && (
                      <div className="text-center">
                        <div className="text-xl font-semibold text-blue-600">
                          {game.rounds}
                        </div>
                        <div className="text-sm text-gray-500">Rounds</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
