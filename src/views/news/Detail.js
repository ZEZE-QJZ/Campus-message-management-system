import React, { useEffect, useState } from 'react';
import { PageHeader } from '@ant-design/pro-layout';
import { Descriptions } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { CheckCircleTwoTone, HeartTwoTone, SmileTwoTone } from '@ant-design/icons';

export default function Detail() {
  const [ newsInfo, setNewsInfo ] = useState(null);
  const params = useParams();
  useEffect(() => {
    axios.get(`/news/${params.id}?_expand=role&_expand=category`).then(res => {
      setNewsInfo({
        ...res.data,
        view: res.data.view + 1
      });
      // 同步后端
      return res.data
    }).then(res => {
      axios.patch(`/news/${params.id}`, {
        view: res.view + 1
      });
    });
  }, []);

  const handleStar = () => {
    // 同步后端
    axios.patch(`/news/${params.id}`, {
      star: newsInfo.star + 1
    }).then(res => {
      setNewsInfo({
        ...newsInfo,
        star: newsInfo.star + 1
      });
    })
  };

  return (
    <div>
      {
        newsInfo &&
        <div>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={<div>
              <span>{newsInfo.category.title}</span>
              <HeartTwoTone onClick={() => handleStar()} twoToneColor="#eb2f96" />
            </div>}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">
                {newsInfo.author}
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">
                {newsInfo.publishTime ? moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="区域">
                {newsInfo.region}
              </Descriptions.Item>
              <Descriptions.Item label="访问数量">
                <span style={{color: 'green'}}>{newsInfo.view}</span>
              </Descriptions.Item>
              <Descriptions.Item label="点赞数量">
                <span style={{color: 'green'}}>{newsInfo.star}</span>
              </Descriptions.Item>
              <Descriptions.Item label="评论数量">
                <span style={{color: 'green'}}>0</span>
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div dangerouslySetInnerHTML={{
            __html:newsInfo.content
          }}>
          </div>
        </div>
      }
    </div>
  )
}