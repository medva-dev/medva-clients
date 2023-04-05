import { Button, Card, Col, Row, Space, Table } from 'antd';
import Fader from '../Fader';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';
import { useSelector } from 'react-redux';
import { selectSession } from '../../redux/slices/user';
import Refer from '../../assets/images/refer.svg';
import { useState } from 'react';
import { CheckCircleFilled } from '@ant-design/icons';
import ReferralTable from './ReferralTable';

const generateLink = (clientId = '') => {
  const link = new URL(window.location.origin);
  link.searchParams.append('ref', clientId);

  return link.href;
};

export default function Referral() {
  const session = useSelector(selectSession);
  const [copied, setCopied] = useState(false);

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
                <Space direction='vertical'>
                  <Title level={2}>Refer a colleague</Title>
                  <Text>
                    Refer a colleague and earn up to <b>$500</b> per lead when
                    they sign up with us.
                  </Text>
                  <img
                    alt='Refer a colleague'
                    src={Refer}
                    style={{
                      height: '200px',
                      maxWidth: '80%',
                      margin: 'auto',
                      marginTop: 20,
                    }}
                  />
                </Space>
              </Col>
            </Row>
          </Fader>
        </Col>
        <Col span={24} align='center' style={{ marginTop: 20 }}>
          <Card
            title='Your affiliate link'
            style={{
              maxWidth: 600,
              width: '100%',
              backgroundColor: 'rgba(40,56,146,0.05)',
            }}
            extra={
              <div style={{ position: 'absolute', right: 15, top: 12 }}>
                {(copied && (
                  <Fader>
                    <Space size={2}>
                      <CheckCircleFilled
                        style={{ marginTop: 5, color: '#293893' }}
                      />{' '}
                      <Text style={{ color: '#293893' }}>Copied</Text>
                    </Space>
                  </Fader>
                )) || (
                  <Button
                    type='link'
                    onClick={() => {
                      navigator.clipboard.writeText(generateLink(session.id));
                      setCopied(true);
                      setTimeout(() => {
                        setCopied(false);
                      }, 3000);
                    }}
                  >
                    Copy
                  </Button>
                )}
              </div>
            }
          >
            <Text style={{ color: '#537FE7' }}>
              <a href={generateLink(session.id)}>{generateLink(session.id)}</a>
            </Text>
          </Card>
        </Col>
        <Col span={24}>
          <Title level={4} align='center'>
            List of referred clients
          </Title>
          <div align='center'>
            <ReferralTable />
          </div>
        </Col>
      </Row>
    </Fader>
  );
}
