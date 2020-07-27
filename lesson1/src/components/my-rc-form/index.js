import React, { Component } from 'react';

export default function createForm(Cmp) {
  return class extends Component {
    constructor(props) {
      super(props)
      this.state = {};
      this.options = {};
    }
    // input 变化设置值
    handleChange = e => {
      const {name, value} = e.target;
      this.setState({[name]: value})
    };

    // 这是一个高阶组件
    getFieldDecorator = (field, option) => InputCmp => {
      this.options[field] = option;
      return React.cloneElement(InputCmp, {
        name: field,
        value: this.state[field] || "",
        onChange: this.handleChange
      })
    }

    setFieldsValue = newStore => {
      this.setState(newStore)
    }

    getFieldsValue = () => {
      return this.state;
    }

    validateFields = callback => {
      let err = []
      // 校验规则 this.options
      // 校验的值是this.state
      Object.keys(this.options).forEach( field => {
        if (this.state[field] === undefined) {
          err.push({
            [field]: 'err'
          })
        }
      })

      if (err.length === 0) {
        // 校验成功
        callback(null, this.state)
      } else {
        callback(err, this.state)
      }
     }

    getForm = () =>{
      return {
        form: {
          getFieldDecorator: this.getFieldDecorator,
          setFieldsValue: this.setFieldsValue,
          getFieldsValue: this.getFieldsValue,
          validateFields: this.validateFields
        }
      }
    }

    render() {
      return <Cmp {...this.props} {...this.getForm()} />
    }
  }
}