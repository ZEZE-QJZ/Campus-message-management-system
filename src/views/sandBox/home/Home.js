import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Avatar, Card, Col, Drawer, Row, List, Typography } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import * as Echarts from 'echarts';
import _ from 'loadsh';

export default function Home() {
  const { Meta } = Card;
  const [ userViewData, setUserViewData ] = useState([]);
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=5`).then(res => {
      setUserViewData(res.data)
    });
  }, [])
  const [ userStarData, setUserStarData ] = useState([]);
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=5`).then(res => {
      setUserStarData(res.data)
    });
  }, [])

  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'));

  const barRef = useRef(null);
  const [ allList, setAllList ] = useState([]);
  const renderBar = (data) => {
    // 基于准备好的dom，初始化echarts实例
    let myChart = Echarts.init(barRef.current);
    // 指定图表的配置项和数据
    let option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: Object.keys(data),
        axisLabel: {
          rotate: '45',
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: '销量',
          type: 'bar',
          data: Object.values(data).map(item => item.length)
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    // 窗口事件：使得图标和窗口响应
    window.onresize = () => {
      myChart.resize();
    };
  };
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
      renderBar(_.groupBy((res.data), item => item.category.title));
      setAllList([...res.data]);
    });
    return () => {
      window.onresize = null;
    }
  }, [])

  const pieRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [ pieChart, setPieChart ] = useState(null);
  const onClose = () => {
    setOpen(false);
  };
  const showDrawer = () => {
    setOpen(true);
    setTimeout(() => {
      renderPie();
    }, 100)
  };
  const renderPie = () => {
    let currentList = allList.filter(item => item.author == username);
    let groupObj = _.groupBy(currentList, item => item.category.title);
    console.log(groupObj)
    let data = Object.entries(groupObj).map(item => {
      return {
        name: item[0],
        value: item[1].length,
      }
    });
    // 基于准备好的dom，初始化echarts实例
    let myChart;
    if(!pieChart) {
      myChart = Echarts.init(pieRef.current);
      setPieChart(myChart);
    }else {
      myChart = pieChart;
    };
    // 指定图表的配置项和数据
    let option = {
      title: {
        text: '当前用户新闻分类图示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card hoverable title="用户最常浏览" bordered={false} >
            <List
              dataSource={userViewData}
              renderItem={(item) => {
                return (
                  <List.Item>
                    <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                  </List.Item>
                )
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable title="用户收藏最多" bordered={false}>
            <List
              dataSource={userStarData}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => showDrawer()}/>,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
              title={username}
              description={
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <b>{region ? region: '全球' }</b>
                  <span>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <div
          ref={barRef}
          style={{width: '100%', height: '400px', marginTop: '30px'}}
        >
        </div>
      </Row>
      <Drawer
        width='500px'
        title="个人新闻分类"
        onClose={onClose}
        open={open}
      >
        <div
          ref={pieRef}
          style={{width: '100%', height: '400px', marginTop: '30px'}}
        >
        </div>
      </Drawer>
    </div>
  )
}