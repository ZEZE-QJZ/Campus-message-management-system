import { Form, Input, Modal, Table } from "antd";
import Button from "antd/lib/button";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DeleteOutlined } from '@ant-design/icons';

export default function NewsCategory() {
  const [ dataSource, setDataSource ] = useState();
  useEffect(() => {
    axios.get('/categories').then(res => {
      setDataSource(res.data);
    });
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "栏目名称",
      dataIndex: "title",
      onCell: (record) => {
        return {
          record,
          editable: "true",
          title: "栏目名称",
          dataIndex: "title",
          handleSave,
        }
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <Button
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => confirmFunction(item)}
          />
        )
      }
    },
  ]

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
    axios.delete(`/categories/${item.id}`);
  };

  // 可编辑行操作
  const handleSave = (record) => {
    setDataSource(dataSource.map(item => {
      if(item.id == record.id) {
        return {
          id: record.id,
          value: record.title,
          title: record.title,
        };
      }else {
        return {
          ...item
        }
      };
    }));
    axios.patch(`/categories/${record.id}`, {
      title: record.title,
      value: record.valid
    })
  };
  const EditableContext = React.createContext(null);
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <div>
      <Table
        components={components}
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