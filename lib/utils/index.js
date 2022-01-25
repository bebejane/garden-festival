import withGlobalProps from './withGlobalProps'
import { isAfter, isBefore } from 'date-fns'
import { utcToZonedTime, toDate } from 'date-fns-tz'
import { timeZones, FESTIVAL_START_DATE, FESTIVAL_END_DATE } from './constant'

const nodesToArray = (elements) => {
  elements = Array.isArray(elements) || elements instanceof NodeList ? elements : [elements]
  return Array.prototype.slice.call(elements, 0)
}
const sortNodeList = (list, sorter) => Array.prototype.slice.call(list, 0).sort(sorter);
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const firstSentance = (paragraph, maxLength) => {
  if(!paragraph) return ""
  return paragraph.indexOf('.') > -1 ? paragraph.split('.')[0].trim() : paragraph.substring(0, maxLength);
}

const truncateString = (str, length = 100, suffix = '...') => {
  if(!str || str.length <= length) return str;
  const words = str.split(' ');
  let tstr = ''
  
  for (let i = 0; i < words.length; i++) {
    if(tstr.length >= length)
      break;
    else
      tstr += words[i] + ' ';
  }
  return tstr.substring(0,tstr.length-1) + '...';
}

const transformEventWithTiming = (event) =>{
  return {
    ...event, 
    launched: isAfter(new Date(), new Date(event.startTime)), 
    inactive: (!event.register && !isAfter(new Date(), new Date(event.startTime))),
    isPreParty : isBefore(utcToZonedTime(toDate(event.startTime), 'Europe/Stockholm'), FESTIVAL_START_DATE),
		isAfterParty: isAfter(utcToZonedTime(toDate(event.startTime), 'Europe/Stockholm'), FESTIVAL_END_DATE)
  }
}

const wait = (ms = 0) => new Promise((resolve) => setTimeout(()=>resolve(), ms))
 
const getDefaultTimezone = ()=> {
  
  if(!process.browser) return timeZones[0]
  const localTimeZone = typeof Intl !== 'undefined' ? Intl?.DateTimeFormat().resolvedOptions().timeZone : undefined
  const current = localStorage?.getItem('tz') ? JSON.parse(localStorage.getItem('tz')) : timeZones.filter(t => t.timeZone === localTimeZone)[0] || timeZones[0]
  
  if(timeZones.filter(t => t.label === current.label && t.value === current.value).length)
    return current;
  else
    return timeZones[0]
}
export{
  nodesToArray,
  sortNodeList,
  randomInt,
  firstSentance,
  withGlobalProps,
  truncateString,
  transformEventWithTiming,
  wait,
  getDefaultTimezone
}