# 🎰 Evolution Capturer - Live Video & Stats

## Funcionalidades

- ✅ **Player para vídeo ao vivo** via WebSocket autorizado
- ✅ **WebSocket do jogo** para resultados em tempo real
- ✅ **Login via provedor autorizado** configurado por variável de ambiente
- ✅ **Múltiplos jogos**: Bac Bo, Football Studio, Baccarat, Roleta
- ✅ **Estatísticas ao vivo** (Banker, Player, Tie)
- ✅ **Histórico de rodadas**

## Como rodar

```bash
npm install
npm run dev
```

## Variáveis de ambiente

Configure um provedor de autenticação próprio/autorizado antes de usar o login:

```bash
AUTH_API_URL=https://seu-provedor-autorizado.example.com/login
VIDEO_WS_URL=wss://seu-stream-autorizado.example.com/video
GAME_WS_BASE_URL=wss://seu-game-ws-autorizado.example.com/public/bacbo/player/game
```

A resposta de `AUTH_API_URL` deve retornar JSON com:

```json
{
  "EVOSESSIONID": "token-da-sessao",
  "instance": "instancia",
  "client_version": "versao-do-cliente",
  "balance": 1000,
  "video_ws_url": "wss://...",
  "game_ws_base_url": "wss://.../game"
}
```

## Deploy no Railway

```bash
railway up
```

No dashboard do Railway, use:

| Campo | Valor |
| --- | --- |
| Start Command | `npm run start` |
| Build Command | `npm install && npm run build` |
| Root Directory | deixe vazio |

## Tecnologias

- Next.js 14
- Tailwind CSS
- WebSocket / MediaSource
- Axios

## Estrutura Completa do Projeto

```text
evolution-capturer-next/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── login/
│   │   │       └── route.js
│   │   ├── games/
│   │   │   └── [gameId]/
│   │   │       └── route.js
│   │   └── websocket/
│   │       └── route.js
│   ├── game/
│   │   └── [id]/
│   │       └── page.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── GameSelector.js
│   ├── HistoryTable.js
│   ├── LoginForm.js
│   ├── StatsPanel.js
│   └── VideoPlayer.js
├── lib/
│   ├── evolution-api.js
│   ├── token-manager.js
│   └── websocket-handler.js
├── public/
│   └── favicon.ico
├── .eslintrc.json
├── Procfile
├── README.md
├── jsconfig.json
├── next.config.js
├── package.json
├── postcss.config.js
├── railway.json
└── tailwind.config.js
```
