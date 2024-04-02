import React, { useEffect, useState } from "react";
import { Button, notification, Table, Tag } from "antd";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SmileOutlined } from '@ant-design/icons';

export default function AuditList() {
  const [ dataSource, setDataSource ] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    // _ne不等 _lte小于等于
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      console.log(res.data)
      setDataSource(res.data);
    })
  }, []);
  const navigate = useNavigate()

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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const auditList = ['未审核', '审核中', '已通过', '未通过'];
        const auditColor = ['default', 'warning', 'success', 'error'];
        return (
          <Tag color={auditColor[auditState]}>{auditList[auditState]}</Tag>
        )
      }
    },
    {
      title: '操作',
      render: (item) => {
        const button = ['撤销', '发布', '修改'];
        const buttonColor = ['primary', 'default']
        return (
          <Button
            type={buttonColor[item.auditState - 2]}
            danger={item.auditState == 1 ? true : false}
            onClick={() => buttonFunction(item)}
          >
            {button[item.auditState - 1]}
          </Button>
        )
      }
    },
  ];

  const buttonFunction = (item) => {
    if(item.auditState == 1) {
      // patch修改数据，跳转到草稿箱
      setDataSource(dataSource.filter(data => data.id !== item.id));
      axios.patch(`/news/${item.id}`, {
        auditState: 0
      }).then(res => {
        notification.open({
          message: `通知`,
          description: `您可以到草稿箱中查看您的新闻`,
          placement: 'bottomRight',
          icon: (
            <SmileOutlined
              style={{
                color: '#108ee9',
              }}
            />
          ),
        });
      })
      navigate(`/news-manage/draft`,{
        state: {...item}
      });
    }else if(item.auditState == 2) {
      // patch修改数据，跳转到发布管理的已发布
      setDataSource(dataSource.filter(data => data.id !== item.id));
      axios.patch(`/news/${item.id}`, {
        publishState: 2,
        publishTime: Date.now()
      }).then(res => {
        notification.open({
          message: `通知`,
          description: `您可以到发布管理的已发布列表中查看您的新闻`,
          placement: 'bottomRight',
          icon: (
            <SmileOutlined
              style={{
                color: '#108ee9',
              }}
            />
          ),
        });
      })
      navigate(`/publish-manage/published`,{
        state: {...item}
        });
    }else if(item.auditState == 3) {
      navigate(`/news-manage/update/${item.id}`,{
        state: {...item}
       });
    }

  };


  return (
    <div>
      <Table
        dataSource={dataSource}
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