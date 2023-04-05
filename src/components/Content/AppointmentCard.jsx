import { Card, Col, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import VAName from './VAName';

const { Link } = Typography;

const columns = [
  {
    title: 'Field',
    dataIndex: 'field',
    key: 'field',
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
  },
];

export default function AppointmentCard(props) {
  const dataSource = [
    {
      key: '1',
      field: 'Date',
      value: dayjs(props.dateTime).format('MMMM DD, YYYY'),
    },
    {
      key: '2',
      field: 'Time',
      value: dayjs(props.dateTime).format('hh:mm a'),
    },
    {
      key: '3',
      field: 'Meeting ID',
      value: props.zoomId,
    },
    {
      key: '4',
      field: 'Passcode',
      value: props.zoomPassword,
    },
    {
      key: '5',
      field: 'Meeting Link',
      value: (
        <Link href={props.zoomLink} target='_blank'>
          Open
        </Link>
      ),
    },
  ];

  return (
    <Col xs={24} sm={18} md={12} lg={8}>
      <Card>
        <VAName {...props.virtualAssistants} />
        <Table
          style={{ marginTop: 20 }}
          columns={columns}
          dataSource={dataSource}
          showHeader={false}
          pagination={false}
        />
      </Card>
    </Col>
  );
}
