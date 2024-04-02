import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "../views/login/login";
import Detail from "../views/news/Detail";
import News from "../views/news/News";
import SandBox from "../views/sandBox/sandBox";

export default function IndexRouter() {

  return (
    <HashRouter>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/news' element={<News/>}/>
        <Route path='/detail/:id' element={<Detail/>}/>
        {/* SandBox组件之下还可以匹配更多嵌套路由，因此需要加“*”来进行匹配 */}
        <Route path='/*' element={localStorage.getItem('token') ? <SandBox/> : <Login/>}/>
      </Routes>
    </HashRouter>
  )
}