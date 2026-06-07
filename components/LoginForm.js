'use client';

import { useState, useEffect } from 'react';

export default function LoginForm({ onLogin }) {
  const [showIframe, setShowIframe] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Função para ler o cookie EVOSESSIONID diretamente (só no cliente)
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

  // Função para verificar se já tem token
  const checkExistingToken = () => {
    if (typeof document === 'undefined') return false;
    const token = getTokenFromCookie();
    if (token && token.length > 10) {
      console.log('✅ Token encontrado no cookie!');
      onLogin(token, '1rwl0x');
      return true;
    }
    return false;
  };

  // Marcar que está no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Monitora o cookie em busca de mudanças (só no cliente)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    // Verifica ao montar
    checkExistingToken();
    
    // Monitora mudanças no cookie a cada 2 segundos
    const interval = setInterval(() => {
      const token = getTokenFromCookie();
      if (token && token.length > 10) {
        console.log('✅ Token capturado do cookie automaticamente!');
        onLogin(token, '1rwl0x');
        clearInterval(interval);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Quando o iframe carregar, tenta capturar o token
  const handleIframeLoad = () => {
    if (typeof document === 'undefined') return;
    console.log('🔍 Iframe carregado, monitorando cookie...');
    setChecking(true);
    
    let attempts = 0;
    const captureInterval = setInterval(() => {
      attempts++;
      const token = getTokenFromCookie();
      
      if (token && token.length > 10) {
        console.log('✅ Token capturado do iframe!');
        onLogin(token, '1rwl0x');
        clearInterval(captureInterval);
        setShowIframe(false);
      } else if (attempts > 30) {
        clearInterval(captureInterval);
        setChecking(false);
      }
    }, 1000);
  };

  // Não renderiza nada até estar no cliente
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  // Se já tem token, mostra o jogo diretamente
  const existingToken = getTokenFromCookie();
  if (existingToken && existingToken.length > 10) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎰</div>
          <h2 className="text-2xl font-bold text-green-500">Evolution Capturer</h2>
          <p className="text-gray-400 text-sm mt-2">
            Faça login com sua conta Sorte na Bet
          </p>
        </div>
        
        {!showIframe ? (
          <button
            onClick={() => setShowIframe(true)}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors"
          >
            🔐 FAZER LOGIN
          </button>
        ) : (
          <>
            <div className="border border-gray-600 rounded-lg overflow-hidden mb-4" style={{ height: '450px' }}>
              <iframe 
                id="loginIframe"
                src="https://sortenabet.evo-games.com/frontend/evo/r2/?game=bacbo&language=pt&currency=BRL"
                className="w-full h-full"
                onLoad={handleIframeLoad}
                allow="same-origin *;"
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              {checking ? '🔍 Detectando login...' : 'Faça login no iframe acima. O token será capturado automaticamente.'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
