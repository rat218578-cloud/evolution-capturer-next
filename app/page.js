'use client';

import { useState, useEffect } from 'react';
import EvolutionIframe from '@/components/EvolutionIframe';
import VideoPlayer from '@/components/VideoPlayer';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [evoSessionId, setEvoSessionId] = useState(null);
  const [selectedGame, setSelectedGame] = useState('bacbo');

  // Verifica se já tem token salvo
  useEffect(() => {
    const savedToken = localStorage.getItem('diogo_token');
    if (savedToken && savedToken.length > 50) {
      console.log('✅ Token encontrado no localStorage, usuário já logado');
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token) => {
    console.log('🎉 Login detectado!');
    localStorage.setItem('diogo_token', token);
    setIsLoggedIn(true);
  };

  const handleEvoSessionId = (sessionId) => {
    console.log('🎮 EVOSESSIONID recebido:', sessionId);
    setEvoSessionId(sessionId);
  };

  const handleGameChange = (game) => {
    setSelectedGame(game);
    // Recarrega o iframe com novo jogo
    if (typeof window !== 'undefined' && window.__refreshEvolutionIframe) {
      window.__refreshEvolutionIframe();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
        <div className="bg-gray-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
          <div className="p-5 text-center border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Faça login para jogar</h2>
            <p className="text-gray-400 text-sm mt-1">
              Entre com suas credenciais da <span className="text-yellow-500">Sorte na Bet</span>
            </p>
          </div>
          
          <div className="h-[500px]">
            <EvolutionIframe 
              onLogin={handleLogin} 
              onEvoSessionId={handleEvoSessionId}
              gameId={selectedGame}
            />
          </div>
          
          <div className="p-4 text-center border-t border-gray-700">
            <p className="text-gray-400 text-sm">Faça login no formulário acima</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Evolution CAPTURER</h1>
            <p className="text-gray-400 text-sm">AO VIVO</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.__refreshEvolutionIframe) {
                  window.__refreshEvolutionIframe();
                }
              }}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
            >
              🔄 Novo Jogo (F5)
            </button>
            
            <button
              onClick={() => {
                localStorage.removeItem('diogo_token');
                setIsLoggedIn(false);
                setEvoSessionId(null);
              }}
              className="bg-red-600/20 hover:bg-red-600/30 px-4 py-2 rounded-lg text-sm text-red-400"
            >
              Sair
            </button>
          </div>
        </div>
        
        {/* Vídeo ao vivo */}
        {evoSessionId && (
          <div className="mb-6">
            <VideoPlayer evoSessionId={evoSessionId} gameId={selectedGame} />
          </div>
        )}
        
        {/* Iframe do jogo (visível ou oculto) */}
        <div className="h-[600px] rounded-xl overflow-hidden border border-gray-700">
          <EvolutionIframe 
            onLogin={handleLogin} 
            onEvoSessionId={handleEvoSessionId}
            gameId={selectedGame}
          />
        </div>
      </div>
    </main>
  );
}
