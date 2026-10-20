/**
 * Seeded test data, matching "Test Data" in testcases/manual/flow-2-hazard-report.md.
 * The IDs are assumed (AS-45); replace them with the real seed IDs of the test environment.
 * Employees are identified by their username.
 */
export const users = {
  rina: 'rina', // Reporter; Area Member of Crusher Zone
  paul: 'paul', // usual PIC; Area Member of Crusher Zone
  maya: 'maya', // Area Member of Crusher Zone
  omar: 'omar', // Area Member of Bay 2 only
  sam: 'sam', // Direct Supervisor of Crusher Zone; not an Area Member
  tara: 'tara', // Tenant B
  adminA: 'admin.a', // Tenant A admin
  adminB: 'admin.b', // Tenant B admin
} as const;

export type Username = (typeof users)[keyof typeof users];

export const tenants = {
  a: { id: 'tenant-a', name: 'Tenant A' },
  b: { id: 'tenant-b', name: 'Tenant B' },
} as const;

export const places = {
  siteNorth: 'loc-site-north',
  siteSouth: 'loc-site-south',
  pit1: 'subloc-pit-1',
  workshop: 'subloc-workshop',
  pit3: 'subloc-pit-3',
  crusherZone: 'area-crusher-zone',
  haulRoad: 'area-haul-road',
  bay2: 'area-bay-2',
  rampA: 'area-ramp-a',
} as const;

/** A Location → Sublocation → Area in Tenant B, for tenant isolation specs. */
export const tenantBPlaces = {
  location: 'loc-b-quarry',
  sublocation: 'subloc-b-pit-a',
  area: 'area-b-loading-bay',
} as const;
