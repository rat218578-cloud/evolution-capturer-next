import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { jwtToken } = await request.json();
    
    // Decodifica o JWT para obter user ID
    const decoded = JSON.parse(Buffer.from(jwtToken.split('.')[1], 'base64').toString());
    const userId = decoded.e;
    const sessionId = decoded.s;
    
    console.log('✅ JWT decodificado:', { userId, sessionId });
    
    // Usa o JWT para obter EVOSESSIONID da Evolution
    const evolutionResponse = await axios.post('https://sortenabet.evo-games.com/api/auth', {
      token: jwtToken,
      userId: userId,
      sessionId: sessionId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });
    
    if (evolutionResponse.data && evolutionResponse.data.EVOSESSIONID) {
      return NextResponse.json({
        success: true,
        EVOSESSIONID: evolutionResponse.data.EVOSESSIONID,
        instance: "1rwl0x",
        client_version: "6.20260604.73027.62464-b461235ce5-r2",
        balance: 1000
      });
    }
    
    return NextResponse.json({ success: false, error: 'Falha na autenticação' }, { status: 401 });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
