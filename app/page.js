'use client';

import { useState, useEffect } from 'react';
import LoginModal from '@/components/LoginModal';
import VideoPlayer from '@/components/VideoPlayer';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);
  const [evoSessionId, setEvoSessionId] = useState(null);
  const [selectedGame, setSelectedGame] = useState('SortenabetFS0001');

  const handleLogin = (token, evoId) => {
    console.log('🎉 Login detectado!');
    setJwtToken(token);
    setEvoSessionId(evoId);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Football Studio</h1>
            <p className="text-gray-400 text-sm">AO VIVO</p>
          </div>
          <div className="bg-green-600/20 px-3 py-1 rounded-full">
            <span className="text-green-400 text-sm">🎥 Conectado</span>
          </div>
        </div>

        {/* Vídeo ao vivo */}
        <VideoPlayer evoSessionId={evoSessionId} gameId={selectedGame} />
        
        {/* Botão de logout */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setJwtToken(null);
              setEvoSessionId(null);
            }}
            className="text-gray-500 text-sm hover:text-gray-300"
          >
            Sair
          </button>
        </div>
      </div>
    </main>
  );
}
