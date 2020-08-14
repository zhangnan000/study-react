// vnode 虚拟对象
// node 真实dom

import { TEXT, PLACEMENT } from "./const";

// 下一个单元任务 fiber
let nextUnitOfWork = null
// 根fiber
let wipRoot = null

/**
 * fiber架构
 * type: 标记类型
 * key: 标记当亲啊层级下唯一性
 * child : 第一个子元素
 * sibling:下一个兄弟元素
 * return 父节点
 * node:真实dom节点
 * props: 属性值
 * effectTag: 标记呀执行的操作类型（删除、插入、更新）
 * base: 上次的节点 fiber
 */

function render(vnode, container) {
  // //vnode -> node
  // const node = createNode(vnode)
  // // 再把node插入container
  // container.appendChild(node)
  // 初始值
  wipRoot = {
    node: container,
    props: {
      children: [vnode]
    }
  }
  nextUnitOfWork = wipRoot
}

// 创建node
function createNode(vnode) {
  const {type, props} = vnode;
  let node = null
  if (type === TEXT) {
    // 文本
    node = document.createTextNode('')
  } else if(typeof type === 'string'){
    // 原生标签
    node = document.createElement(type)
  } else if (typeof type === 'function') {
    // 判断是函数组件还是类组件
    // 类组件
    node = type.prototype.isReactComponent 
      ? updateClassComponent(vnode)
      : updateFunctionComponent(vnode)
  } else {
    // 类似于<></>
    node = document.createDocumentFragment()
  }

  // 把props.chilren 遍历，转成真实dom节点，再插入node
  // reconcileChildren(props.children, node)
  // 更新属性节点
  updateNode(node, props)
  return node;
}
// 属性值更新如属性值/nodeVale,过滤children
function updateNode(node, nextVal) {
  Object.keys(nextVal).filter(k => k !== 'children').forEach(prop => {
    node[prop] = nextVal[prop]
  })
}

// 可以是单个对象或是数组
function reconcileChildren_old(children, node) {
  for(let i = 0; i< children.length; i++) {
    let child = children[i];
    if (Array.isArray(child)) {
      for(let j = 0; j < child.length; j++ ){
        render(child[j], node)
      }
    } else {
      render(child, node)
    }
    
  }
}
// 源码中是数组或者对象childern Fiber -> child -> sibling
function reconcileChildren(workInProgressFiber, children) {
  // 构建fiber架构
  // 记录上一次的fiber
  let prevSibling = null;
  for (let i = 0; i< children.length; i++) {
    let child = children[i]
    // 现在只考虑初次渲染
    // 创建一个新的fiber
    let newFiber = {
      type: child.type,
      props: child.props,
      node: null,
      base: null,
      return: workInProgressFiber,
      effectTag: PLACEMENT
    }
    // 形成一个链表结构
    if(i === 0) {
      workInProgressFiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber

  }
}

function workLoop(deadline) {
  // 有下一个任务 并且当前帧没有结束
  while(nextUnitOfWork && deadline.timeRemaining()>1) {
    // 执行当前任务
    // 获取下一个任务
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  // 推出循环
  if (!nextUnitOfWork && wipRoot) {
    // 提交
    commitRoot();
  }
  requestIdleCallback(workLoop)
}

function performUnitOfWork(fiber) {
  // 执行当前任务
  const {type} = fiber;
  if (typeof type === 'function') {
    type.prototype.isReactComponent
      ? updateClassComponent(fiber)
      : updateFunctionComponent(fiber)
  } else {
    // 原生标签
    updateHostComponent(fiber)
  }
  // 获取下一个任务
  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber;
  while(nextFiber) {
    // 找到兄弟
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    // 没有兄弟往上找
    nextFiber = nextFiber.return;
  }
}
// 原生标签
function updateHostComponent(fiber) {
  if (!fiber.node) {
    fiber.node = createNode(fiber);
  }
  // 协调子元素
  const {children} = fiber.props;
  reconcileChildren(fiber, children)
}

requestIdleCallback(workLoop)

function updateClassComponent(fiber) {
  const {type, props} = fiber;
  let cmp = new type(props);
  const children = [cmp.render()];
  reconcileChildren(fiber, children)
}
function updateFunctionComponent(fiber) {
  const {type, props} = fiber;
  const children = [type(props)]
  reconcileChildren(fiber, children)
}

// 提交
function commitRoot() {
  commitWorker(wipRoot.child);
  // 防止重复提交
  wipRoot = null
}
function commitWorker(fiber) {
  if (!fiber) {
    return
  }

  // 找到parentNode,
  // 找到最近的有node节点的祖先fiber
  let parentNodeFiber = fiber.return
  while(!parentNodeFiber.node) {
    parentNodeFiber = parentNodeFiber.return
  }
  const parentNode = parentNodeFiber.node

  if(fiber.effectTag === PLACEMENT && fiber.node !==null) {
    // 新增插入
    parentNode.appendChild(fiber.node)
  }
  commitWorker(fiber.child)
  commitWorker(fiber.sibling)
}

export default {render}