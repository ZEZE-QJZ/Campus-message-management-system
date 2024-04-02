import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, notification, Table, Tag, Tooltip } from "antd";
import { CheckOutlined, CloseOutlined, SmileOutlined } from '@ant-design/icons';

export default function Audit() {
  const [ dataSource, setDataSource ] = useState([]);
  const { roleId, region, id } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get('/news?auditState=1&_expand=category').then(res => {
      console.log(res.data);
      setDataSource(res.data?.filter(item =>
        item.roleId >= roleId && (region == '' || item.region == region)
      ));
    })
  }, []);

  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}><b>{title}</b></a>
      },
    },
    {
      title: "作者",
      dataIndex: "author",
      render: (author) => {
        return (
          <b>{author}</b>
        )
      }
    },
    {
      title: "新闻分类",
      dataIndex: "categoryId",
      render: (categoryId, item) => {
        return (
          <Tag color="blue">{item.category.title}</Tag>
        )
      }
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Tooltip title="通过">
              <Button
                type="primary"
                shape="circle"
                icon={<CheckOutlined />}
                style={{marginRight: '10px'}}
                onClick={() => handleAudit(item, 2, 1)}
              />
            </Tooltip>
            <Tooltip title="驳回">
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<CloseOutlined />}
                onClick={() => handleAudit(item, 3, 0)}
              />
            </Tooltip>
          </div>
        )
      }
    },
  ];

  // 通过 驳回
  const handleAudit = (item, auditState, publishState) => {
    setDataSource(dataSource.filter(data => data.id !== item.id));
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(res => {
      notification.open({
        message: `通知`,
        description: `您可以到审核管理的审核列表中查看您的新闻`,
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