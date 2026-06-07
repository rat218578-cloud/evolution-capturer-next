'use client';

import { useState, useEffect } from 'react';

export default function LoginForm({ onLogin }) {
  const [showModal, setShowModal] = useState(true);
  const [checking, setChecking] = useState(false);

  // Função para ler o token JWT do cookie (igual ao diogocartas)
  const getTokenFromCookie = () => {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith('token=')) {
        return cookie.substring('token='.length);
      }
    }
    return null;
  };

  // Função para salvar token no cookie
  const saveTokenToCookie = (token) => {
    document.cookie = `token=${token}; path=/; max-age=2592000`; // 30 dias
  };

  useEffect(() => {
    // Verifica se já tem token
    const existingToken = getTokenFromCookie();
    if (existingToken && existingToken.length > 50) {
      console.log('✅ Token JWT encontrado!');
      onLogin(existingToken);
      setShowModal(false);
      return;
    }

    // Monitora se o token apareceu
    setChecking(true);
    const interval = setInterval(() => {
      const token = getTokenFromCookie();
      if (token && token.length > 50) {
        console.log('✅ Token JWT capturado!');
        onLogin(token);
        setShowModal(false);
        setChecking(false);
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="font-bold text-white">🔐 Login Sorte na Bet</h3>
          <button 
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>
        <div className="h-[500px]">
          <iframe
            src="https://sortenabet.bet.br/"
            className="w-full h-full border-0"
            allow="same-origin *;"
          />
        </div>
        <div className="p-3 text-center border-t border-gray-700">
          {checking ? (
            <p className="text-yellow-500 text-sm">🔍 Detectando login... Aguarde</p>
          ) : (
            <p className="text-gray-400 text-sm">Faça login com sua conta Sorte na Bet</p>
          )}
        </div>
      </div>
    </div>
  );
}
