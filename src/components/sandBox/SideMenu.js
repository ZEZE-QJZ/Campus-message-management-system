import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HighlightOutlined,
} from '@ant-design/icons';
import './index.css';
import axios from 'axios';
import { connect } from 'react-redux';


const SideMenu = (props) => {
  const { Sider } = Layout;
  const navigate = useNavigate();
  const location = useLocation();

  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))

  // 初始化侧边菜单栏
  const [ menuList, setMenuList ] = useState([]);
  // 定义菜单栏和图标的映射
  // const iconList = {
  //   '/home': <UserOutlined />,
  // }
  // 判断是否为侧边栏权限
  const checkPagePermission = (item) => {
    return item.pagepermission && rights.includes(item.key);
  }
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      const updateMenu = [];
      res.data.forEach(item => {
        if(checkPagePermission(item)) {
          let children = [];
          if(item.children.length) {
            item.children.forEach(child => {
              if(checkPagePermission(child)) {
                // console.log('child', child);
                children.push({
                  icon: <HighlightOutlined />,
                  label: child.title,
                  key: child.key
                });
              };
            });
          };
          updateMenu.push({
            children: children.length ? children : '',
            icon: <HighlightOutlined />,
            label: item.title,
            key: item.key
          });
        };
      })
      setMenuList(updateMenu);
    });
  }, []);

  // 点击侧边栏跳转路由
  const onClick = (item) => {
    navigate(item.key,{
      replace: true,
      state: {
        key: item.key,
        label: item.label,
        icon: item.icon,
        children: item.children || []
      }
     });
  };

  // 设置选中侧边栏路由
  const openKeys = ['/' + location.pathname.split('/')[1]];
  const selectKey = [location.pathname]

  return (
    <Sider trigger={null} collapsible collapsed = {props.isCollapsed}>
      <div style={{display: "flex", height: "100%", flexDirection: "column"}}>
        <div className="demo-logo-vertical" >校园消息发布管理系统</div>
        <div style={{flex: 1, overflow: "auto"}}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectKey}
            defaultOpenKeys={openKeys}
            items={menuList}
            onClick={onClick}
          />
        </div>
      </div>
    </Sider>
  )
};

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
};

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed",
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu)
