export const APP_NAME = `garden-festival`;
export const GRAPHQL_API_ENDPOINT = `https://graphql.datocms.com`;
export const GRAPHQL_PREVIEW_API_ENDPOINT = `https://graphql.datocms.com/preview`;
export const GRAPHQL_API_TOKEN = process.env.GRAPHQL_API_TOKEN;
export const FESTIVAL_START_DATE = new Date(2022,1,7, 8, 0, 0)
export const FESTIVAL_END_DATE = new Date(2022,1,11, 23, 59, 59);
export const timeZones = [
  { value: 'UTC', label: 'UTC', city:'Stockholm', timeZone: 'Europe/Stockholm' },
  { value: 'CET', label: 'CET', city:'Berlin', timeZone: 'Europe/Berlin' },
  { value: 'EST', label: 'EST', city:'New York', timeZone: 'America/New_York' },
  //{ value: 'JST', label: 'JST', city:'Japan', timeZone: 'Asia/Japan' }
]