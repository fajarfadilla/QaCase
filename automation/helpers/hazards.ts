import { randomUUID } from 'node:crypto';
import type { APIRequestContext } from '@playwright/test';
import { places, users, type Username } from './test-data';

export interface HazardPayload {
  clientId: string;
  locationId: string;
  sublocationId: string;
  areaId: string;
  areaDescription?: string;
  evidenceIds: string[];
  picId: Username;
}

export interface Hazard {
  id: string;
  status: 'OPEN' | 'RESOLVED';
  reporterId: Username;
  locationId: string;
  sublocationId: string;
  areaId: string;
  areaDescription?: string;
  evidenceIds: string[];
  picId: Username;
  followupTask: { id: string; picId: Username };
}

export interface FollowupPayload {
  evidenceIds?: string[];
  resolutionDate: string;
  coObserverIds?: Username[];
}

// 1x1 PNG, enough to stand in for an Evidence photo.
const EVIDENCE_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
);

export async function uploadEvidence(api: APIRequestContext): Promise<string> {
  const response = await api.post('/files', {
    multipart: { file: { name: 'evidence.png', mimeType: 'image/png', buffer: EVIDENCE_PNG } },
  });
  if (!response.ok()) {
    throw new Error(`Could not upload Evidence: ${response.status()}`);
  }
  return (await response.json()).id;
}

/** A Hazard Report for Crusher Zone with PIC Paul and one Evidence photo; override any field. */
export async function validHazard(
  api: APIRequestContext,
  overrides: Partial<HazardPayload> = {},
): Promise<HazardPayload> {
  return {
    clientId: randomUUID(),
    locationId: places.siteNorth,
    sublocationId: places.pit1,
    areaId: places.crusherZone,
    areaDescription: 'Loose rocks near the conveyor',
    evidenceIds: [await uploadEvidence(api)],
    picId: users.paul,
    ...overrides,
  };
}

/** Creates a Hazard as a precondition, failing fast if the backend rejects it. */
export async function createHazard(
  api: APIRequestContext,
  overrides: Partial<HazardPayload> = {},
): Promise<Hazard> {
  const response = await api.post('/safety/hazards', { data: await validHazard(api, overrides) });
  if (response.status() !== 201) {
    throw new Error(`Could not create a Hazard: ${response.status()} ${await response.text()}`);
  }
  return response.json();
}

export function validFollowup(overrides: Partial<FollowupPayload> = {}): FollowupPayload {
  return { resolutionDate: new Date().toISOString(), ...overrides };
}
