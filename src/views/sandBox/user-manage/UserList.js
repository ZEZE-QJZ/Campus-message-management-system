import { Button, Modal, Switch, Table } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import UserForm from "../../../components/user-manage/UserForm";

export default function UserList() {
  const { roleId, region, id } = JSON.parse(localStorage.getItem('token'))

  const [ dataSource, setDataSource ] = useState();
  useEffect(() => {
    axios.get('/users?_expand=role').then(res => {
      setDataSource(res.data?.filter(item =>
        item.roleId >= roleId && (region == '' || item.region == region)
      ));
    });
  }, [])

  const [ roleList, setRoleList ] = useState([]);
  useEffect(() => {
    axios.get('/roles').then(res => {
      setRoleList(res.data.map(item => {
        return {
          value: item.id,
          label: item.roleName,
          item: item,
        }
      }));
    });
  }, [])

  const [ regionList, setRegionList ] = useState([]);
  useEffect(() => {
    axios.get('/regions').then(res => {
      setRegionList(res.data.map(item => {
        return {
          value: item.title,
          label: item.title,
          id: item.id,
        }
      }));
    });
  }, [])

  const [ openAdd, setOpenAdd ] = useState(false);
  const addForm = useRef(null);

  const [ openUpdate, setOpenUpdate ] = useState(false);
  const [ isUpdateDisabled, setIsUpdateDisabled ] = useState(false);
  const [ updateItem, setUpdateItem ] = useState([]);
  const updateForm = useRef(null);

  const columns = [
    {
      title: '范围',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => {
          return {
            text: item.value,
            value: item.value
          }
        }),
        {
          text: '全球',
          value: '全球'
        }
      ],
      onFilter: (value, item) => {
        if(value == '全球') {
          return item.region == '';
        }else return item.region == value;
      },
      render: (region) => {
        return <span>{region === '' ? '全球' : region}</span>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleId',
      render: (roleId, item) => {
        return <span>{item.role.roleName}</span>
        // return <span>{roleId}</span>
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch disabled={item.default} checked={roleState} onChange={() => switchMethod(item)}/>
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
            // 默认不可删除以及登陆者不能删除自己
            disabled={id == item.id || item.default}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => openUpdateModal(item)}
            disabled={item.default}
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
    axios.delete(`/users/${item.id}`);
  };
  const switchMethod = (item) => {
    item.roleState = !item.roleState
    setDataSource([...dataSource]);
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    });
  };

  // 添加用户确认函数
  const onOkAdd = () => {
    // 获取表单的值
    addForm.current.validateFields().then(value => {
      setOpenAdd(false);
      axios.post(`/users`, {
        ...value,
        "default": false,
        "roleState": true,
      }).then(res => {
        setDataSource([...dataSource, {
          ...res.data,
          role: roleList[res.data.roleId - 1].item,
        }]);
      });
    }).catch(err => {
      console.log(err);
    });
  }

  // 编辑用户打开对话框函数
  const openUpdateModal = (item) => {
    setOpenUpdate(true);
    setUpdateItem(item)
    if(item.roleId == 1) {
      setIsUpdateDisabled(true);
    }else {
      setIsUpdateDisabled(false);
    };
    setTimeout(() => {
      updateForm.current.setFieldsValue(item);
    }, 100)
  };
  // 编辑用户更新函数
  const onOkUpdate = () => {
    updateForm.current.validateFields().then(value => {
      setOpenUpdate(false);
      axios.patch(`/users/${updateItem.id}`, {
        ...value,
      }).then(res => {
        setDataSource(dataSource.map(item => {
          if(item.id === res.data.id) {
            return {
              ...res.data,
              role: roleList[res.data.roleId - 1].item
            };
          };
          return item;
        }));
      });
    }).catch(err => {
      console.log(err);
    });
  };

  return (
    <div>
      <Button type="primary" onClick={() => setOpenAdd(true)}>添加用户</Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={item=>item.id}
        size='small'
        pagination={{
          pageSize: 8
        }}
      />

      {/* 新建弹窗 */}
      <Modal
        open={openAdd}
        title="添加新用户"
        okText="新建"
        cancelText="取消"
        okButtonProps={{
          autoFocus: true,
        }}
        destroyOnClose
        onOk={onOkAdd}
        onCancel={() => setOpenAdd(false)}
      >
        <UserForm ref={addForm} regionList={regionList} roleList={roleList} />
      </Modal>

      {/* 更新弹窗 */}
      <Modal
        open={openUpdate}
        title="添加新用户"
        okText="更新"
        cancelText="取消"
        okButtonProps={{
          autoFocus: true,
        }}
        destroyOnClose
        onOk={onOkUpdate}
        onCancel={() => setOpenUpdate(false)}
      >
        <UserForm
          ref={updateForm}
          regionList={regionList}
          roleList={roleList}
          isUpdateDisabled={isUpdateDisabled}
          isUpdate={true}
          />
      </Modal>
    </div>
  )
}