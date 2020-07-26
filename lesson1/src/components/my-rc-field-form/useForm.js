import React, {useRef} from 'react'
class FormStore {
  constructor() {
    this.store = {}; // 存储数据，比如说username/password
    this.fieldEnetities = []
    this.callbacks = {}
  }


  registerEntity = (entity) => {
    this.fieldEnetities.push(entity)
    return () => {
      this.fieldEnetities = this.fieldEnetities.filter(item => item !== entity)
      delete this.store[entity.props.name]
    }
  }

  setCallback = callback => {
    this.callbacks = {
      ...this.callbacks,
      ...callback
    }
  }
  setFieldsValue = (newStore) => {
    this.store = {
      ...this.store,
      ...newStore
    }
    // 对应的组件要更新
    this.fieldEnetities.forEach(entity => {
      const {name} = entity.props
      Object.keys(newStore).forEach(key => {
        if(key === name) {
          entity.onStoreChange()
        }
      })
    })
  }

  validate = () => {
    let err = [];
    // todo
    this.fieldEnetities.forEach(entity => {
      const {name, rules} = entity.props;
      let value = this.getFieldValue(name);
      let rule = rules && rules[0];
      if (rule && rule.required && (value === undefined || value === "")) {
        //  出错
        err.push({
          [name]: rules.message,
          value
        });
      }
    });
    return err;
  };

  submit = () => {
    console.log("this.", this.fieldEnetities); //sy-log
    let err = this.validate();
    // 在这里校验 成功的话 执行onFinish ，失败执行onFinishFailed
    const {onFinish, onFinishFailed} = this.callbacks;
    if (err.length === 0) {
      // 成功的话 执行onFinish
      onFinish(this.getFieldsValue());
    } else if (err.length > 0) {
      // ，失败执行onFinishFailed
      onFinishFailed(err);
    }
  };
  setFieldValue = () => {}

  getFieldValue = (name) => {
    return this.store[name] // 取数据
  }
  getFieldsValue = () => {
    return this.store // 取数据
  }
  getForm() {
    return {
      setFieldsValue: this.setFieldsValue,
      setFieldValue: this.setFieldsValue,
      getFieldValue: this.getFieldValue,
      registerEntity: this.registerEntity,
      submit: this.submit,
      setCallback: this.setCallback,
      getFieldsValue: this.getFieldsValue
    }
  }
}

// 自定义hook
export default function useForm(form) {
  const formRef = useRef()
  if (!formRef.current) {
    // new 一个
    if (form) {
      formRef.current = form
    }else {
      const formStore = new FormStore()
      formRef.current = formStore
    }
  }
  return [formRef.current]
}
