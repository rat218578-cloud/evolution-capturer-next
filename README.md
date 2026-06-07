# Evolution Capturer Next

Projeto Next.js com estrutura de painel para selecionar jogos, visualizar vídeo, estatísticas e histórico de rodadas.

## Estrutura

```text
evolution-capturer-next/
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── api/
│   │   ├── auth/
│   │   │   └── login/route.js
│   │   ├── games/
│   │   │   └── [gameId]/route.js
│   │   └── websocket/
│   │       └── route.js
│   └── game/
│       └── [id]/
│           └── page.js
├── components/
│   ├── GameSelector.js
│   ├── VideoPlayer.js
│   ├── StatsPanel.js
│   ├── HistoryTable.js
│   └── LoginForm.js
├── lib/
│   ├── evolution-api.js
│   ├── websocket-handler.js
│   └── token-manager.js
├── public/
├── package.json
├── next.config.js
├── railway.json
├── Procfile
└── README.md
```

## Desenvolvimento

```bash
npm install
npm run dev
```

## Observação de segurança

A rota de login foi implementada como sessão local de demonstração. Ela não encaminha credenciais para sites de terceiros e deve ser adaptada apenas para integrações próprias, autorizadas e em conformidade com os termos dos serviços utilizados.


## Deploy no Railway

Use as seguintes configurações no dashboard do Railway:

| Campo | Valor |
| --- | --- |
| Start Command | `npm run start` |
| Build Command | `npm install && npm run build` |
| Root Directory | deixe vazio |

O arquivo `railway.json` também declara o builder Nixpacks, o comando de build e o comando de start para o deploy.
