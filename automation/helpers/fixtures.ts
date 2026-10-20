import { test as base, request, type APIRequestContext } from '@playwright/test';
import { getToken } from './auth';
import { env } from './env';
import type { Username } from './test-data';

interface Fixtures {
  /** An API client signed in as the given test account (AS-44). */
  apiAs: (username: Username) => Promise<APIRequestContext>;
}

export const test = base.extend<Fixtures>({
  apiAs: async ({}, use) => {
    const contexts: APIRequestContext[] = [];
    await use(async (username) => {
      const token = await getToken(username);
      const context = await request.newContext({
        baseURL: env.apiUrl,
        extraHTTPHeaders: { Authorization: `Bearer ${token}` },
      });
      contexts.push(context);
      return context;
    });
    await Promise.all(contexts.map((context) => context.dispose()));
  },
});

export { expect } from '@playwright/test';
