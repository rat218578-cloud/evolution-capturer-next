'use client';

import { useState, useEffect } from 'react';

export default function LoginForm({ onLogin }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Função para ler o cookie EVOSESSIONID
  const getTokenFromCookie = () => {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith('EVOSESSIONID=')) {
        return cookie.substring('EVOSESSIONID='.length);
      }
    }
    return null;
  };

  // Verifica token existente
  const checkExistingToken = () => {
    if (typeof document === 'undefined') return false;
    const token = getTokenFromCookie();
    if (token && token.length > 10) {
      console.log('✅ Token encontrado!');
      onLogin(token, '1rwl0x');
      return true;
    }
    return false;
  };

  useEffect(() => {
    setIsClient(true);
    checkExistingToken();
  }, []);

  // Monitora cookie
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const interval = setInterval(() => {
      const token = getTokenFromCookie();
      if (token && token.length > 10) {
        console.log('✅ Token capturado!');
        onLogin(token, '1rwl0x');
        clearInterval(interval);
        setIsModalOpen(false);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    return <div className="flex items-center justify-center min-h-[70vh]">Carregando...</div>;
  }

  const existingToken = getTokenFromCookie();
  if (existingToken && existingToken.length > 10) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-xl text-center">
          <div className="text-5xl mb-3">🎰</div>
          <h2 className="text-2xl font-bold text-green-500 mb-2">Evolution Capturer</h2>
          <p className="text-gray-400 text-sm mb-6">
            Faça login com sua conta Sorte na Bet
          </p>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors"
          >
            🔐 FAZER LOGIN
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            Ou cole o token manualmente:
            <br />
            <code className="text-green-400">copy(document.cookie.match(/EVOSESSIONID=([^;]+)/)[1])</code>
          </p>
        </div>
      </div>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="font-bold text-white">Login Sorte na Bet</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="h-[500px]">
              <iframe
                src="https://sortenabet.evo-games.com/frontend/evo/r2/?game=bacbo&language=pt&currency=BRL"
                className="w-full h-full border-0"
                allow="same-origin *;"
              />
            </div>
            
            {checking && (
              <div className="p-3 text-center text-yellow-500 text-sm border-t border-gray-700">
                🔍 Detectando login...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
