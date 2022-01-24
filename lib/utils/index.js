import withGlobalProps from './withGlobalProps'
import isAfter from 'date-fns/isAfter'

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

export{
  nodesToArray,
  sortNodeList,
  randomInt,
  firstSentance,
  withGlobalProps,
  truncateString,
  transformEventWithTiming,
  wait
}