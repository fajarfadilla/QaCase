import { test, expect } from '../../helpers/fixtures';
import { validHazard, type Hazard, type HazardPayload } from '../../helpers/hazards';
import { notificationsFor } from '../../helpers/notifications';
import { places, users, type Username } from '../../helpers/test-data';

test.describe('Flow 2 - Safety Hazard Report', () => {
  test(
    'HZ-A-001 Creating a Hazard creates one Followup Task for the PIC',
    { tag: '@P1' },
    async ({ apiAs }) => {
      const rina = await apiAs(users.rina);
      const paul = await apiAs(users.paul);
      const payload = await validHazard(rina, { areaId: places.crusherZone, picId: users.paul });
      let hazard: Hazard;

      await test.step('1. POST /safety/hazards for Crusher Zone with PIC Paul', async () => {
        const response = await rina.post('/safety/hazards', { data: payload });

        expect(response.status()).toBe(201);
        hazard = await response.json();
        expect(hazard.status).toBe('OPEN');
      });

      await test.step('2. GET the Hazard by its ID', async () => {
        const response = await rina.get(`/safety/hazards/${hazard.id}`);

        expect(response.status()).toBe(200);
        const saved: Hazard = await response.json();
        expect(saved).toMatchObject({
          locationId: payload.locationId,
          sublocationId: payload.sublocationId,
          areaId: payload.areaId,
          areaDescription: payload.areaDescription,
          evidenceIds: payload.evidenceIds,
          picId: users.paul,
          reporterId: users.rina,
        });
        expect(saved.followupTask.picId).toBe(users.paul);
      });

      await test.step("3. GET Paul's Followup Tasks", async () => {
        const response = await paul.get('/safety/followup-tasks');

        expect(response.status()).toBe(200);
        const tasks: { id: string }[] = await response.json();
        expect(tasks.map((task) => task.id)).toContain(hazard.followupTask.id);
      });
    },
  );

  test('HZ-A-002 Reject a Hazard missing a mandatory field', { tag: '@P1' }, async ({ apiAs }) => {
    const rina = await apiAs(users.rina);
    const mandatory: (keyof HazardPayload)[] = [
      'locationId',
      'sublocationId',
      'areaId',
      'evidenceIds',
      'picId',
    ];

    for (const [index, field] of mandatory.entries()) {
      await test.step(`${index + 1}. POST the payload without ${field}`, async () => {
        const valid = await validHazard(rina);
        const payload: Partial<HazardPayload> = { ...valid };
        delete payload[field];
        const response = await rina.post('/safety/hazards', { data: payload });

        expect(response.status()).toBe(400);
        expect(await response.text()).toContain(field);

        const created = await rina.get('/safety/hazards', { params: { clientId: valid.clientId } });
        expect(await created.json()).toHaveLength(0);
      });
    }
  });

  test(
    'HZ-A-004 Hazard notifications go to the right people',
    { tag: '@P1' },
    async ({ apiAs }) => {
      const rina = await apiAs(users.rina);
      const since = new Date();
      let hazard: Hazard;

      // Notifications are delivered asynchronously, so wait for each recipient's list to settle.
      const typesFor = async (recipient: Username) =>
        (await notificationsFor(rina, recipient, since))
          .filter((notification) => notification.hazardId === hazard.id)
          .map((notification) => notification.type);

      await test.step('1. POST /safety/hazards for Crusher Zone with PIC Paul', async () => {
        const response = await rina.post('/safety/hazards', {
          data: await validHazard(rina, { areaId: places.crusherZone, picId: users.paul }),
        });

        expect(response.status()).toBe(201);
        hazard = await response.json();
      });

      await test.step("2. Read Paul's notifications", async () => {
        await expect.poll(() => typesFor(users.paul)).toEqual(['FOLLOWUP_ASSIGNED']);
      });

      await test.step("3. Read Maya's notifications", async () => {
        await expect.poll(() => typesFor(users.maya)).toEqual(['HAZARD_CREATED']);
      });

      // Paul and Maya have been notified by now, so any notification to these four would have arrived too.
      await test.step('4. Read the notifications of Omar, Tara, Sam and Rina', async () => {
        for (const recipient of [users.omar, users.tara, users.sam, users.rina]) {
          expect(await typesFor(recipient), `notifications for ${recipient}`).toEqual([]);
        }
      });
    },
  );
});
