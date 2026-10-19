/** Where the specs point. Defaults are placeholders: there is no real environment yet (AS-44). */
export const env = {
  apiUrl: process.env.WEMINE_API_URL ?? 'https://api.wemine.test',
  webUrl: process.env.WEMINEOFFICE_URL ?? 'https://office.wemine.test',
};
