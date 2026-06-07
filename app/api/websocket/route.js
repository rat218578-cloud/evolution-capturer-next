import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Endpoint reservado para WebSocket. Configure um servidor Node.js/ws separado para streams em tempo real.',
  });
}
