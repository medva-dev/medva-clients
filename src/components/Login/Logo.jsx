import { Row, Col } from 'antd';

import logo from '../../assets/images/logo.png';

export default function Logo() {
  return (
    <Row justify='center'>
      <Col style={{ alignContent: 'center', textAlign: 'center' }}>
        <img src={logo} width='75%' alt='MedVA' />
      </Col>
    </Row>
  );
}
