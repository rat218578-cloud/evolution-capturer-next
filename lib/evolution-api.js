export const GAMES = {
  bacbo: {
    id: 'bacbo',
    name: 'Bac Bo',
    icon: '🎲',
    evolutionId: 'BacBo00000000001',
    description: 'Jogo de dados asiático',
  },
  football: {
    id: 'football',
    name: 'Football Studio',
    icon: '⚽',
    evolutionId: 'SortenabetFS0001',
    description: 'Estúdio de futebol',
  },
  baccarat: {
    id: 'baccarat',
    name: 'Baccarat',
    icon: '🃏',
    evolutionId: 'Baccarat0000001',
    description: 'Clássico cartas',
  },
  roulette: {
    id: 'roulette',
    name: 'Roleta',
    icon: '🎡',
    evolutionId: 'PorROULigh000001',
    description: 'Roleta europeia',
  },
};

export function createDemoRound() {
  const dice = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  const playerScore = dice[0] + dice[1];
  const bankerScore = dice[2] + dice[3];
  let winner = 'Tie';

  if (playerScore > bankerScore) winner = 'Player';
  if (bankerScore > playerScore) winner = 'Banker';

  return {
    id: crypto.randomUUID(),
    dice,
    playerScore,
    bankerScore,
    winner,
    time: new Date().toLocaleTimeString('pt-BR'),
  };
}

export function summarizeStats(history) {
  return history.reduce(
    (acc, item) => ({
      banker: acc.banker + (item.winner === 'Banker' ? 1 : 0),
      player: acc.player + (item.winner === 'Player' ? 1 : 0),
      tie: acc.tie + (item.winner === 'Tie' ? 1 : 0),
    }),
    { banker: 0, player: 0, tie: 0 },
  );
}
