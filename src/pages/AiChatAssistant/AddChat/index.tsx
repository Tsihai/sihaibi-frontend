import {Button, Card, Col, Divider, Form, FormInstance, message, Row, Select, Space, Spin, Upload} from 'antd';
import React, {useState} from 'react';

import {UploadOutlined} from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import {ProForm} from "@ant-design/pro-form";
import useForm = ProForm.useForm;
import {history} from "@@/core/history";
import {aiAssistantUsingPOST} from "@/services/sihaibi/AiAssistantController";

const AddChat: React.FC = () => {
  const [form] = useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * 提交表单
   * @param values
   */
  const onFinish = async (values: any) => {
    console.log(values)
    // 避免重复提交
    if (submitting) {
      return;
    }
    // 开始提交
    setSubmitting(true);

    try {
      const res = await aiAssistantUsingPOST(values);
      if (!res?.data) {
        message.error('操作失败' );
      } else {
        message.success('对话添加成功，请稍后到 AI解答 界面查看结果');
        form.resetFields();
      }
    } catch (e: any) {
      message.error('对话失败,' + e.message);
    }
    // 提交完成
    setSubmitting(false);
  };

  return (
    <div className="add-chat">
      <Card>
        <Divider style={{fontWeight: 'bold', color: 'blue'}}>AI 助手</Divider>
        <Form
          form={form}
          name="addChat"
          labelCol={{span: 4}}
          wrapperCol={{span: 18}}
          onFinish={onFinish}
          initialValues={{}}
        >
          <Form.Item
            name="questionGoal"
            label="你的问题"
            rules={[{required: true, message: '请输入问题概述'}]}
          >
            <TextArea placeholder="请输入你的需求"/>
          </Form.Item>


          <Form.Item wrapperCol={{span: 16, offset: 4}} style={{textAlign:"center"}}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={submitting}
              >
                上传提问
              </Button>
              <Button htmlType="reset">重置内容</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddChat;
