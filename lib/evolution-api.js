import axios from 'axios';

export const GAMES = {
  bacbo: { id: 'bacbo', name: 'Bac Bo', icon: '🎲', evolutionId: 'BacBo00000000001', description: 'Jogo de dados asiático' },
  football: { id: 'football', name: 'Football Studio', icon: '⚽', evolutionId: 'SortenabetFS0001', description: 'Estúdio de futebol' },
  baccarat: { id: 'baccarat', name: 'Baccarat', icon: '🃏', evolutionId: 'Baccarat0000001', description: 'Clássico cartas' },
  roulette: { id: 'roulette', name: 'Roleta', icon: '🎡', evolutionId: 'PorROULigh000001', description: 'Roleta europeia' }
};


export async function getEvolutionToken(jwtToken) {
  try {
    const decoded = JSON.parse(Buffer.from(jwtToken.split('.')[1], 'base64').toString());
    
    const response = await axios.post('https://sortenabet.evo-games.com/api/authenticate', {
      userId: decoded.e,
      sessionId: decoded.s,
      token: jwtToken
    });
    
    return {
      EVOSESSIONID: response.data.EVOSESSIONID,
      instance: "1rwl0x",
      client_version: "6.20260604.73027.62464-b461235ce5-r2"
    };
  } catch (error) {
    console.error('Erro ao obter token Evolution:', error);
    throw error;
  }
}
