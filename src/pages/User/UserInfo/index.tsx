import {
  getLoginUserUsingGET,
  getUserVOByIdUsingGET,
  updateByProfileUserUsingPOST,
  updateMyInfoUsingPOST,
} from '@/services/sihaibi/UserController';
import { useModel } from '@@/exports';
import { CommentOutlined,
  FieldTimeOutlined,
  LoadingOutlined,
  PlusOutlined,
  UserOutlined,
  VerifiedOutlined,} from '@ant-design/icons';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { ProFormSelect } from '@ant-design/pro-form';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  message,
  Row,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import Modal from 'antd/es/modal/Modal';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import React, { useEffect, useState } from 'react';
import {selectAvatarUrl, selectGender} from "@/constants";
import moment from "moment";
import { getAiFrequencyUsingGET } from '@/services/sihaibi/aiFrequencyController';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const avatarStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'center',
};
const buttonStyle: React.CSSProperties = {
  marginLeft: '30px',
};

/**
 * 上传前校验
 * @param file 文件
 */
const beforeUpload = (file: RcFile) => {
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
  if (!isJpgOrPng) {
    message.error('仅允许上传 JPG/PNG 格式的文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('文件最大上传大小为 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const UserInfo: React.FC = () => {
  const [myUser, setMyUser] = useState({
    userName: '',
    userAccount: '',
    userAvatar: '',
    userPassword: '',
    userRole: 'user',
    gender: '',
    phone: '',
    email: '',
    userStatus: '0',
    userCode: '',
    createTime: '',
    updateTime: '',
  });
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getLoginUserUsingGET(); // 使用 getLoginUserUsingGET 发送请求
        // @ts-ignore
        setMyUser(res.data);
      } catch (error) {
        // 处理请求错误
        message.error('请求参数错误！');
      }
    }

    fetchData();
  }, []);

  //加...是创建一个新的对象把值赋给新对象，不会造成对象污染
  const [userId, setUserId] = useState<number>();
  const [number, setNumber] = useState<number>();
  const [data, setData] = useState<API.UserVO>({});
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const { initialState, setInitialState } = useModel('@@initialState');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [frequency, setFrequency] = useState<API.AiFrequencyVO>();

  const loadData = async () => {
    try {
      const res = await getAiFrequencyUsingGET();
      // console.log('用户次数', res.data);
      if (res.data) {
        setFrequency(res.data);
      }
    } catch (e: any) {
      message.error('获取数据失败' + e.error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };


  // 获取用户信息
  const getUserInfo = async (id: any) => {
    return getUserVOByIdUsingGET({ id }).then((res: any) => {
      console.log('编号', res.data);
      if (res.data) {
        setInitialState((s: any) => ({ ...s, loginUser: res.data }));
        setData(res.data);
        setImageUrl(res.data.userAvatar);
        setUserId(res.data.id);
      }
    });
  };

  useEffect(() => {
    try {
      loadData();
      getUserInfo(initialState?.currentUser?.id).then((r) => {});
      // console.log('用户信息', initialState?.currentUser);
    } catch (e: any) {
      console.log(e);
    }
  }, []);

  // 更新用户头像
  const updateUserAvatar = async (id: number, userAvatar: string) => {
    // 更新用户头像
    const res = await updateByProfileUserUsingPOST({
      id,
      userAvatar,
    });
    if (res.code !== 0) {
      message.success(`更新用户头像失败`);
    } else {
      getUserInfo(id);
    }
  };

  /**
   * 上传图片
   * @param info
   */
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    console.log('上传状态', info.file.status);
    if (info.file.status === 'done') {
      if (info.file.response.code === 0) {
        message.success(`上传成功`);
        const id = initialState?.currentUser?.id as number;
        const userAvatar = info.file.response.data;
        console.log('头像url', info.file);
        setLoading(false);
        setImageUrl(userAvatar);
        updateUserAvatar(id, userAvatar);
      }
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Descriptions style={{ margin: '50px' }}>
        <Row>
            <Col span={8}>
              <Card title="个人信息" bordered={false}>
                <Row>
                  <Col style={avatarStyle}>
                    <Upload
                      name="file"
                      listType="picture-circle"
                      showUploadList={false}
                      action="http://sihai59.cn:8080/api/oss/upload"
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      {imageUrl ? (
                        <img
                          src={data?.userAvatar}
                          alt="avatar"
                          style={{width: '100%', borderRadius: '50%'}}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </Col>
                </Row>
                <Divider/>
                <Row>
                  <Col>
                    <UserOutlined/> 用户名称：{data?.userName}
                  </Col>
                </Row>
                <Divider/>
                <Row>
                  <Col>
                    <VerifiedOutlined/> 用户角色：{myUser.userRole}
                  </Col>
                </Row>
                <Divider/>
                <Row>
                  <Col>
                    <VerifiedOutlined/> 用户性别：{myUser.gender}
                  </Col>
                </Row>
                <Divider/>
                <Row>
                  <Col>
                    <VerifiedOutlined/> 手机号码：{myUser.phone}
                  </Col>
                </Row>
                <Divider/>
                  <Row>
                      <Col>
                          <VerifiedOutlined/>已使用： {frequency?.totalFrequency}次
                      </Col>
                  </Row>
                <Divider/>
                  <Row>
                      <Col>
                          <VerifiedOutlined/>剩余： {frequency?.remainFrequency}次
                      </Col>
                  </Row>
                <Divider/>
                <Row>
                  <Col>
                    <FieldTimeOutlined/> 注册时间：{moment(myUser.createTime).format("YYYY-MM-DD")}
                  </Col>
                </Row>
              </Card>
            </Col>
        </Row>
      </Descriptions>


      <ModalForm<API.UserUpdateMyRequest>
        title="修改我的信息"
        trigger={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              type="primary"
              shape="round"
              size="large"
              block
              style={{ margin: '50px', width: '250px' }}
            >
              修改个人信息
            </Button>
          </div>
        }
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          await waitTime(1000);
          //点击发起请求
          const isModify = await updateMyInfoUsingPOST(values);
          if (isModify) {
            message.success('修改成功！');
            // 刷新用户信息表单
            location.reload();
            return true;
          } else {
            message.error('修改失败！');
          }
          return false;
        }}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="userName"
            label="昵称"
            placeholder="请输入昵称"
            initialValue={myUser.userName}
            rules={[
              {
                required: true,
                message: '请输入昵称!',
              },
            ]}
          />
          <ProFormText
            width="md"
            name="userAccount"
            label="账号名称"
            initialValue={myUser.userAccount}
            disabled
          />
          <ProFormText
            width="md"
            name="id"
            label="用户编号"
            placeholder="修改修改后的密码"
            initialValue={userId}
            disabled
          />
          <ProFormText
            width="md"
            name="userPassword"
            label="修改密码"
            placeholder="修改修改后的密码"
            initialValue={myUser.userPassword}
            rules={[
              {
                required: true,
                message: '请输入选择用户头像!',
              },
            ]}
          />
          <ProFormText
            width="md"
            name="phone"
            label="修改手机号码"
            placeholder="修改手机号码密码"
            initialValue={myUser.phone}
          />
          <ProFormSelect
            width="md"
            name="gender"
            label="修改性别"
            placeholder="修改我的性别"
            options={selectGender}
            initialValue={myUser.gender}
          />
          <ProFormText
            width="md"
            name="email"
            label="修改邮箱"
            placeholder="修改修改后的邮箱"
            initialValue={myUser.email}
          />
          <ProFormSelect
            name="userAvatar"
            fieldProps={{
              size: 'large',
            }}
            label="修改头像"
            options={selectAvatarUrl}
            placeholder={'请选择用户头像 '}
            initialValue={myUser.userAvatar}
            rules={[
              {
                required: true,
                message: '请输入选择用户头像!',
              },
            ]}
          />
        </ProForm.Group>
      </ModalForm>
    </>
  );
};

export default UserInfo;
