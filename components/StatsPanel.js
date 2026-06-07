'use client';

export default function StatsPanel({ stats, balance }) {
  const total = stats.banker + stats.player + stats.tie;

  return (
    <div className="bg-gray-800 rounded-xl p-5">
      <h3 className="text-md font-bold text-yellow-500 mb-4">📊 ESTATÍSTICAS</h3>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-yellow-900/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-500">{stats.banker}</div>
          <div className="text-xs text-gray-400">🏦 Banker</div>
          <div className="text-xs text-gray-500">{total ? ((stats.banker/total)*100).toFixed(1) : 0}%</div>
        </div>
        <div className="bg-green-900/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-500">{stats.player}</div>
          <div className="text-xs text-gray-400">👤 Player</div>
          <div className="text-xs text-gray-500">{total ? ((stats.player/total)*100).toFixed(1) : 0}%</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-400">{stats.tie}</div>
          <div className="text-xs text-gray-400">🤝 Tie</div>
          <div className="text-xs text-gray-500">{total ? ((stats.tie/total)*100).toFixed(1) : 0}%</div>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-3">
        <div className="flex justify-between">
          <span className="text-gray-400">💰 Saldo:</span>
          <span className="text-green-400 font-mono">R$ {balance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-gray-400">🎲 Total mãos:</span>
          <span className="text-white">{total}</span>
        </div>
      </div>
    </div>
  );
}
