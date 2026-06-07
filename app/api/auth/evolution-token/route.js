// app/api/auth/evolution-token/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { jwtToken } = await request.json();
    
    // Aqui você precisa chamar a API da Sorte na Bet
    // para converter o JWT em EVOSESSIONID
    const response = await fetch('https://sortenabet.bet.br/api/evolution/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });
    
    const data = await response.json();
    
    return NextResponse.json({
      EVOSESSIONID: data.evoSessionId,
      instance: "1rwl0x",
      client_version: "6.20260604.73027.62464-b461235ce5-r2"
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
