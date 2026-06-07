'use client';

import { useEffect, useRef, useState } from 'react';

export default function VideoPlayer({ evoSessionId, gameId }) {
  const videoRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const mediaSourceRef = useRef(null);
  const bufferRef = useRef(null);
  const queueRef = useRef([]);

  useEffect(() => {
    if (!evoSessionId) return;

    console.log('🎥 Iniciando vídeo com EVOSESSIONID:', evoSessionId);

    // Gera videoSessionId baseado no EVOSESSIONID
    const videoSessionId = `${evoSessionId}-${gameId}-${Date.now()}`;
    
    // URL do WebSocket de vídeo (igual ao diogocartas)
    const wsUrl = `wss://sapa-mdp-e06.egcvi.com/app/30/topcbr1_bi_med/websocketstream2?vc=h264&ac=opus&videoSessionId=${videoSessionId}`;
    
    // Configura MediaSource
    if (window.MediaSource && videoRef.current) {
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
          console.error('Erro no buffer:', e);
        }
      });
    }
    
    // Conecta WebSocket
    const ws = new WebSocket(wsUrl);
    ws.binaryType = 'arraybuffer';
    wsRef.current = ws;
    
    ws.onopen = () => {
      console.log('✅ WebSocket de vídeo conectado');
      setIsConnected(true);
    };
    
    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer && bufferRef.current) {
        if (!bufferRef.current.updating) {
          bufferRef.current.appendBuffer(event.data);
        } else {
          queueRef.current.push(event.data);
        }
      }
    };
    
    ws.onerror = (err) => console.error('WebSocket error:', err);
    
    ws.onclose = () => {
      console.log('WebSocket fechado, reconectando...');
      setIsConnected(false);
      setTimeout(() => {
        if (evoSessionId) {
          // Reconectar
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
    <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
      <video
        ref={videoRef}
        className="w-full h-full"
        autoPlay
        muted
        playsInline
      />
      
      {isConnected && (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-white">AO VIVO</span>
        </div>
      )}
    </div>
  );
}
