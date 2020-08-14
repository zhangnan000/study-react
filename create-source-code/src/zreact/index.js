import {TEXT} from './const'

// 创建react element

function createElement(type, config, ...children) {
  console.log(type,'type')
  const props = {
    ...config,
    // 判断是否是对象，是对象直接返回， 不是则是文本节点， 然后创建文本节点
    children: children.map(child => 
      typeof child === 'object' ? child : createTextNode(child))
  };
  return {
    type,
    props
  }
}

function createTextNode(text) {
  return {
    type: TEXT,
    props: {
      children: [],
      nodeValue: text
    }
  }
}

export default {
  createElement
}