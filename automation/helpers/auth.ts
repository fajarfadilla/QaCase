import { request } from '@playwright/test';
import { env } from './env';
import type { Username } from './test-data';

/**
 * Gets a token for a test account from the test-only auth endpoint, skipping the
 * Microsoft login screen (AS-35). The real Microsoft login is covered by manual cases.
 */
export async function getToken(username: Username): Promise<string> {
  const api = await request.newContext({ baseURL: env.apiUrl });
  try {
    const response = await api.post('/test/auth/token', { data: { username } });
    if (!response.ok()) {
      throw new Error(`Could not get a token for ${username}: ${response.status()}`);
    }
    const { accessToken } = await response.json();
    return accessToken;
  } finally {
    await api.dispose();
  }
}
