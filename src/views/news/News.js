import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PageHeader } from "@ant-design/pro-layout";
import { Card, Col, Row, List, Typography } from 'antd';
import _ from 'loadsh';

export default function News() {
  let [ list, setList ] = useState([]);
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
      setList(Object.entries(_.groupBy((res.data), item => item.category.title)));
      console.log(Object.entries(_.groupBy((res.data), item => item.category.title)))
    })
  }, []);

  return (
    <div style={{width: '95%', margin: '0 auto'}}>
        <PageHeader
          className="site-page-header"
          title="校园消息"
          subTitle="查看消息"
        />
        <div className="site-page-wrapper">
          <Row gutter={[16, 16]}>
            {
              list.map(item =>
                <Col span={8} key={item[0]}>
                  <Card hoverable title={item[0]} bordered={false}>
                    <List
                      pagination={{
                        pageSize: 3
                      }}
                      dataSource={item[1]}
                      renderItem={(data) => (
                        <List.Item>
                          <a href={`#/detail/${data.id}`}>{data.title}</a>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              )
            }
          </Row>
        </div>
    </div>
  )
}