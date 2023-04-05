import { Col, Row, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { logout } from '../services/supabase';
import { useEffect } from 'react';
import { setSession } from '../redux/slices/user';

export default function Logout() {
  const dispatch = useDispatch();
  const logoutNow = async () => {
    await logout();
    dispatch(setSession(null));
    window.location.href = '/';
  };
  useEffect(() => {
    logoutNow();
  }, []);

  return (
    <Row align={'middle'} justify={'center'} style={{ marginTop: 200 }}>
      <Col>
        <Spin size='large' />
      </Col>
    </Row>
  );
}
