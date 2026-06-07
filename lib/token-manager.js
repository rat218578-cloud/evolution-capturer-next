import crypto from 'crypto';

const SESSION_TTL_MS = 1000 * 60 * 60;

export function createDemoSession(email) {
  return {
    success: true,
    EVOSESSIONID: `demo_${crypto.randomUUID()}`,
    instance: 'demo-instance',
    client_version: 'demo-client-version',
    balance: 1000,
    user: {
      email,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    },
  };
}

export function isValidEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
