'use client';

import { useEffect, useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    // Função que lê o EVOSESSIONID do cookie
    const checkEvoSession = () => {
      try {
        // O cookie é definido pelo iframe da Evolution
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
          cookie = cookie.trim();
          if (cookie.startsWith('EVOSESSIONID=')) {
            const evoSessionId = cookie.substring('EVOSESSIONID='.length);
            console.log('✅ EVOSESSIONID capturado:', evoSessionId);
            onLogin(evoSessionId);
            return true;
          }
        }
      } catch(e) {}
      return false;
    };

    // Tenta ler a cada segundo
    const interval = setInterval(() => {
      if (checkEvoSession()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onLogin]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="font-bold text-white">🔐 Faça login</h3>
        </div>
        <div className="h-[500px]">
          <iframe
            src="https://sortenabet.bet.br/"
            className="w-full h-full border-0"
            onLoad={() => setIframeLoaded(true)}
            allow="same-origin *;"
          />
        </div>
        <div className="p-3 text-center text-gray-400 text-sm border-t border-gray-700">
          {!iframeLoaded ? 'Carregando...' : '✅ Login detectado automaticamente'}
        </div>
      </div>
    </div>
  );
}
