'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [isClient, setIsClient] = useState(false);
  const [selectedGame, setSelectedGame] = useState('bacbo');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ banker: 0, player: 0, tie: 0 });
  
  const [sourceBuffer, setSourceBuffer] = useState(null);
  const [videoQueue, setVideoQueue] = useState([]);
  const [gameWs, setGameWs] = useState(null);
  const [videoWs, setVideoWs] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Configuração do player de vídeo
  const setupVideoPlayer = useCallback(() => {
    if (!videoRef.current) return;
    
    if (window.MediaSource) {
      const mediaSource = new MediaSource();
      videoRef.current.src = URL.createObjectURL(mediaSource);
      
      mediaSource.addEventListener('sourceopen', () => {
        try {
          const buffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.64001f, mp4a.40.2"');
          buffer.mode = 'sequence';
          buffer.addEventListener('updateend', () => {
            if (videoQueue.length > 0 && !buffer.updating) {
              const data = videoQueue.shift();
              buffer.appendBuffer(data);
            }
          });
          setSourceBuffer(buffer);
        } catch(e) {
          console.error('Erro:', e);
        }
      });
    }
  }, [videoQueue]);

  // Conecta ao WebSocket de vídeo REAL
  const connectVideoStream = useCallback((evoSessionId) => {
    const videoSessionId = `${evoSessionId}-${evoSessionId}-SortenabetFS0001-${Math.random().toString(36).substring(2, 10)}`;
    const wsUrl = `wss://sapa-mdp-e06.egcvi.com/app/30/topcbr1_bi_med/websocketstream2?vc=h264&ac=opus&videoSessionId=${videoSessionId}`;
    
    if (videoWs) videoWs.close();
    
    const ws = new WebSocket(wsUrl);
    ws.binaryType = 'arraybuffer';
    
    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer && sourceBuffer) {
        if (!sourceBuffer.updating) {
          try {
            sourceBuffer.appendBuffer(event.data);
          } catch(e) {
            setVideoQueue(prev => [...prev, event.data]);
          }
        } else {
          setVideoQueue(prev => [...prev, event.data]);
        }
      }
    };
    
    ws.onclose = () => setTimeout(() => connectVideoStream(evoSessionId), 5000);
    setVideoWs(ws);
  }, [sourceBuffer, videoWs]);

  // Conecta ao WebSocket do jogo
  const connectGameWebSocket = useCallback((token, instance, clientVersion, gameId) => {
    const wsUrl = `wss://sortenabet.evo-games.com/public/bacbo/player/game/${gameId}/socket?messageFormat=json&EVOSESSIONID=${token}&instance=${instance}&client_version=${clientVersion}`;
    
    if (gameWs) gameWs.close();
    
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'bacbo.playerState' && data.args?.game) {
          const gameData = data.args.game;
          if (gameData.stage === 'Confirmation' && gameData.dice) {
            const diceValues = gameData.dice.map(d => d.value);
            const playerScore = diceValues[0] + diceValues[1];
            const bankerScore = diceValues[2] + diceValues[3];
            
            let winner = 'Tie';
            if (playerScore > bankerScore) winner = 'Player';
            else if (bankerScore > playerScore) winner = 'Banker';
            
            setStats(prev => ({
              banker: prev.banker + (winner === 'Banker' ? 1 : 0),
              player: prev.player + (winner === 'Player' ? 1 : 0),
              tie: prev.tie + (winner === 'Tie' ? 1 : 0)
            }));
            
            setHistory(prev => [{
              id: gameData.id,
              winner,
              playerScore,
              bankerScore,
              time: new Date().toLocaleTimeString()
            }, ...prev].slice(0, 100));
          }
        }
      } catch(e) {}
    };
    
    ws.onclose = () => setTimeout(() => connectGameWebSocket(token, instance, clientVersion, gameId), 5000);
    setGameWs(ws);
  }, [gameWs]);

  // Login usando token JWT (igual ao diogocartas)
  const handleLogin = async (jwtToken) => {
    setToken(jwtToken);
    setIsLoggedIn(true);
    setBalance(1000);
    
    // Decodifica o JWT para obter informações
    const decoded = JSON.parse(atob(jwtToken.split('.')[1]));
    console.log('✅ Usuário logado:', decoded);
    
    setTimeout(() => {
      setupVideoPlayer();
      setTimeout(() => {
        // Usa o JWT para obter EVOSESSIONID
        fetchEvolutionToken(jwtToken);
      }, 500);
    }, 100);
  };

  // Obtém EVOSESSIONID usando o JWT
  const fetchEvolutionToken = async (jwtToken) => {
    try {
      const response = await fetch('/api/auth/evolution-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwtToken })
      });
      
      const data = await response.json();
      if (data.EVOSESSIONID) {
        connectVideoStream(data.EVOSESSIONID);
        connectGameWebSocket(data.EVOSESSIONID, data.instance, data.client_version, GAMES[selectedGame].evolutionId);
      }
    } catch(e) {
      console.error('Erro ao obter EVOSESSIONID:', e);
    }
  };

  const switchGame = (gameId) => {
    setSelectedGame(gameId);
    if (token) {
      if (gameWs) gameWs.close();
      connectGameWebSocket(token, '1rwl0x', '6.20260604.73027.62464-b461235ce5-r2', GAMES[gameId].evolutionId);
    }
  };

  if (!isClient) {
    return <div className="flex items-center justify-center min-h-screen text-gray-400">Carregando...</div>;
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <GameSelector games={GAMES} selected={selectedGame} onSelect={switchGame} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
            <video ref={videoRef} id="liveVideo" className="w-full h-full" autoPlay muted playsinline />
          </div>
        </div>
        
        <div className="space-y-6">
          <StatsPanel stats={stats} balance={balance} />
          <HistoryTable history={history} />
        </div>
      </div>
    </main>
  );
}
