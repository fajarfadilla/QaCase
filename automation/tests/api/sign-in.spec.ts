import { test, expect } from '@playwright/test';
import { tenants, users } from '../../helpers/test-data';

test.describe('Flow 0 - Sign In', () => {
  test(
    'SI-A-001 /user/who resolves the Tenant for a registered username',
    { tag: '@P1' },
    async ({ request }) => {
      await test.step('1. POST /user/who with a registered username', async () => {
        const response = await request.post('/user/who', { data: { username: users.rina } });

        expect(response.status()).toBe(200);
        expect(await response.json()).toMatchObject({
          tenantId: tenants.a.id,
          tenantName: tenants.a.name,
        });
      });
    },
  );

  test('SI-A-002 /user/who rejects an unknown username', { tag: '@P1' }, async ({ request }) => {
    await test.step('1. POST /user/who with an unknown username', async () => {
      const response = await request.post('/user/who', { data: { username: 'ghost.user' } });

      expect(response.status()).toBe(404);
      const body = await response.json();
      expect(body).toHaveProperty('message');
      expect(body).not.toHaveProperty('tenantId');
    });
  });
});
