import { NextResponse } from 'next/server';
import { GAMES } from '@/lib/evolution-api';

export async function GET(_request, { params }) {
  const game = GAMES[params.gameId];

  if (!game) {
    return NextResponse.json({ success: false, error: 'Jogo não encontrado.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, game });
}
