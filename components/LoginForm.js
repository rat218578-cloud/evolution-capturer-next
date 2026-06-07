'use client';

import { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onLogin(email, password);
    } catch (err) {
      console.error('Login form error:', err);
      setError('Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎰</div>
          <h2 className="text-2xl font-bold text-green-500">Evolution Capturer</h2>
          <p className="text-gray-400 text-sm mt-2">
            Configure um endpoint de autenticação autorizado para habilitar o acesso.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">📧 E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">🔒 Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
              placeholder="Digite sua senha"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {loading ? '🔄 Entrando...' : '🔐 ENTRAR'}
          </button>
        </form>
      </div>
    </div>
  );
}
