export { default as withGlobalProps} from './withGlobalProps'
const nodesToArray = (elements) => Array.prototype.slice.call(elements, 0)
const sortNodeList = (list, sorter) => Array.prototype.slice.call(list, 0).sort(sorter);
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export{
  nodesToArray,
  sortNodeList,
  randomInt
}