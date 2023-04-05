import { Card, Typography, Button, Tag, Col, Avatar, Space, Badge } from 'antd';
import { useDispatch } from 'react-redux';
import Fader from '../Fader';
import { setBookModal } from '../../redux/slices/selections';

const { Text } = Typography;

function capitalizeFirstLetter(string) {
  string = String(string ?? '').toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function VAName({
  firstName,
  avatar,
  country,
  lastName,
  category,
  subCategory,
}) {
  return (
    <>
      <div align='center'>
        <Space direction='vertical'>
          <Avatar
            size={100}
            src={avatar}
            style={{
              // border: '1px solid #2c3291',
              boxShadow: '0px 2px #2c3291',
            }}
          />
          <Text ellipsis strong>
            <Space>
              {(country && (
                <img
                  src={`https://flagsapi.com/PH/flat/64.png`}
                  alt={country}
                  style={{ width: 25, marginTop: 5 }}
                />
              )) ||
                null}
              {`${firstName} ${lastName?.[0]}.`}
            </Space>
          </Text>
        </Space>
      </div>
      <div align='center'>
        <Space direction='vertical'>
          <Tag color='#fdc500' style={{ color: 'black' }}>
            {`${capitalizeFirstLetter(category)} ${capitalizeFirstLetter(
              subCategory
            )}`}
          </Tag>
        </Space>
      </div>
    </>
  );
}
