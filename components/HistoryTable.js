'use client';

export default function HistoryTable({ history }) {
  const getWinnerClass = (winner) => {
    if (winner === 'Banker') return 'text-yellow-500';
    if (winner === 'Player') return 'text-green-500';
    return 'text-gray-400';
  };
  
  return (
    <div className="bg-gray-800 rounded-xl p-5">
      <h3 className="text-md font-bold text-yellow-500 mb-4">📜 HISTÓRICO</h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {history.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Aguardando rodadas...</div>
        ) : (
          history.map((item, idx) => (
            <div key={item.id} className="bg-gray-700 rounded-lg p-3 flex justify-between items-center">
              <div className="text-xs text-gray-400">#{history.length - idx}</div>
              <div className={`font-bold ${getWinnerClass(item.winner)}`}>
                {item.winner === 'Banker' ? '🏦 BANKER' : item.winner === 'Player' ? '👤 PLAYER' : '🤝 TIE'}
              </div>
              <div className="text-xs font-mono text-gray-300">
                {item.playerScore} vs {item.bankerScore}
              </div>
              <div className="text-xs text-gray-500">{item.time}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
