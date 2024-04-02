import { Button, Card, Form, Input, message, notification, Select, Steps } from "antd";
import { PageHeader } from '@ant-design/pro-layout';
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { SmileOutlined } from '@ant-design/icons';
import style from './News.module.css';
import axios from "axios";
import NewsEditor from "../../../components/news-manage/NewsEditor";

export default function NewsAdd() {
  const navigate = useNavigate();
  const [ current, setCurrent ] = useState(0);
  const [ categoryList, setCategoryList ] = useState([]);
  const [ formInfo, setFormInfo ] = useState([]);
  const [ content, setContent ] = useState("");
  const NewsForm = useRef(null);
  const User = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    axios.get('/categories ').then(res => {
      console.log(res.data);
      setCategoryList(res.data.map(item => {
        return {
          label: item.title,
          value: item.id
        }
      }));
    });
  }, [])

  // 下一步 && 上一步
  const handleNext = () => {
    if(current == 0) {
      NewsForm.current.validateFields().then(value => {
        setCurrent(current + 1);
        setFormInfo(value);
      }).catch(err => {
        console.log(err);
      });
    }else {
      if(content == '' || content.trim() == '<p></p>') {
        message.error('新闻内容不能为空');
      }else {
        setCurrent(current + 1);
        // console.log(content, formInfo);
      }
    }
  };
  const handlePrevious = () => {
    setCurrent(current - 1)
  };

  // 提交审核1 保存草稿箱0
  const handleSave = (auditState) => {
    axios.post('/news', {
      ...formInfo,
      "author": User.username,
      "region": User.region ? User.region : '全球',
      "roleId": User.roleId,
      "auditState": auditState,
      "publishState": 0,
      "content": content,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      // "publishTime": 0
    }).then(res => {
      navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list');
      notification.open({
        message: `通知`,
        description: `您可以到${auditState ? '审核列表' : '草稿箱'}中查看您的新闻`,
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
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <PageHeader
        style={{marginBottom: '20px'}}
        title="撰写新闻"
        subTitle=""
      />
      <Steps
        style={{marginBottom: '20px'}}
        current={current}
        items={[
          {
            title: '基本信息',
            description: '新闻标题新闻分类',
          },
          {
            title: '新闻内容',
            description: '新闻主体内容',
          },
          {
            title: '新闻提交',
            description: '保存草稿或者提交审核',
          },
        ]}
      />

      <Card
        style={{ width: '100%', marginBottom: '20px' }}
        className={current!==2 ? '' : style.active}
      >
        <div className={current===0 ? '' : style.active}>
          <Form
            ref={NewsForm}
            layout="vertical"
            name="form_in_modal"
          >
            <Form.Item
              name="title"
              label="新闻标题"
              rules={[
                {
                  required: true,
                  message: '请设置用户名！',
                },
              ]}
            >
              <Input placeholder="请设置新闻标题"/>
            </Form.Item>
            <Form.Item
              name="categoryId"
              label="新闻分类"
              rules={[
                {
                  required: true,
                  message: '请选择新闻分类！',
                },
              ]}
            >
              <Select
                showSearch
                allowClear
                placeholder="请选择角色"
                options={categoryList}
              />
            </Form.Item>
          </Form>
        </div>
        <div className={current===1 ? '' : style.active}>
          <NewsEditor getContent={(value) => {
            setContent(value);
          }}></NewsEditor>
        </div>
      </Card>

      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div>
          {
            current > 0 &&
            <Button style={{ marginRight: '10px' }} onClick={handlePrevious}>上一步</Button>
          }
          {
            current < 2 &&
            <Button onClick={handleNext}>下一步</Button>
          }
        </div>
        {
          current == 2 &&
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Button
              style={{ marginRight: '10px' }}
              type="primary"
              onClick={() => handleSave(0)}
            >保存草稿箱</Button>
            <Button
              danger
              type="primary"
              onClick={() => handleSave(1)}
            >提交审核</Button>
          </div>
        }
      </div>
    </div>
  )
}