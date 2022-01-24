export const APP_NAME = `garden-festival`;
export const GRAPHQL_API_ENDPOINT = `https://graphql.datocms.com`;
export const GRAPHQL_PREVIEW_API_ENDPOINT = `https://graphql.datocms.com/preview`;
export const GRAPHQL_API_TOKEN = process.env.GRAPHQL_API_TOKEN;
export const FESTIVAL_START_DATE = new Date(2022,1,7, 0, 0, 0)
export const FESTIVAL_END_DATE = new Date(2022,1,11, 23, 59, 59);
export const timeZones = [
  { label: 'STHLM', value: 'UTC+01:00', city:'Stockholm', timeZone: 'Europe/Stockholm' },
  { label: 'BLN', value: 'UTC+01:00', city:'Berlin', timeZone: 'Europe/Berlin' },
  { label: 'LON', value: 'UTC+00:00', city:'London', timeZone: 'Europe/London' },
  { label: 'NYC', value: 'UTC-05:00', city:'New York', timeZone: 'America/New_York' },
  { label: 'LA', value: 'UTC-08:00', city:'Los Angeles', timeZone: 'America/Los_Angeles' },
  { label: 'TKY', value: 'UTC+09:00', city:'Tokyo', timeZone: 'Asia/Tokyo' },
  { label: 'PAR', value: 'UTC+01:00', city:'Paris', timeZone: 'Europe/Paris' }
]