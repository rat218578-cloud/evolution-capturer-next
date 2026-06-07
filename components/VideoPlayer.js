'use client';

import { useEffect, useRef, useState } from 'react';

export default function VideoPlayer({ evoSessionId, gameId }) {
  const videoRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const mediaSourceRef = useRef(null);
  const bufferRef = useRef(null);
  const queueRef = useRef([]);

  useEffect(() => {
    if (!evoSessionId || !videoRef.current) return;

    console.log('🎥 Iniciando vídeo para sessão:', evoSessionId);

    // Configura MediaSource (igual ao diogocartas)
    if (window.MediaSource) {
      const mediaSource = new MediaSource();
      videoRef.current.src = URL.createObjectURL(mediaSource);
      mediaSourceRef.current = mediaSource;

      mediaSource.addEventListener('sourceopen', () => {
        try {
          const buffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.64001f, mp4a.40.2"');
          buffer.mode = 'sequence';
          
          buffer.addEventListener('updateend', () => {
            if (queueRef.current.length > 0 && !buffer.updating) {
              const data = queueRef.current.shift();
              buffer.appendBuffer(data);
            }
          });
          
          bufferRef.current = buffer;
          console.log('✅ SourceBuffer configurado');
        } catch(e) {
          console.error('Erro ao configurar buffer:', e);
          setError(e.message);
        }
      });
    }

    // Conecta WebSocket de vídeo (igual ao diogocartas)
    const videoSessionId = `${evoSessionId}-${evoSessionId}-${gameId}-${Math.random().toString(36).substring(2, 10)}`;
    const wsUrl = `wss://sapa-mdp-e06.egcvi.com/app/30/topcbr1_bi_med/websocketstream2?vc=h264&ac=opus&videoSessionId=${videoSessionId}`;
    
    console.log('🔌 Conectando WebSocket de vídeo:', wsUrl.substring(0, 100) + '...');
    
    const ws = new WebSocket(wsUrl);
    ws.binaryType = 'arraybuffer';
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket de vídeo conectado');
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer && bufferRef.current) {
        if (!bufferRef.current.updating) {
          try {
            bufferRef.current.appendBuffer(event.data);
          } catch(e) {
            queueRef.current.push(event.data);
          }
        } else {
          queueRef.current.push(event.data);
        }
      }
    };

    ws.onerror = (err) => {
      console.error('❌ Erro no WebSocket:', err);
      setError('Erro na conexão de vídeo');
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket de vídeo fechado, reconectando em 5s...');
      setIsConnected(false);
      setTimeout(() => {
        if (evoSessionId) {
          // Reconecta
        }
      }, 5000);
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (mediaSourceRef.current && mediaSourceRef.current.readyState === 'open') {
        mediaSourceRef.current.endOfStream();
      }
    };
  }, [evoSessionId, gameId]);

  return (
    <div className="relative bg-black rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full"
        autoPlay
        muted
        playsInline
      />
      
      {/* Indicador de conexão */}
      {isConnected && (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-white">AO VIVO</span>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center">
            <p className="text-red-500 mb-2">⚠️ {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 rounded-lg text-sm"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
