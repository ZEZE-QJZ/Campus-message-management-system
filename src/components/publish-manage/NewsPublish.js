import { Button, Tag, Table, notification } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { SmileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function NewsPublish(props) {
  const navigate = useNavigate();
  console.log(props)

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}><b>{title}</b></a>
      },
    },
    {
      title: '作者',
      dataIndex: 'author',
      render: (author) => {
        return (
          <b>{author}</b>
        );
      }
    },
    {
      title: '新闻分类',
      dataIndex: 'categoryId',
      render: (categoryId, item) => {
        return (
          <Tag color="blue">{item.category.title}</Tag>
        )
      }
    },
    {
      title: '操作',
      render: (item) => {
        const buttonTitle = ['发布', '下线', '删除'];
        return (
          <Button
           onClick={() => buttonClick(item)}
          >
            {buttonTitle[props.publishState - 1]}
          </Button>
        )
      }
    },
  ];

  const buttonClick = (item) => {
    if(props.publishState != 3) {
      props.setHandleData(item.id);
      axios.patch(`/news/${item.id}`, {
        publishState: Number(props.publishState) + 1
      }).then(res => {
        notification.open({
          message: `通知`,
          description: `您可以到发布管理的${props.publishState == 1 ? '已发布列表' : '草已下线列表'}中查看您的新闻`,
          placement: 'bottomRight',
          icon: (
            <SmileOutlined
              style={{
                color: '#108ee9',
              }}
            />
          ),
        });
        navigate(`${props.publishState == 1 ? '/publish-manage/published' : '/publish-manage/sunset'}`,{
          state: {...item}
        });
      });
    }else {
      props.setHandleData(item.id);
      axios.delete(`/news/${item.id}`).then(res => {
        notification.open({
          message: `通知`,
          description: `您的新闻已删除`,
          placement: 'bottomRight',
          icon: (
            <SmileOutlined
              style={{
                color: '#108ee9',
              }}
            />
          ),
        });
      });
    };
  };

  return (
    <div>
      <Table
        dataSource={props.dataSource}
        columns={columns}
        rowKey={item=>item.id}
        size='small'
        pagination={{
          pageSize: 8
        }}
      />
    </div>
  )
}