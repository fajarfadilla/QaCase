import { test, expect } from '../../helpers/fixtures';
import { createHazard, validFollowup } from '../../helpers/hazards';
import { users } from '../../helpers/test-data';

test.describe('Flow 2 - Followup Task', () => {
  test('HZ-A-008 Only the PIC can submit the Followup Task', { tag: '@P1' }, async ({ apiAs }) => {
    const rina = await apiAs(users.rina);
    const maya = await apiAs(users.maya);
    const hazard = await createHazard(rina, { picId: users.paul });

    await test.step("1. POST the Followup Task with Maya's token", async () => {
      const response = await maya.post(`/safety/hazards/${hazard.id}/followup`, {
        data: validFollowup(),
      });

      expect(response.status()).toBe(403);
    });

    await test.step("2. POST the Followup Task with Rina's token", async () => {
      const response = await rina.post(`/safety/hazards/${hazard.id}/followup`, {
        data: validFollowup(),
      });

      expect(response.status()).toBe(403);
    });

    await test.step('3. GET the Hazard', async () => {
      const response = await rina.get(`/safety/hazards/${hazard.id}`);

      expect(response.status()).toBe(200);
      expect((await response.json()).status).toBe('OPEN');
    });
  });
});
