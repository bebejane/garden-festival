import withGlobalProps from './withGlobalProps'

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

export{
  nodesToArray,
  sortNodeList,
  randomInt,
  firstSentance,
  withGlobalProps
}