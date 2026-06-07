'use client';

export default function GameSelector({ games, selected, onSelect }) {
  return (
    <div className="bg-gray-800 rounded-xl p-5">
      <h2 className="text-lg font-bold text-yellow-500 mb-4">🎮 JOGOS</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(games).map(([id, game]) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`p-4 rounded-xl text-center transition-all ${
              selected === id 
                ? 'bg-purple-600 border-2 border-purple-400 shadow-lg shadow-purple-500/20' 
                : 'bg-gray-700 hover:bg-gray-600 hover:scale-105'
            }`}
          >
            <div className="text-4xl mb-2">{game.icon}</div>
            <div className="font-bold">{game.name}</div>
            <div className="text-xs text-gray-400 mt-1">{game.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
