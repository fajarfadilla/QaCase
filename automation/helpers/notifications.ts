import type { APIRequestContext } from '@playwright/test';
import type { Username } from './test-data';

export type NotificationType = 'HAZARD_CREATED' | 'FOLLOWUP_ASSIGNED' | 'FOLLOWUP_SUBMITTED';

export interface Notification {
  type: NotificationType;
  recipient: Username;
  hazardId: string;
  sentAt: string;
}

/**
 * Reads the notifications an Employee received since a point in time, through the
 * test-only Notification Service endpoint (AS-37).
 */
export async function notificationsFor(
  api: APIRequestContext,
  recipient: Username,
  since: Date,
): Promise<Notification[]> {
  const response = await api.get('/test/notifications', {
    params: { recipient, since: since.toISOString() },
  });
  if (!response.ok()) {
    throw new Error(`Could not read notifications for ${recipient}: ${response.status()}`);
  }
  return response.json();
}
