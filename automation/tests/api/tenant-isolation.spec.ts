import { test, expect } from '../../helpers/fixtures';
import { createHazard } from '../../helpers/hazards';
import { tenantBPlaces, users } from '../../helpers/test-data';

test.describe('System-wide - Tenant isolation', () => {
  test("SW-A-001 Another Tenant's Hazard can't be read", { tag: '@P1' }, async ({ apiAs }) => {
    const tara = await apiAs(users.tara);
    const rina = await apiAs(users.rina);
    const hazard = await createHazard(tara, {
      locationId: tenantBPlaces.location,
      sublocationId: tenantBPlaces.sublocation,
      areaId: tenantBPlaces.area,
      picId: users.tara,
    });

    await test.step("1. GET the Tenant B Hazard with Rina's token", async () => {
      const response = await rina.get(`/safety/hazards/${hazard.id}`);

      expect(response.status()).toBe(404);
      const body = await response.text();
      for (const tenantBValue of [users.tara, tenantBPlaces.area, ...hazard.evidenceIds]) {
        expect(body).not.toContain(tenantBValue);
      }
    });
  });
});
