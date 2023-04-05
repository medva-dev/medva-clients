import { useEffect } from 'react';
import { Col, Layout, Row, Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import Fader from '../Fader';
import CategoryPicker from './CategoryPicker';
import SubCategoryPicker from './SubCategoryPicker';
import VirtualAssistantWrapper from './VirtualAssistantWrapper';
import Appointments from './Appointments';
import Invoices from './Invoices';
import Referral from './Referral';
import Support from './Support';

const { Content: AntdContent } = Layout;
const { Title, Text } = Typography;

export default function Content() {
  const { pathname } = useLocation();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const ref = urlParams.get('ref');

  useEffect(() => {
    if (String(ref || '').trim()) {
      localStorage.setItem('ref', String(ref || '').trim());
      window.location.href = '/';
    }
  }, [ref]);

  return (
    <AntdContent
      id='content'
      style={{
        backgroundColor: '#fff',
        padding: 0,
        marginTop: '-12px',
      }}
    >
      {(pathname !== '/appointments' &&
        pathname !== '/invoices' &&
        pathname !== '/refer' &&
        pathname !== '/support' && (
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
                <Row style={{}}>
                  <Col xs={24} sm={24} md={24} align='center'>
                    <Title level={2}>Hire the best Virtual Assistants</Title>
                    <Text>
                      Say goodbye to mundane tasks and welcome to the future -
                      get your virtual assistant today!
                    </Text>
                  </Col>
                </Row>
              </Fader>
            </Col>

            <CategoryPicker />
            <SubCategoryPicker />
            <VirtualAssistantWrapper />
          </Row>
        )) ||
        (pathname === '/appointments' && <Appointments />) ||
        (pathname === '/invoices' && <Invoices />) ||
        (pathname === '/refer' && <Referral />) ||
        (pathname === '/support' && <Support />)}
    </AntdContent>
  );
}
