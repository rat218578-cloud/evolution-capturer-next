# 🎰 Evolution Capturer - Live Video & Stats

## Funcionalidades

- ✅ **Login via iframe da Sorte na Bet** (igual ao diogocartas.app)
- ✅ **Captura automática do token JWT**
- ✅ **Vídeo AO VIVO REAL** via WebSocket da Evolution
- ✅ **WebSocket do jogo** para resultados em tempo real
- ✅ **Múltiplos jogos**: Bac Bo, Football Studio, Baccarat, Roleta
- ✅ **Estatísticas ao vivo** (Banker, Player, Tie)
- ✅ **Histórico de rodadas**

## Como rodar

```bash
npm install
npm run dev
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
- JSON Web Token

## Estrutura do Projeto

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
