import { Card, Col, Row, Space, Spin } from 'antd';
import Logo from '../Login/Logo';
import useRequest from '../../hooks/useRequest';
import { request } from '../../services/api';
import { useEffect } from 'react';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSession } from '../../redux/slices/user';

export default function EmailConfirmation() {
  const dispatch = useDispatch();
  const { hash } = useLocation();
  const navigate = useNavigate();

  const { fetch, ErrorMessageAlert } = useRequest(request, {
    alertIcon: false,
  });

  useEffect(() => {
    if (!hash) {
      navigate('/');
    }

    const { timeZone: timezone } = Intl.DateTimeFormat().resolvedOptions();

    fetch({
      path: 'public/google-login-verify',
      data: { hash, timezone },
    }).then((result) => {
      if (result?.session) {
        const { session = {} } = result;
        const { user = {} } = session;
        dispatch(
          setSession({ ...session, ...user, name: user?.user_metadata?.name })
        );
        navigate('/');
      }
    });
  }, [hash]);

  return (
    <Row align='middle' justify='center' style={{ marginTop: 50 }}>
      <Col span={24} align='center'>
        <Card style={{ maxWidth: 350 }}>
          <Logo />
          <br />
          <Space direction='vertical'>
            {<Spin size='large' />}
            {ErrorMessageAlert}
          </Space>
        </Card>
      </Col>
    </Row>
  );
}
