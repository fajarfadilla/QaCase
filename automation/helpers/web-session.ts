import type { Page } from '@playwright/test';
import { getToken } from './auth';
import type { Username } from './test-data';

/**
 * Signs WeMineOffice in as a test account without the Microsoft login screen (AS-35),
 * by storing a test token before the app loads. Assumes WeMineOffice keeps its session
 * in localStorage under `wemine.session`.
 */
export async function signInToOffice(page: Page, username: Username): Promise<void> {
  const token = await getToken(username);
  await page.addInitScript((value) => window.localStorage.setItem('wemine.session', value), token);
}
