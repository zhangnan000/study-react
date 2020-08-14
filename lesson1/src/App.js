import React from "react";
import MyRCForm from "./pages/MyRCForm";
import UseCallbackPage from "./pages/UseCallback";
import UseMemoPage from "./pages/UseMemo";
// import MyRCFieldForm from "./pages/MyRCFieldForm";
// import ContextPage from './pages/ContextPage'
// import AntdFormPage from './pages/AntdFormPage'

export default function App(props) {
  return (
    <div>
      {/* <ContextPage /> */}
      {/* <AntdFormPage /> */}
      {/* <MyRCFieldForm /> */}
      {/* <MyRCForm/> */}
      <UseCallbackPage/>
      {/* <UseMemoPage/> */}
    </div>
  );
}
