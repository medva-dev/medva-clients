import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form, Input, Button, Typography } from 'antd';
import { TbKey, TbMail, TbUser } from 'react-icons/tb';
import Fader from '../Fader';
import useRequest from '../../hooks/useRequest';
import { setSession } from '../../redux/slices/user';

import { request } from '../../services/api';

const { Title, Text } = Typography;

export default function SignupForm({ setSignup = () => {} }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const { loading, fetch, ErrorMessageAlert, SuccessMessageAlert } = useRequest(
    request,
    { alertStyle: { marginBottom: 20 } }
  );

  const {
    loading: fetchingGoogleUrl,
    fetch: fetchGoogleUrl,
    ErrorMessageAlert: GoogleErrorMessageAlert,
  } = useRequest(request, { alertStyle: { marginBottom: 10 } });

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

    const { timeZone: timezone } = Intl.DateTimeFormat().resolvedOptions();
    Object.assign(values, { timezone });

    const response = await fetch({ path: 'public/signup', data: values });
    if (response.successMessage) {
      form.resetFields();
    }
  };

  const checkSession = async () => {
    try {
      const session = JSON.parse(localStorage.getItem('session') || '');
      const { user } = session ?? {};
      if (session && user) {
        dispatch(
          setSession({ ...session, ...user, name: user?.user_metadata?.name })
        );
        navigate('/');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const googleLogin = async () => {
    const response = await fetchGoogleUrl({ path: 'public/google-login' });
    if (response.url) {
      window.location.href = response.url;
    }
  };

  useEffect(() => {
    window.history.pushState({}, null, '/signup');
    void checkSession();
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
            <Title level={5}>Create a MedVA account</Title>
          </Col>
        </Row>
        <Form.Item
          name='name'
          rules={[
            {
              required: true,
              message: 'Please enter your name!',
            },
          ]}
        >
          <Input
            prefix={<TbUser style={{ color: 'rgb(0,0,0,0.5)' }} />}
            placeholder='Your name'
          />
        </Form.Item>
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
            {GoogleErrorMessageAlert}
          </Col>
        </Row>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            block
            loading={loading}
            disabled={fetchingGoogleUrl}
          >
            Create account
          </Button>
        </Form.Item>
        <Form.Item style={{ marginTop: -10 }}>
          <Button
            type='primary'
            ghost
            block
            onClick={() => googleLogin()}
            loading={fetchingGoogleUrl}
          >
            Sign up using Google
          </Button>
        </Form.Item>
        <Form.Item>
          <Text>
            Already have an account?{' '}
            <Button
              type='link'
              style={{ padding: 0 }}
              onClick={() => setSignup(false)}
            >
              Log in here
            </Button>
          </Text>
        </Form.Item>
      </Fader>
    </Form>
  );
}
