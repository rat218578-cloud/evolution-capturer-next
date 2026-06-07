import { NextResponse } from 'next/server';
import { createDemoSession, isValidEmail } from '@/lib/token-manager';

export async function POST(request) {
  const { email, password } = await request.json();

  if (!isValidEmail(email) || typeof password !== 'string' || password.length < 1) {
    return NextResponse.json(
      { success: false, error: 'Informe e-mail e senha válidos.' },
      { status: 400 },
    );
  }

  return NextResponse.json(createDemoSession(email));
}
