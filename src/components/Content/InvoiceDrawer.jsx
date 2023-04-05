import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Drawer,
  Grid,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { TbExternalLink } from 'react-icons/tb';
import useRequest from '../../hooks/useRequest';
import { currencyFormat } from '../../helpers/utils';
import { selectInvoiceId, setInvoiceId } from '../../redux/slices/invoices';
import ItemsDrawer from './ItemsDrawer';
import { request } from '../../services/api';

const { Text } = Typography;
const summary = ({ title, amount }) => {
  return (
    <Table.Summary.Row>
      <Table.Summary.Cell index={1} colSpan={6} align='right'>
        <Text type='secondary'>{title}</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={2} align='right'>
        <Text strong>{currencyFormat(amount)}</Text>
      </Table.Summary.Cell>
    </Table.Summary.Row>
  );
};

export default function InvoiceDrawer() {
  const dispatch = useDispatch();
  const invoiceId = useSelector(selectInvoiceId);
  const [showDetails, setShowDetails] = useState(0);
  const { loading, data, fetch, ErrorMessageAlert } = useRequest(request, {
    alertStyle: { marginBottom: 20 },
  });

  const { xs, md, xl } = Grid.useBreakpoint();

  let width = '100%';

  if (xl) {
    width = 1200;
  }

  useEffect(() => {
    if (Number(invoiceId) > 0) {
      void fetch({ path: 'invoices/details', data: { invoiceId } });
    }
  }, [invoiceId]);

  const {
    id,
    date,
    status,
    tdProjects,
    extra,
    subTotal,
    total,
    invoiceItems,
    dueDate = [],
  } = data ?? {};
  const xDate = (date && moment(date).format('MMMM DD, YYYY')) || null;
  const xDueDate = (dueDate && moment(dueDate).format('MMMM DD, YYYY')) || null;
  const { name: projectName, clients } = tdProjects ?? {};

  return (
    <Drawer
      open={invoiceId > 0}
      width={width}
      title='Invoice details'
      destroyOnClose
      onClose={() => {
        dispatch(setInvoiceId(0));
      }}
    >
      {(!ErrorMessageAlert && (
        <>
          <Card loading={loading}>
            <Row gutter={[8, 24]}>
              <Col xs={{ span: 24, order: 2 }} md={{ span: 12, order: 1 }}>
                <Space direction='vertical'>
                  <Text type='secondary'>Bill to</Text>
                  <Text strong>{projectName}</Text>
                  <Text type='secondary'>Address</Text>
                  <Text>{'Client address here'}</Text>
                </Space>
              </Col>
              <Col
                xs={{ span: 24, order: 1 }}
                md={{ span: 12, order: 2 }}
                style={{ textAlign: !md || xs ? 'left' : 'right' }}
              >
                <Row gutter={[12, 12]}>
                  <Col span={24}>
                    <Row gutter={24}>
                      <Col xs={10} sm={10} md={10} lg={14}>
                        <Text type='secondary'>Invoice Number</Text>
                      </Col>
                      <Col
                        xs={14}
                        sm={14}
                        md={14}
                        lg={10}
                        style={{ textAlign: 'right' }}
                      >
                        <Text strong>{String(id).padStart(6, '0')}</Text>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row gutter={24}>
                      <Col xs={10} sm={10} md={10} lg={14}>
                        <Text type='secondary'>Invoice Date</Text>
                      </Col>
                      <Col
                        xs={14}
                        sm={14}
                        md={14}
                        lg={10}
                        style={{ textAlign: 'right' }}
                      >
                        <Text strong>{xDate}</Text>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row gutter={24}>
                      <Col xs={10} sm={10} md={10} lg={14}>
                        <Text type='secondary'>Amount Due</Text>
                      </Col>
                      <Col
                        xs={14}
                        sm={14}
                        md={14}
                        lg={10}
                        style={{ textAlign: 'right' }}
                      >
                        <Text strong>{currencyFormat(total)}</Text>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row gutter={24}>
                      <Col xs={10} sm={10} md={10} lg={14}>
                        <Text type='secondary'>Due Date</Text>
                      </Col>
                      <Col
                        xs={14}
                        sm={14}
                        md={14}
                        lg={10}
                        style={{ textAlign: 'right' }}
                      >
                        <Text strong>{xDueDate}</Text>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row gutter={24}>
                      <Col xs={10} sm={10} md={10} lg={14}>
                        <Text type='secondary'>Status</Text>
                      </Col>
                      <Col
                        xs={14}
                        sm={14}
                        md={14}
                        lg={10}
                        style={{ textAlign: 'right' }}
                      >
                        <Tag color={status === 'paid' ? 'green' : 'red'}>
                          {status}
                        </Tag>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
          <Card style={{ marginTop: 20 }} bodyStyle={{ padding: 0 }}>
            <Table
              bordered
              loading={loading}
              style={{ overflow: xl ? 'hidden' : 'auto' }}
              columns={[
                {
                  title: '',
                  dataIndex: 'id',
                  key: 'id',
                  width: 20,
                  fixed: 'left',
                  render: (id) => {
                    return (
                      <div
                        style={{
                          minWidth: 32,
                          maxWidth: 32,
                          textAlign: 'center',
                        }}
                      >
                        <Button
                          icon={<TbExternalLink />}
                          type='link'
                          onClick={() => {
                            setShowDetails(id);
                          }}
                        />
                      </div>
                    );
                  },
                },
                {
                  title: 'User',
                  dataIndex: 'tdUserId',
                  key: 'tdUserId',
                  render: (_, item) => (
                    <div style={{ minWidth: 150 }}>
                      <Text ellipsis strong>
                        {item?.tdUsers?.name}
                      </Text>
                    </div>
                  ),
                },
                {
                  title: 'Start date',
                  dataIndex: 'startDate',
                  key: 'startDate',
                  width: 100,
                  render: (date) => (
                    <div style={{ minWidth: 100 }}>
                      <Badge
                        color='green'
                        text={moment(date).format('MMM DD, YYYY')}
                      />
                    </div>
                  ),
                },
                {
                  title: 'End date',
                  dataIndex: 'endDate',
                  key: 'endDate',
                  width: 100,
                  render: (date) => (
                    <div style={{ minWidth: 100 }}>
                      <Badge
                        color='orange'
                        text={moment(date).format('MMM DD, YYYY')}
                      />
                    </div>
                  ),
                },
                {
                  title: 'Hours',
                  dataIndex: 'totalHours',
                  key: 'totalHours',
                  width: 50,
                  render: (hours) => (
                    <div style={{ minWidth: 50 }}>
                      <Text strong>{hours}</Text>
                    </div>
                  ),
                },
                {
                  title: 'Rate',
                  dataIndex: 'ratePerHour',
                  key: 'ratePerHour',
                  width: 80,
                  render: (rate) => (
                    <div style={{ minWidth: 80, textAlign: 'right' }}>
                      <Text>{currencyFormat(rate)}</Text>
                    </div>
                  ),
                },
                {
                  title: 'Amount',
                  dataIndex: 'totalPay',
                  key: 'totalPay',
                  width: 100,
                  render: (totalPay) => (
                    <div style={{ minWidth: 100, textAlign: 'right' }}>
                      <Text strong>{currencyFormat(totalPay)}</Text>
                    </div>
                  ),
                },
              ]}
              dataSource={invoiceItems ?? []}
              pagination={{ hideOnSinglePage: true, pageSize: 999 }}
              summary={() => {
                return (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={7} align='right'>
                        {' '}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    {summary({ title: 'Sub total', amount: subTotal })}
                    {extra?.map?.((e) => {
                      const { name, amount } = e;
                      if (name && amount) {
                        return summary({ title: name, amount });
                      }
                      return null;
                    })}
                    {summary({ title: 'Total amount due', amount: total })}
                  </>
                );
              }}
            />
          </Card>
          <ItemsDrawer
            showDetails={showDetails}
            setShowDetails={setShowDetails}
          />
        </>
      )) ||
        ErrorMessageAlert}
    </Drawer>
  );
}
