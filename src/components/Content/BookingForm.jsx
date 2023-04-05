import dayjs from 'dayjs';
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Grid,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  TimePicker,
  Typography,
} from 'antd';
// import { Radar } from '@ant-design/plots';
import {
  TbBulb,
  TbCalendarPlus,
  TbFileDownload,
  TbShieldCheck,
  TbUser,
  TbVideo,
  TbMedal,
} from 'react-icons/tb';
import { SlGraduation } from 'react-icons/sl';

import { useSelector, useDispatch } from 'react-redux';
import {
  selectBookModal,
  setBookModal,
  setRefresh,
} from '../../redux/slices/selections';
import ReactPlayer from 'react-player';
import VAName from './VAName';
import { useEffect, useState } from 'react';
import Title from 'antd/es/typography/Title';
import { selectSession } from '../../redux/slices/user';
import { Link, useNavigate } from 'react-router-dom';
import useRequest from '../../hooks/useRequest';
import { newBooking } from '../../services/supabase';
import { request } from '../../services/api';

const { Text } = Typography;

const getTimezoneName = (tz) => {
  let text;
  try {
    const parts = Intl.DateTimeFormat(undefined, {
      timeZone: tz,
      timeZoneName: 'long',
    }).formatToParts();
    for (let i = 0; i < parts.length; i++) {
      if (parts[i]?.type === 'timeZoneName') {
        text = parts[i].value;
        break;
      }
    }
  } catch (e) {
    text = '';
  }
  return text;
};

export default function BookingForm({ dates = {} }) {
  const { availableDates = {} } = dates;
  console.log(dates);
  const dispatch = useDispatch();
  const { xs } = Grid.useBreakpoint();
  const [time, setTime] = useState(undefined);
  const [date, setDate] = useState(undefined);
  const book = useSelector(selectBookModal);

  const { loading, fetch, ErrorMessageAlert, SuccessMessageAlert } = useRequest(
    request,
    { alertIcon: true, alertStyle: { marginTop: 20 } }
  );

  const disabledDate = (current) => {
    const date = current?.format?.('YYYY-MM-DD');
    return !availableDates?.[date];
  };

  const submit = async () => {
    const finalDate = date?.format('YYYY-MM-DD') ?? undefined;
    const finalTime = time;

    const { successMessage } = await fetch({
      path: 'va/book',
      data: {
        timezone: dates?.timezone,
        date: finalDate,
        time: finalTime,
        id: book.id,
      },
    });

    if (successMessage) {
      setTimeout(() => {
        dispatch(setBookModal(null));
        dispatch(setRefresh());
      }, 5000);
    }
  };

  const options = [];

  if (date && availableDates?.[date?.format('YYYY-MM-DD')]) {
    availableDates[date?.format('YYYY-MM-DD')]?.forEach((time) => {
      options.push({ value: time });
    });
  }

  return (
    <Col span={24}>
      <Card
        title={
          <Space>
            <TbCalendarPlus style={{ fontSize: 20, color: '#293893' }} />
            <Title level={5} style={{ marginTop: 2 }}>
              Schedule a meeting
            </Title>
          </Space>
        }
      >
        {(dates?.timezone && (
          <Row align='middle' justify='center' gutter={[12, 12]}>
            <Col
              xs={24}
              sm={8}
              md={10}
              style={{ textAlign: xs ? 'left' : 'right' }}
            >
              <Typography.Text>Your timezone</Typography.Text>
            </Col>
            <Col flex='auto'>
              <Text type='secondary'>{getTimezoneName(dates.timezone)}</Text>
            </Col>
          </Row>
        )) ||
          null}
        <Row
          align='middle'
          justify='center'
          gutter={[12, 12]}
          style={{ marginTop: 15 }}
        >
          <Col
            xs={24}
            sm={8}
            md={10}
            style={{ textAlign: xs ? 'left' : 'right' }}
          >
            <Typography.Text>Preferred date</Typography.Text>
          </Col>
          <Col flex='auto'>
            <DatePicker
              allowClear
              onChange={(val) => {
                if (!val) {
                  setDate(null);
                }
              }}
              format='MMMM DD, YYYY'
              value={date}
              onSelect={(newDate) => {
                setDate(newDate);
              }}
              disabledDate={disabledDate}
              style={{ width: xs ? '100%' : 170 }}
            />
          </Col>
        </Row>
        <Row
          align='middle'
          justify='center'
          gutter={[12, 12]}
          style={{ marginTop: 10 }}
        >
          <Col
            xs={24}
            sm={8}
            md={10}
            style={{ textAlign: xs ? 'left' : 'right' }}
          >
            <Typography.Text>Preferred time</Typography.Text>
          </Col>
          <Col flex='auto'>
            <Select
              value={time}
              style={{ width: xs ? '100%' : 170 }}
              disabled={!date}
              placeholder={!date ? 'Select a date' : 'Select time'}
              options={options}
              onSelect={(value) => {
                setTime(value);
              }}
            />
            {/* <TimePicker
              value={time}
              onChange={onChange}
              style={{ width: xs ? '100%' : 170 }}
              minuteStep={15}
              format='hh:mm a'
              use12Hours
              disabledTime={disabledTime}
              onSelect={(newTime) => {
                setTime(newTime);
              }}
            /> */}
          </Col>
        </Row>
        <Row style={{ marginTop: 0 }}>
          <Col span={24} align='left'>
            {ErrorMessageAlert}
            {SuccessMessageAlert}
          </Col>
          <Col span={24} align='center' style={{ marginTop: 20 }}>
            <Space>
              <Button type='primary' onClick={submit} loading={loading}>
                Submit
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </Col>
  );
}
