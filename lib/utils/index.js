import withGlobalProps from './withGlobalProps'
import isAfter from 'date-fns/isAfter'
import { timeZones } from './constant'

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
    inactive: (!event.register && !isAfter(new Date(), new Date(event.startTime)))
  }
}

const wait = (ms = 0) => new Promise((resolve) => setTimeout(()=>resolve(), ms))
 
const getDefaultTimezone = ()=> {
  if(!process.browser) return timeZones[0]
  const current = localStorage?.getItem('tz') ? JSON.parse(localStorage.getItem('tz')) : timeZones[0]
  
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