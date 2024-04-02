import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Spin } from 'antd';
import axios from "axios";
import Audit from "../../views/sandBox/audit-manage/Audit";
import AuditList from "../../views/sandBox/audit-manage/AuditList";
import Home from "../../views/sandBox/home/Home";
import NewsAdd from "../../views/sandBox/news-manage/NewsAdd";
import NewsCategory from "../../views/sandBox/news-manage/NewsCategory";
import NewsDraft from "../../views/sandBox/news-manage/NewsDraft";
import NoPermission from "../../views/sandBox/no-permission/NoPermission";
import Published from "../../views/sandBox/publish-manage/Published";
import Sunset from "../../views/sandBox/publish-manage/Sunset";
import Unpublished from "../../views/sandBox/publish-manage/Unpublished";
import RightList from "../../views/sandBox/right-manage/RightList";
import RoleList from "../../views/sandBox/right-manage/RoleList";
import UserList from "../../views/sandBox/user-manage/UserList";
import NewsPreview from "../../views/sandBox/news-manage/NewsPreview";
import NewsUpdate from "../../views/sandBox/news-manage/NewsUpdate";
import { connect } from "react-redux";

const LocalRouterMap = {
  "/home": <Home/>,
  "/user-manage/list": <UserList/>,
  "/right-manage/role/list": <RoleList/>,
  "/right-manage/right/list": <RightList/>,
  "/news-manage/add": <NewsAdd/>,
  "/news-manage/draft": <NewsDraft/>,
  "/news-manage/category": <NewsCategory/>,
  "/news-manage/preview/:id": <NewsPreview/>,
  "/news-manage/update/:id": <NewsUpdate/>,
  "/audit-manage/audit": <Audit/>,
  "/audit-manage/list": <AuditList/>,
  "/publish-manage/unpublished": <Unpublished/>,
  "/publish-manage/published": <Published/>,
  "/publish-manage/sunset": <Sunset/>,
};

const NewsRouter = (props) => {

  const { role: { rights } } = JSON.parse(localStorage.getItem("token"));

  const [ backRouteList, setBackRouteList ] = useState([]);
  useEffect(() => {
    Promise.all([
      axios.get('/rights'),
      axios.get('/children'),
    ]).then(res => {
      setBackRouteList([...res[0].data, ...res[1].data]);
    })
  }, []);

  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermission || item.routepermission)
  };

  const checkUserPermission = (item) => {
    return rights.includes(item.key);
  };

  return (
    <div>
      <Spin size="large" spinning={props.isLoading}>
        <Routes>
          {/* 重定向到home */}
          <Route path="/" element={<Navigate to="/home"/>} />
          {
            backRouteList.map(item => {
              if(checkRoute(item) && checkUserPermission(item))
                return (
                  <Route key={item.key} path={item.key} element={LocalRouterMap[item.key]} />
                );
              else
                return null;
            })
          }
          <Route path="*" element={<NoPermission/>} />
        </Routes>
      </Spin>
    </div>
  )
};

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
  return {
    isLoading
  }
};

const mapDispatchToProps = {
  changeLoading() {
    return {
      type: "change_loading",
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsRouter)