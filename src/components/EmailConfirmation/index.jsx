import { Card, Col, Row, Space, Spin } from 'antd';
import Logo from '../Login/Logo';
import useRequest from '../../hooks/useRequest';
import { request } from '../../services/api';
import { useEffect } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

export default function EmailConfirmation() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const { loading, fetch, ErrorMessageAlert, SuccessMessageAlert } = useRequest(
    request,
    { alertIcon: false }
  );

  useEffect(() => {
    const id = params.get('id');
    const token = params.get('token');
    fetch({ path: 'public/confirm-email', data: { id, token } }).then(
      (result) => {
        const { email } = result ?? {};
        if (email) {
          // redirect to login
          setTimeout(() => {
            navigate({
              pathname: '/login',
              search: createSearchParams({
                email,
              }).toString(),
            });
          }, 3000);
        }
      }
    );
  }, [params]);

  return (
    <Row align='middle' justify='center' style={{ marginTop: 50 }}>
      <Col span={24} align='center'>
        <Card style={{ maxWidth: 350 }}>
          <Logo />
          <br />
          <Space direction='vertical'>
            {(loading && <Spin size='large' />) || null}
            {ErrorMessageAlert}
            {SuccessMessageAlert}
          </Space>
        </Card>
      </Col>
    </Row>
  );
}
