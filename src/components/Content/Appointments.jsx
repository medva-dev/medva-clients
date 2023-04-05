import { Card, Col, Empty, Row, Spin } from 'antd';
import Fader from '../Fader';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';
import Link from 'antd/es/typography/Link';
import { useSelector } from 'react-redux';
import { selectSession } from '../../redux/slices/user';
import { useEffect } from 'react';
import useRequest from '../../hooks/useRequest';
import { getAppointments } from '../../services/supabase';
import AppointmentCard from './AppointmentCard';
import { request } from '../../services/api';

export default function Appointments() {
  const session = useSelector(selectSession);

  const { loading, fetch, data } = useRequest(request);

  useEffect(() => {
    fetch({ path: 'bookings/list' });
  }, []);

  if (!session) {
    window.location.href = '/login';
  }

  return (
    <Fader>
      <Row
        style={{
          width: '100%',
          margin: 'auto',
          maxWidth: 1400,
          padding: 10,
          paddingLeft: 15,
        }}
        gutter={[24, 24]}
      >
        <Col span={24}>
          <Fader>
            <Row>
              <Col xs={24} sm={24} md={24} align='center'>
                <Title level={2}>Your appointments</Title>
                <Text>
                  Here you'll find all of your appointments. You can modify them
                  according to your preferences
                </Text>
              </Col>
            </Row>
          </Fader>
        </Col>
        <Col span={24} align='center' style={{ marginTop: 20 }}>
          {loading && <Spin size='large' />}
          {(!loading && (!Array.isArray(data) || data?.length < 1) && (
            <Card>
              <Empty
                description={
                  <>
                    <Text>You do not have any appointments yet</Text>
                    <br />
                    <Link href='/'>Click here to find virtual assistants</Link>
                  </>
                }
              />
            </Card>
          )) || (
              <Row gutter={[24, 24]} align='middle' justify='center'>
                {data?.length > 0 &&
                  data.map((d) => <AppointmentCard {...(d || {})} />)}
              </Row>
            ) ||
            null}
        </Col>
      </Row>
    </Fader>
  );
}
