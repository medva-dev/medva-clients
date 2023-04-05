import { useEffect, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Row, Col, Form, Input, Button, Typography } from 'antd';
import { TbKey } from 'react-icons/tb';
import Fader from '../Fader';
import useRequest from '../../hooks/useRequest';

import { request } from '../../services/api';

const { Title } = Typography;

export default function ResetPasswordForm({ setReset = () => {} }) {
  const navigate = useNavigate();

  const [info, setInfo] = useState({
    id: undefined,
    token: undefined,
  });

  const [form] = Form.useForm();

  const { loading, fetch, ErrorMessageAlert, SuccessMessageAlert } = useRequest(
    request,
    { alertStyle: { marginBottom: 20 } }
  );

  const onFinish = async (values = {}) => {
    if (values?.password !== values?.passwordConfirmation) {
      return form.setFields([
        {
          name: 'passwordConfirmation',
          value: values.passwordConfirmation,
          errors: ['Passsword confirmation did not match'],
        },
      ]);
    }

    const response = await fetch({
      path: 'public/reset-password',
      data: { ...values, ...info },
    });

    if (response.email) {
      form.resetFields();
      navigate({
        pathname: '/login',
        search: createSearchParams({
          email: response.email,
        }).toString(),
      });
      setTimeout(() => {
        setReset(false);
      }, 3000);
    }
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    const token = urlParams.get('token');

    if (!id || !token) {
      navigate('/');
      return;
    }

    setInfo({ id, token });
    window.history.pushState({}, null, '/reset-password');
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
            <Title level={5}>Reset password</Title>
          </Col>
        </Row>
        <Form.Item
          name='password'
          rules={[
            { required: true, message: 'Please enter your password!' },
            { min: 6, message: 'Must be at least 6 characters' },
            { max: 20, message: 'Must be at less than 20 characters' },
          ]}
        >
          <Input.Password
            prefix={<TbKey style={{ color: 'rgb(0,0,0,0.5)' }} />}
            placeholder='Your password'
            type='password'
          />
        </Form.Item>

        <Form.Item
          name='passwordConfirmation'
          rules={[
            { required: true, message: 'Please re-enter your password!' },
            { min: 6, message: 'Must be at least 6 characters' },
            { max: 20, message: 'Must be at less than 20 characters' },
          ]}
        >
          <Input.Password
            prefix={<TbKey style={{ color: 'rgb(0,0,0,0.5)' }} />}
            placeholder='Re-enter your password'
            type='password'
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
            Reset password
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type='link'
            style={{ padding: 0 }}
            onClick={() => setReset(false)}
            block
          >
            Go back to login page
          </Button>
        </Form.Item>
      </Fader>
    </Form>
  );
}
