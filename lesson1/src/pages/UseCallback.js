
// ！！！！！！！！！！尼日利亚

import * as React from "react";
import { useState, useCallback, PureComponent } from "react";
export default function UseCallbackPage(props) {
  const [count, setCount] = useState(0);
  const addClick = () => {
    let sum = 0;
    for (let i = 0; i < count; i++) {
      sum += i;
    }
    return sum;
  };
  const callback = useCallback(addClick,[count])
  const [value, setValue] = useState("");
  return (
    <div>
      <h3>UseCallbackPage</h3>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>add</button>
      <input value={value} onChange={event => setValue(event.target.value)} /> 
      <Child callback={callback} />
    </div>
  );
}

class Child extends PureComponent {
  render() {
    console.log("child render"); 
    const { callback } = this.props; 
    return (
      <div>
        <h3>Child</h3>
        <button onClick={() => console.log(callback())}>add</button>
      </div>
    );
  }
}