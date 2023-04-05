import { Col, Row, Space } from 'antd';
import Fader from '../Fader';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';
import { useSelector } from 'react-redux';
import { selectSession } from '../../redux/slices/user';
import InvoicesTable from './InvoicesTable';
import InvoiceDrawer from './InvoiceDrawer';

export default function Invoices() {
  const session = useSelector(selectSession);

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
                  <Title level={2}>Invoices</Title>
                  <Text>
                    Our convenient system allows you to quickly view your
                    invoices and manage them in one place.
                  </Text>
                  <Text>
                    Keep track of your payments, and upcoming bills with ease.
                  </Text>
                </Space>
              </Col>
            </Row>
          </Fader>
        </Col>
        <Col span={24} align='center' style={{ marginTop: 20 }}>
          <InvoicesTable />
          <InvoiceDrawer />
        </Col>
      </Row>
    </Fader>
  );
}
