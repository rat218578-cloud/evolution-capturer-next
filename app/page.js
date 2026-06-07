'use client';

import { useEffect, useMemo, useState } from 'react';
import GameSelector from '@/components/GameSelector';
import VideoPlayer from '@/components/VideoPlayer';
import StatsPanel from '@/components/StatsPanel';
import HistoryTable from '@/components/HistoryTable';
import LoginForm from '@/components/LoginForm';
import { GAMES, createDemoRound, summarizeStats } from '@/lib/evolution-api';

export default function Home() {
  const [selectedGame, setSelectedGame] = useState('bacbo');
  const [token, setToken] = useState(null);
  const [instance, setInstance] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [streamUrl, setStreamUrl] = useState('');
  const stats = useMemo(() => summarizeStats(history), [history]);

  useEffect(() => {
    if (!isLoggedIn) return undefined;

    const intervalId = window.setInterval(() => {
      setHistory((prev) => [createDemoRound(), ...prev].slice(0, 100));
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [isLoggedIn, selectedGame]);

  const handleLogin = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Falha no login');
    }

    setToken(data.EVOSESSIONID);
    setInstance(data.instance);
    setIsLoggedIn(true);
    setBalance(data.balance || 0);
    setStreamUrl('');
  };

  const switchGame = (gameId) => {
    setSelectedGame(gameId);
    setHistory([]);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <>
          <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-900/20 p-4 text-sm text-amber-100">
            Sessão demo ativa: <span className="font-mono">{token}</span> · Instância: {instance}. Use esta base para conectar apenas integrações próprias/autorizadas.
          </div>

          <GameSelector games={GAMES} selected={selectedGame} onSelect={switchGame} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-3">
              <VideoPlayer streamUrl={streamUrl} />
              <div className="rounded-lg bg-gray-800 p-4">
                <h2 className="text-lg font-bold text-yellow-500">
                  {GAMES[selectedGame].icon} {GAMES[selectedGame].name}
                </h2>
                <p className="text-sm text-gray-400">{GAMES[selectedGame].description}</p>
                <p className="mt-2 text-xs text-gray-500">ID Evolution cadastrado: {GAMES[selectedGame].evolutionId}</p>
              </div>
            </div>

            <div className="space-y-6">
              <StatsPanel stats={stats} balance={balance} />
              <HistoryTable history={history} />
            </div>
          </div>
        </>
      )}
    </main>
  );
}
