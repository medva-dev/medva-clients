import { Avatar, Button, Card, Col, Row, Space } from 'antd';
import Fader from '../Fader';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';
import { useDispatch } from 'react-redux';
import SupportIcon from '../../assets/images/support.svg';
import LiveChat from '../../assets/images/chat.svg';

import { setShow } from '../../redux/slices/messages';

export default function Support() {
  const dispatch = useDispatch();

  const showChat = () => {
    window.stopClosing = true;
    dispatch(setShow(true));
    setTimeout(() => {
      window.stopClosing = undefined;
    }, 1000);
  };

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
                  <Title level={2}>Get the help you need</Title>
                  <Text>
                    Our team of experts is always available to provide quality
                    assistance and answer all your questions.
                  </Text>
                  <img
                    alt=''
                    src={SupportIcon}
                    style={{
                      height: '200px',
                      maxWidth: '80%',
                      margin: 'auto',
                      marginTop: 30,
                    }}
                  />
                </Space>
              </Col>
            </Row>
          </Fader>
        </Col>
        <Col span={24} align='center' style={{ marginTop: 20 }}>
          <Row gutter={[12, 12]} style={{ maxWidth: 800 }}>
            <Col xs={24} sm={24} md={24} lg={12}>
              <Card title='Personal Relationship Manager'>
                <Space direction='vertical'>
                  <Avatar size={50} />
                  <Text strong>Name of employee</Text>
                  <Text>Contact information</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12}>
              <Card title='IT Support'>
                <Space direction='vertical'>
                  <Avatar size={50} />
                  <Text strong>Name of employee</Text>
                  <Text>Contact information</Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={24} style={{ marginTop: 20 }} align='center'>
          <Space direction='vertical'>
            <Title level={3}>Live chat</Title>
            <Text>
              Get fast, reliable service and the peace of mind you deserve
            </Text>
            <img
              alt='Live chat'
              src={LiveChat}
              style={{
                height: '200px',
                maxWidth: '80%',
                margin: 'auto',
                marginTop: 30,
              }}
            />
            <Button type='primary' style={{ marginTop: 20 }} onClick={showChat}>
              Start live chat
            </Button>
          </Space>
          <br />
          <br />
          <br />
          <br />
        </Col>
      </Row>
    </Fader>
  );
}
