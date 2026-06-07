import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { jwtToken } = await request.json();
    
    // Decodifica para pegar user/session
    const decoded = JSON.parse(Buffer.from(jwtToken.split('.')[1], 'base64').toString());
    
    // SIMULA a chamada que o diogocartas faz internamente
    // Na vida real, isso viria da Evolution via common.json
    const mockEvoSessionId = `session_${decoded.s}_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      EVOSESSIONID: mockEvoSessionId,
      instance: "1rwl0x",
      client_version: "6.20260604.73027.62464-b461235ce5-r2"
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
