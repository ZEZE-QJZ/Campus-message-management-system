import { Button, Modal, notification, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, UploadOutlined, SmileOutlined } from '@ant-design/icons';
import axios from "axios";

export default function NewsDraft() {
  const [ dataSource, setDataSource ] = useState([]);
  const { username } = JSON.parse(localStorage.getItem('token'));
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      setDataSource(res.data);
    });
  }, []);
  const navigate = useNavigate();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
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
        return <div>
          <Button
            style={{marginRight: '10px'}}
            danger
            shape="circle"
            onClick={()=>confirmFunction(item)}
            icon={<DeleteOutlined />}
          />
          <Button
            style={{marginRight: '10px'}}
            shape="circle"
            onClick={()=>updateNews(item)}
            icon={<EditOutlined />}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<UploadOutlined />}
            onClick={()=>handleUpload(item)}
          />
        </div>
      }
    },
  ];

    // 删除操作
    const { confirm } = Modal
    const confirmFunction = (item) => {
      confirm({
        title: '您确定要删除？',
        footer: (_, { OkBtn, CancelBtn }) => (
          <div>
            <CancelBtn title='取消' />
            <OkBtn title='确定' />
          </div>
        ),
        onOk() {
          deleteFunction(item)
        },
      });
    };
    const deleteFunction = (item) => {
      // 当前页面和后端同步
      setDataSource(dataSource.filter(data => data.id !== item.id));
      axios.delete(`/news/${item.id}`);
    };

    // 编辑操作
    const updateNews = (item) => {
      navigate(`/news-manage/update/${item.id}`,{
        state: {...item}
       });
    }

    // 提交审核操作
    const handleUpload = (item) => {
      axios.patch(`/news/${item.id}`, {
        auditState: 1
      }).then(res => {
        navigate(`/audit-manage/list`);
        notification.open({
          message: `通知`,
          description: `您可以到审核列表中查看您的新闻`,
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
    }

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey={item=>item.id}
      size='small'
      pagination={{
        pageSize: 8
      }}
    />
  )
}