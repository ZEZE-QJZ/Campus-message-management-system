import React from "react";
import { useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Button, theme, Dropdown, Space, Avatar } from 'antd';
import { connect } from 'react-redux';

const TopHeader = (props) => {
  const changeCollapsed = () => {
    props.changeCollapsed()
  };

  const { Header } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))

  const items = [
    {
      key: '1',
      label: roleName,
    },
    {
      key: '2',
      danger: true,
      label: '退出',
      onClick: () => {
        localStorage.removeItem("token");
        navigate('/login', {
          replace: true
        });
      }
    },
  ];

  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      <Button
        type="text"
        icon={props.isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => changeCollapsed()}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div style={{float: "right", marginRight: 17}}>
        <span style={{marginRight: 10, fontWeight: 500}}>
          欢迎
          <span style={{color: '#1890ff'}}>
            {username}
          </span>
          回来
          </span>
        <Dropdown menu={{ items }}>
          <Space>
            <Avatar size={32} icon={<UserOutlined />} />
          </Space>
        </Dropdown>
      </div>
    </Header>
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

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)