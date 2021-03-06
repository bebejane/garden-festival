import { utcToZonedTime, toDate } from 'date-fns-tz'

export const APP_NAME = `garden-festival`;
export const GRAPHQL_API_ENDPOINT = `https://graphql.datocms.com`;
export const GRAPHQL_PREVIEW_API_ENDPOINT = `https://graphql.datocms.com/preview`;
export const GRAPHQL_API_TOKEN = process.env.GRAPHQL_API_TOKEN;
export const FESTIVAL_START = '2022-02-07T00:00:00+01:00'
export const FESTIVAL_END = '2022-02-11T23:59:59+01:00';
export const FESTIVAL_START_DATE = utcToZonedTime(toDate(FESTIVAL_START), 'Europe/Stockholm')
export const FESTIVAL_END_DATE = utcToZonedTime(toDate(FESTIVAL_END), 'Europe/Stockholm')

export const timeZones = [
  { label: 'STO', value: 'UTC+01:00', city:'Stockholm', timeZone: 'Europe/Stockholm' },
  { label: 'BLN', value: 'UTC+01:00', city:'Berlin', timeZone: 'Europe/Berlin' },
  { label: 'LND', value: 'UTC+00:00', city:'London', timeZone: 'Europe/London' },
  { label: 'L.A', value: 'UTC-08:00', city:'Los Angeles', timeZone: 'America/Los_Angeles' },
  { label: 'MEL', value: 'UTC+11:00', city:'Melbourne', timeZone: 'Australia/Melbourne' },
  { label: 'PER', value: 'UTC+08:00', city:'Perth', timeZone: 'Australia/Perth' },
  { label: 'NYC', value: 'UTC-05:00', city:'New York', timeZone: 'America/New_York' },
  { label: 'PAR', value: 'UTC+01:00', city:'Paris', timeZone: 'Europe/Paris' },
  { label: 'SYD', value: 'UTC+11:00', city:'Sydney', timeZone: 'Australia/Sydney' },
  { label: 'TRO', value: 'UTC+01:00', city:'Trondheim', timeZone: 'Europe/Oslo' },
  { label: 'AUS', value: 'UTC-06:00', city:'Austin', timeZone: 'America/Chicago' },
  { label: 'VAN', value: 'UTC-08:00', city:'Vancouver', timeZone: 'America/Vancouver' },
  { label: 'CAP', value: 'UTC+02:00', city:'Cape Town', timeZone: 'Africa/Johannesburg' },
  { label: 'STG', value: 'UTC-03:00', city:'Santiago', timeZone: 'America/Santiago' },
  { label: 'TKY', value: 'UTC+09:00', city:'Tokyo', timeZone: 'Asia/Tokyo' },
]