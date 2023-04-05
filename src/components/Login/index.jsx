import { Row, Col, Card } from 'antd';
import Fader from '../Fader';
import Logo from './Logo';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';

function Login() {
  const location = useLocation();

  const [signup, setSignup] = useState(location.pathname === '/signup');

  const [forgot, setForgot] = useState(
    location.pathname === '/forgot-password'
  );

  const [reset, setReset] = useState(location.pathname === '/reset-password');

  return (
    <Row justify='center' align='middle' style={{ height: '100vh' }}>
      <Col span={24}>
        <Fader>
          <Card
            style={{
              width: '90%',
              maxWidth: 350,
              margin: '0 auto',
              marginTop: '-200px',
              padding: 20,
            }}
          >
            <Logo />
            {(!signup && !forgot && !reset && (
              <LoginForm setSignup={setSignup} setForgot={setForgot} />
            )) ||
              null}
            {(signup && <SignupForm setSignup={setSignup} />) || null}
            {(forgot && <ForgotPasswordForm setForgot={setForgot} />) || null}
            {(reset && <ResetPasswordForm setReset={setReset} />) || null}
          </Card>
        </Fader>
      </Col>
    </Row>
  );
}

export default Login;
