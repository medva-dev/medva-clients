import { useEffect } from 'react';
import { Row, Col, Form, Input, Button, Typography } from 'antd';
import { TbMail } from 'react-icons/tb';
import Fader from '../Fader';
import useRequest from '../../hooks/useRequest';

import { request } from '../../services/api';

const { Title } = Typography;

export default function ForgotPasswordForm({ setForgot = () => {} }) {
  const [form] = Form.useForm();

  const { loading, fetch, ErrorMessageAlert, SuccessMessageAlert } = useRequest(
    request,
    { alertStyle: { marginBottom: 20 } }
  );

  const onFinish = async (values = {}) => {
    const response = await fetch({
      path: 'public/send-password-reset-link',
      data: values,
    });
    if (response.successMessage) {
      form.resetFields();
    }
  };

  useEffect(() => {
    window.history.pushState({}, null, '/forgot-password');
  }, []);

  return (
    <Form
      form={form}
      wrapperCol={{ span: 24 }}
      initialValues={{}}
      autoComplete='off'
      onFinish={onFinish}
    >
      <Fader>
        <Row align='middle' justify='center' style={{ padding: 10 }}>
          <Col>
            <Title level={5}>Forgot password</Title>
          </Col>
        </Row>
        <Form.Item
          name='email'
          rules={[
            {
              required: true,
              message: 'Please enter your email address!',
            },
          ]}
        >
          <Input
            type='email'
            prefix={<TbMail style={{ color: 'rgb(0,0,0,0.5)' }} />}
            placeholder='Your email address'
          />
        </Form.Item>

        <Row gutter={[12, 12]} style={{ marginBottom: 5 }}>
          <Col flex='auto'>
            {ErrorMessageAlert}
            {SuccessMessageAlert}
          </Col>
        </Row>
        <Form.Item>
          <Button type='primary' htmlType='submit' block loading={loading}>
            Send password reset link
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type='link'
            style={{ padding: 0 }}
            onClick={() => setForgot(false)}
            block
          >
            Go back to login page
          </Button>
        </Form.Item>
      </Fader>
    </Form>
  );
}
