'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import GameSelector from '@/components/GameSelector';
import StatsPanel from '@/components/StatsPanel';
import HistoryTable from '@/components/HistoryTable';
import LoginForm from '@/components/LoginForm';

const GAMES = {
  bacbo: { id: 'bacbo', name: 'Bac Bo', icon: '🎲', evolutionId: 'BacBo00000000001', description: 'Jogo de dados asiático' },
  football: { id: 'football', name: 'Football Studio', icon: '⚽', evolutionId: 'SortenabetFS0001', description: 'Estúdio de futebol' },
  baccarat: { id: 'baccarat', name: 'Baccarat', icon: '🃏', evolutionId: 'Baccarat0000001', description: 'Clássico cartas' },
  roulette: { id: 'roulette', name: 'Roleta', icon: '🎡', evolutionId: 'PorROULigh000001', description: 'Roleta europeia' }
};

export default function Home() {
  const [selectedGame, setSelectedGame] = useState('bacbo');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [sessionConfig, setSessionConfig] = useState(null);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ banker: 0, player: 0, tie: 0 });

  const videoRef = useRef(null);
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);
  const videoQueueRef = useRef([]);
  const gameWsRef = useRef(null);
  const videoWsRef = useRef(null);
  const reconnectTimersRef = useRef([]);

  const clearReconnectTimers = useCallback(() => {
    reconnectTimersRef.current.forEach((timerId) => clearTimeout(timerId));
    reconnectTimersRef.current = [];
  }, []);

  const setupVideoPlayer = useCallback(() => {
    if (!videoRef.current || !window.MediaSource) return;

    const mediaSource = new MediaSource();
    videoRef.current.src = URL.createObjectURL(mediaSource);
    mediaSourceRef.current = mediaSource;

    mediaSource.addEventListener('sourceopen', () => {
      try {
        const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.64001f, mp4a.40.2"');
        sourceBuffer.mode = 'sequence';
        sourceBuffer.addEventListener('updateend', () => {
          if (videoQueueRef.current.length > 0 && !sourceBuffer.updating) {
            const data = videoQueueRef.current.shift();
            sourceBuffer.appendBuffer(data);
          }
        });
        sourceBufferRef.current = sourceBuffer;
        console.log('✅ MediaSource pronto para receber vídeo');
      } catch (error) {
        console.error('Erro ao criar source buffer:', error);
      }
    });
  }, []);

  const connectVideoStream = useCallback((videoWsUrl) => {
    if (!videoWsUrl) return;

    console.log('🎥 Conectando ao stream de vídeo autorizado:', videoWsUrl.substring(0, 100));

    if (videoWsRef.current) videoWsRef.current.close();

    const ws = new WebSocket(videoWsUrl);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => console.log('✅ Stream de vídeo conectado!');

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer && sourceBufferRef.current) {
        if (!sourceBufferRef.current.updating) {
          try {
            sourceBufferRef.current.appendBuffer(event.data);
          } catch (error) {
            console.error('Erro ao anexar vídeo ao buffer:', error);
            videoQueueRef.current.push(event.data);
          }
        } else {
          videoQueueRef.current.push(event.data);
        }
      }
    };

    ws.onerror = (error) => console.error('❌ Erro no vídeo:', error);

    ws.onclose = () => {
      console.log('🔴 Stream de vídeo desconectado. Reconectando em 5s...');
      const timerId = setTimeout(() => connectVideoStream(videoWsUrl), 5000);
      reconnectTimersRef.current.push(timerId);
    };

    videoWsRef.current = ws;
  }, []);

  const connectGameWebSocket = useCallback((gameWsBaseUrl, evoSessionId, instance, clientVersion, gameId) => {
    if (!gameWsBaseUrl || !evoSessionId) return;

    const wsUrl = `${gameWsBaseUrl.replace(/\/$/, '')}/${gameId}/socket?messageFormat=json&EVOSESSIONID=${encodeURIComponent(evoSessionId)}&instance=${encodeURIComponent(instance)}&client_version=${encodeURIComponent(clientVersion)}`;

    console.log('🔌 Conectando ao WebSocket do jogo autorizado:', wsUrl.substring(0, 100));

    if (gameWsRef.current) gameWsRef.current.close();

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log('✅ WebSocket do jogo conectado!');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'bacbo.playerState' && data.args?.game) {
          const gameData = data.args.game;
          if (gameData.stage === 'Confirmation' && gameData.dice) {
            const diceValues = gameData.dice.map((die) => die.value);
            const playerScore = diceValues[0] + diceValues[1];
            const bankerScore = diceValues[2] + diceValues[3];

            let winner = 'Tie';
            if (playerScore > bankerScore) winner = 'Player';
            else if (bankerScore > playerScore) winner = 'Banker';

            setStats((prev) => ({
              banker: prev.banker + (winner === 'Banker' ? 1 : 0),
              player: prev.player + (winner === 'Player' ? 1 : 0),
              tie: prev.tie + (winner === 'Tie' ? 1 : 0)
            }));

            setHistory((prev) => [{
              id: gameData.id,
              winner,
              playerScore,
              bankerScore,
              time: new Date().toLocaleTimeString()
            }, ...prev].slice(0, 100));
          }
        }
      } catch (error) {
        console.error('Erro processando mensagem:', error);
      }
    };

    ws.onclose = () => {
      console.log('🔴 WebSocket do jogo desconectado. Reconectando...');
      const timerId = setTimeout(() => connectGameWebSocket(gameWsBaseUrl, evoSessionId, instance, clientVersion, gameId), 5000);
      reconnectTimersRef.current.push(timerId);
    };

    gameWsRef.current = ws;
  }, []);

  const handleLogin = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok || !data.success || !data.EVOSESSIONID) {
      throw new Error(data.error || 'Falha no login');
    }

    setToken(data.EVOSESSIONID);
    setSessionConfig(data);
    setIsLoggedIn(true);
    setBalance(data.balance || 1000);

    setupVideoPlayer();

    setTimeout(() => {
      connectVideoStream(data.video_ws_url);
      connectGameWebSocket(data.game_ws_base_url, data.EVOSESSIONID, data.instance, data.client_version, GAMES[selectedGame].evolutionId);
    }, 1000);
  };

  const switchGame = (gameId) => {
    setSelectedGame(gameId);
    if (token && sessionConfig) {
      connectGameWebSocket(sessionConfig.game_ws_base_url, token, sessionConfig.instance, sessionConfig.client_version, GAMES[gameId].evolutionId);
    }
  };

  useEffect(() => {
    return () => {
      clearReconnectTimers();
      if (gameWsRef.current) gameWsRef.current.close();
      if (videoWsRef.current) videoWsRef.current.close();
    };
  }, [clearReconnectTimers]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <>
          <GameSelector games={GAMES} selected={selectedGame} onSelect={switchGame} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
                <video ref={videoRef} className="w-full h-auto" autoPlay muted playsInline />
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
