import { NextResponse } from 'next/server';
import axios from 'axios';

const REQUIRED_KEYS = ['EVOSESSIONID', 'instance', 'client_version'];

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Informe email e senha.' }, { status: 400 });
    }

    if (!process.env.AUTH_API_URL) {
      return NextResponse.json(
        {
          success: false,
          error: 'Configure AUTH_API_URL para usar um provedor de autenticação autorizado.'
        },
        { status: 501 }
      );
    }

    const loginResponse = await axios.post(
      process.env.AUTH_API_URL,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Evolution-Capturer/1.0'
        },
        timeout: 15000,
        maxRedirects: 5
      }
    );

    const authData = loginResponse.data || {};
    const missingKey = REQUIRED_KEYS.find((key) => !authData[key]);

    if (missingKey) {
      return NextResponse.json(
        { success: false, error: `Resposta de autenticação sem ${missingKey}.` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      EVOSESSIONID: authData.EVOSESSIONID,
      instance: authData.instance,
      client_version: authData.client_version,
      balance: authData.balance || 1000,
      video_ws_url: authData.video_ws_url || process.env.VIDEO_WS_URL || '',
      game_ws_base_url: authData.game_ws_base_url || process.env.GAME_WS_BASE_URL || ''
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
