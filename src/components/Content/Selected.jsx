import Fader from '../Fader';
import { CheckCircleOutlined } from '@ant-design/icons';

export default function Selected({ show = false }) {
  if (!show) {
    return <span />;
  }

  return (
    <Fader>
      <div style={{ float: 'right', marginTop: -25, marginRight: -15 }}>
        <CheckCircleOutlined style={{ fontSize: '1.5em', color: '#2c3291' }} />
      </div>
    </Fader>
  );
}
