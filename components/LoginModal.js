'use client';

import { useEffect, useState } from 'react';

export default function LoginModal({ onLogin }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    // Monitora o cookie em busca do token JWT
    const interval = setInterval(() => {
      // Procura pelo token JWT (igual ao diogocartas)
      const tokenMatch = document.cookie.match(/token=([^;]+)/);
      const evoMatch = document.cookie.match(/EVOSESSIONID=([^;]+)/);
      
      if (tokenMatch && tokenMatch[1]) {
        console.log('✅ Token JWT capturado!');
        if (evoMatch && evoMatch[1]) {
          console.log('✅ EVOSESSIONID capturado!');
          onLogin(tokenMatch[1], evoMatch[1]);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onLogin]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Cabeçalho */}
        <div className="p-5 text-center border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Faça login para jogar</h2>
          <p className="text-gray-400 text-sm mt-1">
            Entre com as suas credenciais da <span className="text-yellow-500">Sorte na Bet</span>
          </p>
        </div>

        {/* Iframe - FORÇANDO A PÁGINA DE LOGIN */}
        <div className="h-[450px]">
          <iframe
            src="https://sortenabet.bet.br/login"  // ← URL CORRETA DE LOGIN
            className="w-full h-full border-0"
            onLoad={() => {
              setIframeLoaded(true);
              console.log('✅ Iframe de login carregado');
            }}
            allow="same-origin *;"
          />
        </div>

        {/* Rodapé */}
        <div className="p-4 text-center border-t border-gray-700">
          {!iframeLoaded ? (
            <p className="text-yellow-500 text-sm">🔄 Carregando página de login...</p>
          ) : (
            <p className="text-green-500 text-sm">✅ Faça login no formulário acima</p>
          )}
          <p className="text-gray-500 text-xs mt-2">
            Ainda não tem conta?{' '}
            <a 
              href="https://sortenabet.bet.br/cadastro" 
              target="_blank" 
              className="text-purple-400 hover:underline"
            >
              Cadastre-se na Sorte na Bet
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
