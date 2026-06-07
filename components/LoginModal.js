'use client';

import { useState, useEffect } from 'react';

export default function LoginModal({ onLogin }) {
  const [isOpen, setIsOpen] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Função que captura o token automaticamente (igual ao diogocartas)
  useEffect(() => {
    if (!isOpen) return;

    setDetecting(true);
    
    // Tenta ler o token do cookie a cada segundo
    const interval = setInterval(() => {
      // Lê o token JWT da Sorte na Bet
      const tokenMatch = document.cookie.match(/token=([^;]+)/);
      // Lê o EVOSESSIONID da Evolution
      const evoMatch = document.cookie.match(/EVOSESSIONID=([^;]+)/);
      
      if (tokenMatch && tokenMatch[1]) {
        console.log('✅ Token JWT capturado:', tokenMatch[1].substring(0, 50) + '...');
        
        if (evoMatch && evoMatch[1]) {
          console.log('✅ EVOSESSIONID capturado:', evoMatch[1]);
          onLogin(tokenMatch[1], evoMatch[1]);
          setIsOpen(false);
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onLogin]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-700">
        
        {/* Cabeçalho */}
        <div className="p-6 text-center border-b border-gray-700">
          <div className="flex justify-center mb-3">
            <div className="bg-purple-600 rounded-full p-3">
              <span className="text-3xl">🎰</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">Faça login para jogar</h2>
          <p className="text-gray-400 text-sm mt-1">
            Entre com as suas credenciais da <span className="text-yellow-500">Sorte na Bet</span>
          </p>
        </div>

        {/* Iframe do login - IGUAL AO DIOGOCARTAS */}
        <div className="h-[400px]">
          <iframe
            src="https://sortenabet.bet.br/"
            className="w-full h-full border-0"
            onLoad={() => {
              setIframeLoaded(true);
              console.log('📱 Iframe da Sorte na Bet carregado');
            }}
            allow="same-origin *;"
          />
        </div>

        {/* Rodapé com status */}
        <div className="p-4 text-center border-t border-gray-700">
          {detecting && !iframeLoaded && (
            <p className="text-yellow-500 text-sm animate-pulse">
              🔄 Carregando página de login...
            </p>
          )}
          {detecting && iframeLoaded && (
            <p className="text-green-500 text-sm">
              ✅ Faça login no formulário acima
            </p>
          )}
          <p className="text-gray-500 text-xs mt-2">
            Ainda não tem conta? <a href="https://sortenabet.bet.br/" target="_blank" className="text-purple-400 hover:underline">Cadastre-se na Sorte na Bet</a>
          </p>
        </div>
      </div>
    </div>
  );
}
