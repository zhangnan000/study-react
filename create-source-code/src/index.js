// import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

import React from './zreact/index';
import ReactDOM from './zreact/react-dom';
import Component from './zreact/Component'
// 类组件
class ClassComp extends Component{
  render() {
    return (
      <div>
        class 组件 {this.props.name}
      </div>
    )
  }
}
// 函数组件

function Function(props) {
  return (
    <div className="border">函数组件</div>
  )
}
// 文本元素节点
const jsx = (
  <div className="border">
    <p>全栈</p>
    {/* {[1,2].map(item => (
      // <React.Fragment key={item}>{item}</React.Fragment>
      <div key={item}>{item}</div>
    ))}
    <>
      <p>1111</p>
    </> */}
    <ClassComp name='class'/>
    <Function name='function'/>
  </div>
)
ReactDOM.render(
  jsx,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
