import { defineConfig, devices } from '@playwright/test';
import { env } from './helpers/env';

/**
 * Example specs only (AS-43): there is no WeMine environment to run them against.
 * Point WEMINE_API_URL / WEMINEOFFICE_URL at a real test environment to run them.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  projects: [
    /* API specs: no browser, requests go to the WeMine backend. */
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: env.apiUrl },
    },
    /* Web specs: WeMineOffice in Chromium. */
    {
      name: 'web',
      testDir: './tests/web',
      use: { ...devices['Desktop Chrome'], baseURL: env.webUrl },
    },
  ],
});
