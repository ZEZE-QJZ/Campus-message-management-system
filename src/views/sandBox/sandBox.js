import React, { useEffect } from "react";
import { Layout, theme } from "antd";
import MouseParticles from 'react-mouse-particles';
import SideMenu from "../../components/sandBox/SideMenu";
import TopHeader from "../../components/sandBox/TopHeader";
import NewsRouter from "../../components/sandBox/NewsRouter";
import './sandBox.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'

const { Content } = Layout;

export default function SandBox() {
  NProgress.start();
  NProgress.done();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <MouseParticles g={1} color="random" cull="col,image-wrapper"/>
      <SideMenu></SideMenu>
      <Layout>
        <TopHeader></TopHeader>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto',
          }}
        >
          <NewsRouter />
        </Content>
      </Layout>
    </Layout>
  )
}