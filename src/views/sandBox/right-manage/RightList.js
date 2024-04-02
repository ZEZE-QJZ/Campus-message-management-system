import React, { useEffect, useState } from "react";
import { Button, Modal, Switch, Table, Tag, Popover } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from "axios";

export default function RightList() {
  // 列表数据
  const [ dataSource, setDataSource ] = useState([])
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      setDataSource(res.data.map(item => {
        let children = null;
        if(item.children.length === 0) {
          children = ''
        }else {
          children = [...item.children]
        }
        return {
          children,
          grade: item.grade,
          id: item.id,
          key: item.key,
          title: item.title,
          pagepermission: item.pagepermission
        }
      }));
    });
  }, []);

  // 删除操作
  const { confirm } = Modal
  // 删除确认框
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
  // 删除函数
  const deleteFunction = (item) => {
    console.log('点击确定并删除', item);
    // 当前页面和后端同步
    if(item.grade === 1) {
      setDataSource(dataSource.filter(data => data.id !== item.id));
      axios.delete(`/rights/${item.id}`);
    }else {
      // 浅复制引用类型dataSource
      let list = dataSource.filter(data => data.id === item.rightId);
      // 删除子节点
      list[0].children = list[0].children.filter(data => data.id !== item.id);
      setDataSource([...dataSource]);
      axios.delete(`/children/${item.id}`);
    }
  };

  // 编辑操作
  const switchMethod = (item) => {
    item.pagepermission = item.pagepermission == 1 ? 0 : 1;
    setDataSource([...dataSource]);
    if(item.grade == 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermission: item.pagepermission
      });
    }else {
      axios.patch(`/children/${item.id}`, {
        pagepermission: item.pagepermission
      });
    }
  };

  // 列表表头
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
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
            icon={<DeleteOutlined />}
            onClick={()=>confirmFunction(item)}
          />
          <Popover
            content={
              <div>
                <Switch checked={item.pagepermission} onChange={() => switchMethod(item)}/>
              </div>
            }
            title="侧边栏配置项"
            trigger="click"
            >
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={item.pagepermission===undefined}
            />
          </Popover>
        </div>
      }
    }
  ];

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        size='small'
        pagination={{
          pageSize: 8
        }}
      />;
    </div>
  )
}