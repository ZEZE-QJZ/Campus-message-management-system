import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // APP根组件
import './util/http'
// import reportWebVitals from './reportWebVitals'; // WEB报告分析


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // 防止严格模式导致声明周期重复执行，暂时取消严格模式
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

