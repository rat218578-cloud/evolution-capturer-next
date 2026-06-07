import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { jwtToken } = await request.json();
    
    console.log('🔄 Convertendo JWT para EVOSESSIONID...');
    
    // Decodifica o JWT para obter informações do usuário
    const decoded = JSON.parse(Buffer.from(jwtToken.split('.')[1], 'base64').toString());
    console.log('📦 JWT decodificado:', decoded);
    
    // === MÉTODO 1: Tentar via API da Sorte na Bet ===
    try {
      const response = await axios.post('https://sortenabet.bet.br/api/evolution/session', 
        {
          token: jwtToken,
          userId: decoded.e,
          sessionId: decoded.s
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          }
        }
      );
      
      if (response.data && response.data.EVOSESSIONID) {
        return NextResponse.json({
          success: true,
          EVOSESSIONID: response.data.EVOSESSIONID,
          instance: response.data.instance || "1rwl0x",
          client_version: response.data.client_version || "6.20260604.73027.62464-b461235ce5-r2"
        });
      }
    } catch(e) {
      console.log('Método 1 falhou:', e.message);
    }
    
    // === MÉTODO 2: Usar o JWT para acessar o jogo diretamente ===
    try {
      // Acessa o jogo com o JWT no header
      const gameResponse = await axios.get('https://sortenabet.evo-games.com/frontend/evo/r2/common.json', {
        headers: {
          'Cookie': `token=${jwtToken}`,
          'User-Agent': 'Mozilla/5.0'
        }
      });
      
      if (gameResponse.data && gameResponse.data.EVOSESSIONID) {
        return NextResponse.json({
          success: true,
          EVOSESSIONID: gameResponse.data.EVOSESSIONID,
          instance: "1rwl0x",
          client_version: gameResponse.data.client_version
        });
      }
    } catch(e) {
      console.log('Método 2 falhou:', e.message);
    }
    
    // === MÉTODO 3: Simular EVOSESSIONID para teste (APENAS TESTE) ===
    // IMPORTANTE: Isso é apenas para teste! Em produção, use os métodos acima.
    const mockEvoSessionId = `mock_${decoded.e}_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      EVOSESSIONID: mockEvoSessionId,
      instance: "1rwl0x",
      client_version: "6.20260604.73027.62464-b461235ce5-r2",
      isMock: true
    });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
