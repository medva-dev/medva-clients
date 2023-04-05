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
import BookingForm from './BookingForm';

function capitalizeFirstLetter(string) {
  string = String(string ?? '').toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// const data = [
//   {
//     name: 'D',
//     label: 'Dominance',
//     value: 100,
//   },
//   {
//     name: 'I',
//     label: 'Influence',
//     value: 10,
//   },
//   {
//     name: 'S',
//     label: 'Steadiness',
//     value: 90,
//   },
//   {
//     name: 'C',
//     label: 'Compliance',
//     value: 60,
//   },
// ];
// const config = {
//   data,
//   xField: 'name',
//   yField: 'value',
//   appendPadding: [0, 10, 0, 10],
//   meta: {
//     value: {
//       min: 0,
//       nice: true,
//       formatter: (v) => Number(v).toFixed(0),
//     },
//   },
//   xAxis: {
//     tickLine: null,
//   },
//   yAxis: {
//     label: false,
//     grid: {
//       alternateColor: 'rgba(0, 0, 0, 0.04)',
//     },
//   },
//   point: {
//     size: 3,
//   },
//   tooltip: {
//     title: () => {
//       return ` `;
//     },
//     customItems: (originalItems) => {
//       console.log(originalItems);
//       const newItems = [];
//       newItems.push({
//         name: originalItems?.[0]?.data?.label,
//         value: `<span style='font-weight: bold; font-size:13px'>${originalItems?.[0]?.value}</span>`,
//       });
//       return newItems;
//     },
//   },
//   area: {},
//   style: { width: '80%', marginTop: -80 },
// };

const { Text } = Typography;

export default function BookModal() {
  const dispatch = useDispatch();
  const { xs } = Grid.useBreakpoint();
  const [time, setTime] = useState(undefined);
  const [date, setDate] = useState(undefined);
  const book = useSelector(selectBookModal);
  const session = useSelector(selectSession);
  const navigate = useNavigate();

  const {
    loading: fetchingDetails,
    fetch: fetchDetails,
    ErrorMessageAlert: VAError,
    data,
  } = useRequest(request);

  const { loading, fetch, ErrorMessageAlert, SuccessMessageAlert } =
    useRequest(newBooking);

  const closeModal = () => {
    if (loading) {
      return;
    }
    dispatch(setBookModal(null));
  };

  const disabledDate = (current) => {
    return current && current < dayjs().endOf('day');
  };

  const onChange = (a, b) => {
    console.log(a, b);
  };

  const submit = async () => {
    const finalDate = date?.format('YYYY-MM-DD') ?? undefined;
    const finalTime = time?.format('HH:mm') ?? undefined;

    const { successMessage } = await fetch({
      date: finalDate,
      time: finalTime,
      id: book.id,
    });
    if (successMessage) {
      setTimeout(() => {
        dispatch(setBookModal(null));
        dispatch(setRefresh());
      }, 1000);
    }
  };

  useEffect(() => {
    console.log(book);
    if (book?.id > 0 && !session) {
      navigate('/login');
    } else if (book?.id > 0) {
      const { timeZone: timezone } = Intl.DateTimeFormat().resolvedOptions();

      void fetchDetails({
        path: 'va/get-details',
        data: { id: book.id, timezone },
      });
    }
  }, [book]);

  return (
    <Modal
      open={session && book?.id > 0}
      onCancel={closeModal}
      footer={false}
      destroyOnClose
    >
      {(fetchingDetails && (
        <div align='center' style={{ marginTop: 20 }}>
          <Spin />
        </div>
      )) ||
        (!VAError && (
          <Row gutter={[12, 12]} style={{ padding: 15 }}>
            {(data?.video && (
              <Col span={24}>
                <Card
                  title={
                    <Space>
                      <TbVideo style={{ fontSize: 20, color: '#293893' }} />
                      <Title level={5} style={{ marginTop: 2 }}>
                        Introduction
                      </Title>
                    </Space>
                  }
                  bodyStyle={{ padding: 0 }}
                >
                  <ReactPlayer
                    style={{
                      overflow: 'hidden',
                    }}
                    width='100%'
                    height='auto'
                    url={book?.video}
                    playing={true}
                    controls={true}
                    loop={false}
                    playsinline={true}
                  />
                </Card>
              </Col>
            )) ||
              null}
            {/* <Col span={24} style={{ marginTop: 20 }}> */}
            {/* <Divider style={{ marginTop: -30 }} /> */}
            {/* <VAName {...(book || {})} /> */}
            {/* <Col span={16} align='center'>
              <Radar {...config} />
            </Col> */}
            {/* </Col> */}

            <Col span={24} style={{ marginTop: 10 }}>
              <Card
                title={
                  <Space>
                    <TbUser style={{ fontSize: 20, color: '#293893' }} />
                    <Title level={5} style={{ marginTop: 2 }}>
                      Basic Information
                    </Title>
                  </Space>
                }
              >
                <Row gutter={[12, 12]}>
                  <Col span={6}>Name</Col>
                  <Col span={18}>
                    <Text strong>
                      {data?.firstName} {data?.lastName}
                    </Text>
                  </Col>
                  <Col span={6}>Location</Col>
                  <Col span={18}>
                    <Space>
                      {(data?.flag && (
                        <img
                          src={data?.flag}
                          alt={data?.location}
                          style={{ maxWidth: 20 }}
                        />
                      )) ||
                        null}
                      <Text>{data?.country}</Text>
                    </Space>
                  </Col>
                  <Col span={6}>Main Skill</Col>
                  <Col span={18}>
                    <Tag color='#fdc500' style={{ color: 'black' }}>
                      {`${capitalizeFirstLetter(
                        data?.category
                      )} ${capitalizeFirstLetter(data?.subCategory)}`}
                    </Tag>
                  </Col>
                </Row>
              </Card>
            </Col>
            {(data?.education?.length > 0 && (
              <Col span={24}>
                <Card
                  title={
                    <Space>
                      <SlGraduation
                        style={{ fontSize: 20, color: '#293893' }}
                      />
                      <Title level={5} style={{ marginTop: 2 }}>
                        Education
                      </Title>
                    </Space>
                  }
                >
                  <Space direction='vertical'>
                    {data.education.map((c) => {
                      return <Badge color='gray' text={c.name} />;
                    })}
                  </Space>
                </Card>
              </Col>
            )) ||
              null}
            {(data?.certifications?.length > 0 && (
              <Col span={24}>
                <Card
                  title={
                    <Space>
                      <TbMedal style={{ fontSize: 20, color: '#293893' }} />
                      <Title level={5} style={{ marginTop: 2 }}>
                        Verified Certificates
                      </Title>
                    </Space>
                  }
                >
                  <Space direction='vertical'>
                    {data.certifications.map((c) => {
                      return <Badge color='gray' text={c.name} />;
                    })}
                  </Space>
                </Card>
              </Col>
            )) ||
              null}

            {(data?.trainings?.length > 0 && (
              <Col span={24}>
                <Card
                  title={
                    <Space>
                      <TbShieldCheck
                        style={{ fontSize: 20, color: '#293893' }}
                      />
                      <Title level={5} style={{ marginTop: 2 }}>
                        MedVA Verified Trainings
                      </Title>
                    </Space>
                  }
                >
                  <Space direction='vertical'>
                    {data.trainings.map((c) => {
                      return <Badge color='gray' text={c.name} />;
                    })}
                  </Space>
                </Card>
              </Col>
            )) ||
              null}
            {(data?.experiences?.length > 0 && (
              <Col span={24}>
                <Card
                  title={
                    <Space>
                      <TbBulb style={{ fontSize: 20, color: '#293893' }} />
                      <Title level={5} style={{ marginTop: 2 }}>
                        Skills & Experiences
                      </Title>
                    </Space>
                  }
                >
                  <Space direction='vertical'>
                    {data.experiences.map((c) => {
                      return <Badge color='gray' text={c.name} />;
                    })}
                  </Space>
                </Card>
              </Col>
            )) ||
              null}
            {(data?.resume?.startsWith?.('http') && (
              <Col span={24}>
                <Card
                  title={
                    <Space>
                      <TbFileDownload
                        style={{ fontSize: 20, color: '#293893' }}
                      />
                      <Title level={5} style={{ marginTop: 2 }}>
                        Downloads
                      </Title>
                    </Space>
                  }
                >
                  <Space direction='vertical'>
                    <a href={data?.resume} target='_blank' rel='noreferrer'>
                      <Badge
                        color='gray'
                        text={<Text type='danger'>Resume</Text>}
                      />
                    </a>
                  </Space>
                </Card>
              </Col>
            )) ||
              null}
            {(data?.dates && <BookingForm dates={data.dates} />) || null}
          </Row>
        )) ||
        VAError}
    </Modal>
  );
}
