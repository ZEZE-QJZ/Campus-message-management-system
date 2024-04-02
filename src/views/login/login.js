import { Button, Form, Input, message } from "antd";
import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './login.css';
import ParticlesBg from "particles-bg";
import axios from "axios";
// import PowerModeInput from "power-mode-input";


export default function Login() {
  const navigate = useNavigate();

  const onFinish = (values) => {
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      if(res.data.length == 0) {
        message.error('用户名或密码不匹配');
      }else {
        localStorage.setItem('token', JSON.stringify(res.data[0]));
        navigate('/home', );
      }
    });
  };

  return (
    <div style={{background: 'rgb(35, 39, 65)', height: '100%'}}>
      <ParticlesBg  type="random"/>
      <div className="form-container">
        <div className="login-title">校园消息发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          {/* <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              忘记密码
            </a>
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
            Or <a href="">注册</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}