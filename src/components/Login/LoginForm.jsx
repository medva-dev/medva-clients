import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Row, Col, Form, Input, Button, Typography, Alert, Space } from 'antd';
import { TbKey, TbMail } from 'react-icons/tb';
import Fader from '../Fader';
import useRequest from '../../hooks/useRequest';
import { setSession } from '../../redux/slices/user';
import { selectBookModal } from '../../redux/slices/selections';
import { request } from '../../services/api';

const { Title, Text } = Typography;

export default function LoginForm({
  setSignup = () => {},
  setForgot = () => {},
}) {
  const passwordInputRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const book = useSelector(selectBookModal);

  const [form] = Form.useForm();
  const { loading, fetch, ErrorMessageAlert, SuccessMessageAlert } = useRequest(
    request,
    { alertStyle: { marginBottom: 10 } }
  );

  const {
    loading: fetchingGoogleUrl,
    fetch: fetchGoogleUrl,
    ErrorMessageAlert: GoogleErrorMessageAlert,
  } = useRequest(request, { alertStyle: { marginBottom: 10 } });

  const onFinish = async (values) => {
    const { timeZone: timezone } = Intl.DateTimeFormat().resolvedOptions();
    Object.assign(values, { timezone });

    const response = await fetch({ path: 'public/login', data: values });
    const { session, user } = response ?? {};

    if (session && user) {
      dispatch(
        setSession({ ...session, ...user, name: user?.user_metadata?.name })
      );
      navigate('/');
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
    const email = params.get('email');
    window.history.pushState({}, null, '/login');
    if (email) {
      form.setFieldValue('email', email);
      setTimeout(() => {
        passwordInputRef?.current?.focus?.();
      }, 500);
    }
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
            <Title level={5}>Log in to your account</Title>
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
            ref={passwordInputRef}
          />
        </Form.Item>

        {(book?.id > 0 && (
          <Row align='middle' justify='center' style={{ marginBottom: 10 }}>
            <Col span={24}>
              <Alert
                type='warning'
                message='To view more details about our virtual assistants, please login / signup first'
              />
            </Col>
          </Row>
        )) ||
          null}

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
            Log in
          </Button>
        </Form.Item>
        <Form.Item style={{ marginTop: -10 }}>
          <Button
            type='primary'
            ghost
            block
            onClick={googleLogin}
            loading={fetchingGoogleUrl}
          >
            Log in using Google
          </Button>
        </Form.Item>
        <Form.Item>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>
              Don't have an account?{' '}
              <Button
                type='link'
                style={{ padding: 0 }}
                onClick={() => setSignup(true)}
              >
                Sign up here
              </Button>
            </Text>
            <Button block type='link' onClick={() => setForgot(true)}>
              Forgot password?
            </Button>
          </Space>
        </Form.Item>
      </Fader>
    </Form>
  );
}
