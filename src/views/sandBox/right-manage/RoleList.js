import { Button, Modal, Table, Tree } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function RoleList() {
  const [ dataSource, setDataSource ] = useState([]);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      render: (id) => {
        return <b>{id}</b>
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
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={()=>{
              setIsModalVisible(true);
              setCurentRights(item.rights);
              setCurrentId(item.id)
            }}
          />
        </div>
      }
    },
  ];
  useEffect(() => {
    axios.get('/roles').then(res => {
      // console.log(res.data);
      setDataSource(res.data);
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
      setDataSource(dataSource.filter(data => data.id !== item.id));
      axios.delete(`/roles/${item.id}`);
  };

  // 编辑操作弹出框
  const [ rightList, setRightList ] = useState([]);
  const [ curentRights, setCurentRights ] = useState([]);
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const [ currentId, setCurrentId ] = useState(0);
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      // console.log(res.data);
      setRightList(res.data);
    });
  }, [])
  const handleOk = () => {
    // console.log(curentRights);
    setDataSource(dataSource.map(item => {
      if(item.id==currentId) {
        return {
          ...item,
          rights: curentRights
        }
      };
      return item
    }));
    setIsModalVisible(false);
    axios.patch(`/roles/${currentId}`, {
      rights: curentRights
    });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onCheck = (checkedKeys) => {
    setCurentRights(checkedKeys);
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
      <Modal
        title="权限分配"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          checkedKeys={curentRights}
          treeData={rightList}
          onCheck={onCheck}
        />
      </Modal>
    </div>
  )
}