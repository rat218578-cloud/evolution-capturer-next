'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function EvolutionIframe({ onLogin, onEvoSessionId, gameId = 'bacbo' }) {
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const messageHandlerRef = useRef(null);

  // Gera parâmetros dinâmicos (igual ao F5 do diogocartas)
  const generateDynamicParams = useCallback(() => {
    const vt_id = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 8);
    const lobby_launch_id = Math.random().toString(36).substring(2, 15) + 
                            Date.now().toString(36);
    
    return { vt_id, lobby_launch_id };
  }, []);

  // Constrói a URL do iframe com os parâmetros
  const buildIframeUrl = useCallback(() => {
    const { vt_id, lobby_launch_id } = generateDynamicParams();
    
    // Mapeia os jogos (igual ao diogocartas)
    const gameTableIds = {
      bacbo: 'SortenaBacBo0001',
      football: 'SortenabetFS0001',
      baccarat: 'Baccarat0000001',
      roulette: 'PorROULigh000001'
    };
    
    const table_id = gameTableIds[gameId] || 'SortenaBacBo0001';
    
    // URL exata que o diogocartas usa
    return `https://sortenabet.evo-games.com/frontend/evo/r2/#category=all_games&game=${gameId}&table_id=${table_id}&vt_id=${vt_id}&lobby_launch_id=${lobby_launch_id}`;
  }, [gameId, generateDynamicParams]);

  // Escuta mensagens do iframe (postMessage)
  useEffect(() => {
    const handleMessage = (event) => {
      // Verifica se a mensagem vem do domínio correto
      if (event.origin !== 'https://sortenabet.evo-games.com') return;
      
      console.log('📨 Mensagem recebida do iframe:', event.data);
      
      // Procura por EVOSESSIONID em diferentes formatos
      const evoSessionId = event.data?.EVOSESSIONID || 
                          event.data?.evoSessionId || 
                          event.data?.sessionId ||
                          event.data?.EVO_SESSION_ID;
      
      if (evoSessionId) {
        console.log('✅ EVOSESSIONID capturado via postMessage!', evoSessionId);
        onEvoSessionId?.(evoSessionId);
      }
      
      // Procura por token JWT
      const token = event.data?.token || event.data?.jwt;
      if (token && token.length > 50) {
        console.log('✅ Token JWT capturado via postMessage!');
        localStorage.setItem('diogo_token', token);
        onLogin?.(token);
      }
      
      // Verifica se o usuário está logado
      if (event.data?.type === 'USER_LOGGED_IN' || event.data?.loggedIn) {
        console.log('✅ Usuário logado detectado!');
        // Tenta pegar o token do localStorage do iframe? (não possível via CORS)
        // Mas podemos tentar ler via postMessage pedindo
        iframeRef.current?.contentWindow?.postMessage({ type: 'GET_TOKEN' }, 'https://sortenabet.evo-games.com');
      }
    };
    
    window.addEventListener('message', handleMessage);
    messageHandlerRef.current = handleMessage;
    
    return () => window.removeEventListener('message', handleMessage);
  }, [onLogin, onEvoSessionId]);

  const iframeRef = useRef(null);
  const currentUrl = buildIframeUrl();

  // Função para recarregar o iframe (F5)
  const refreshIframe = useCallback(() => {
    setIsLoading(true);
    setIframeKey(Date.now()); // Muda a key, React recria o iframe
    console.log('🔄 Iframe recriado com novos parâmetros');
  }, []);

  // Expõe a função de refresh para o componente pai
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__refreshEvolutionIframe = refreshIframe;
    }
  }, [refreshIframe]);

  return (
    <div className="relative w-full h-full">
      <iframe
        ref={iframeRef}
        key={iframeKey}
        src={currentUrl}
        className="w-full h-full border-0"
        allow="same-origin *; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation"
        onLoad={() => {
          setIsLoading(false);
          console.log('✅ Iframe Evolution carregado');
          
          // Tenta enviar uma mensagem para o iframe pedindo o token
          setTimeout(() => {
            iframeRef.current?.contentWindow?.postMessage({ type: 'GET_SESSION_INFO' }, 'https://sortenabet.evo-games.com');
          }, 2000);
        }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto mb-3"></div>
            <p className="text-white text-sm">Carregando jogo...</p>
          </div>
        </div>
      )}
    </div>
  );
}
