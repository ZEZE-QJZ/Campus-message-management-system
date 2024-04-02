import { Form, Input, Select } from "antd";
import React, { forwardRef, useEffect, useState } from "react";

const UserForm = forwardRef((props, ref) => {
  // 控制组件禁用
  const [ isDisabled, setIsDisabled ] = useState(false);
  // 点击编辑按钮更新条目时控制组件禁用
  useEffect(() => {
    setIsDisabled(props.isUpdateDisabled)
  }, [props.isUpdateDisabled])


  const { roleId, region } = JSON.parse(localStorage.getItem('token'))
  // 区域菜单栏权限设置
  const regionList = props.regionList.map(item => {
    return {
      ...item,
      disabled: props.isUpdate ? ( roleId == 1 ? false : true )
      : ( roleId == 1 ? false : item.value != region )
    }
  });
  // 角色菜单栏权限设置
  const roleList = props.roleList.map(item => {
    return {
      ...item,
      disabled: roleId == 1 ? true : ( roleId >= item.value)
    }
  });

  // 表单组件
  return (
    <Form
      ref={ref}
      layout="vertical"
      name="form_in_modal">
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: '请设置用户名！',
          },
        ]}
      >
        <Input placeholder="请设置用户名"/>
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: '请设置密码！',
          },
        ]}
      >
        <Input placeholder="请设置密码"/>
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={isDisabled ? [] : [
          {
            required: true,
            message: '请设置区域！',
          },
        ]}
      >
        <Select
          showSearch
          allowClear
          placeholder="请选择区域"
          optionFilterProp="children"
          options={regionList}
        />
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: '请设置角色！',
          },
        ]}
      >
        <Select
          showSearch
          allowClear
          placeholder="请选择角色"
          options={roleList}
          onChange={(value) => {
            if(value == 1) {
              setIsDisabled(true);
              ref.current.setFieldsValue({
                region: "",
              });
            }else
              setIsDisabled(false);
          }}
        />
      </Form.Item>
    </Form>
  );
})
export default UserForm