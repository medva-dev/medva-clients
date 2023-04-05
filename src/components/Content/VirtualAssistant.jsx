import { Card, Typography, Button, Rate, Col } from 'antd';
import { useDispatch } from 'react-redux';
import Fader from '../Fader';
import { setBookModal } from '../../redux/slices/selections';
import VAName from './VAName';

const { Text } = Typography;

export default function VirtualAssistant(props) {
  const dispatch = useDispatch();

  const {
    id,
    firstName,
    lastName,
    country,
    avatar,
    category,
    subCategory,
    professions,
    experiences,
    registeredNurse,
    medicalDegree,
    video,
    status,
    rating,
  } = props;

  const book = () => {
    console.log('here?');
    dispatch(
      setBookModal({
        id,
        firstName,
        lastName,
        country,
        avatar,
        category,
        subCategory,
        video,
        status,
        rating,
      })
    );
  };

  const details = [];

  professions?.forEach((p) => {
    details.push(p.profession);
  });

  if (details.indexOf('Registered Nurse') < 0 && registeredNurse) {
    details.push('Registered Nurse');
  }

  if (details.length < 1 && medicalDegree) {
    details.push('Medical degree');
  }

  experiences?.forEach((e) => {
    if (details.length < 5) {
      details.push(e.name);
    }
  });

  return (
    <Col xs={24} sm={24} md={8} lg={6}>
      <Fader>
        <Card
          className='card-va-type'
          style={{ minHeight: 450, maxHeight: 450 }}
        >
          <VAName {...props} />
          <div style={{ marginTop: 5, textAlign: 'left', height: 170 }}>
            <ul>
              {details.map((d) => (
                <li>
                  <Text ellipsis>{d}</Text>
                </li>
              ))}
            </ul>
            {/* {(rating && (
              <div align='center'>
                <Rate
                  disabled
                  allowHalf
                  defaultValue={rating}
                  style={{ color: '#fdc500' }}
                />
              </div>
            )) ||
              null} */}
          </div>
          <div align='center' style={{ marginTop: 0 }}>
            <Button type='primary' onClick={book} disabled={status !== 'open'}>
              {status === 'open' ? 'View details' : 'Not available'}
            </Button>
          </div>
        </Card>
      </Fader>
    </Col>
  );
}
