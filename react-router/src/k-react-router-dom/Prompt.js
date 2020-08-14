

// ！！！！！！！！尼日尔
import React from "react";
import {RouterContext} from "./Context";

export default function Prompt({message, when = true}) {
  return (
    <RouterContext.Consumer>
      {context => {
        if (!when) {
          return null;
        }
        let method = context.history.block;
        console.log(context,'context')
        return (
          <LifeCycle
            onMount={self => {
              // 挂载之后将方法赋值
              self.leave = method(message)
            }}
            onUnmount={self => {
              // 页面卸载之前执行函数
              self.leave()
            }}
          />
        )
      }

      }
    </RouterContext.Consumer>
  );
}

class LifeCycle extends React.Component {
  componentDidMount() {
    if(this.props.onMount) {
      this.props.onMount.call(this, this)
    }
  }
  componentWillUnmount() {
    if(this.props.onUnmount) {
      this.props.onUnmount.call(this, this)
    }
  }
  render() {
    return null;
  }
}
