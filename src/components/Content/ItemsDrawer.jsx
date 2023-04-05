import { useEffect } from 'react';
import moment from 'moment';
import { Card, Divider, Drawer, Space, Table, Typography } from 'antd';
import supabase from '../../services/supabase';
import useRequest from '../../hooks/useRequest';
import { request } from '../../services/api';
const { Text } = Typography;

const fetchDetails = async (values) => {
  const { id } = values;
  const { data } = await supabase
    .from('invoiceItemDetails')
    .select('timesheets(date, approvedHours, tdUsers(name), tdProjects(name))')
    .eq('invoiceItemId', id);

  return data ?? [];
};

export default function ItemsDrawer({ showDetails, setShowDetails }) {
  const { loading, data, fetch, ErrorMessageAlert } = useRequest(request, {
    alertStyle: { marginBottom: 20 },
  });

  useEffect(() => {
    if (showDetails > 0) {
      void fetch({
        path: 'invoices/item-details',
        data: { id: showDetails },
      });
    }
  }, [showDetails]);

  const projectName = data?.[0]?.timesheets?.tdProjects?.name ?? '';
  const userName = data?.[0]?.timesheets?.tdUsers?.name ?? '';

  return (
    <Drawer
      destroyOnClose
      title={userName}
      open={showDetails > 0}
      onClose={() => {
        setShowDetails(0);
      }}
    >
      {(!ErrorMessageAlert && (
        <>
          {(loading && <Card loading />) || (
            <Space direction='vertical'>
              <Text type='secondary'>Project name</Text>
              <Text strong>{projectName}</Text>
            </Space>
          )}
          <Divider />
          <Table
            loading={loading}
            columns={[
              {
                title: 'Date',
                key: 'date',
                dataIndex: 'date',
                render: (_, row) => {
                  const { timesheets = {} } = row ?? {};
                  const { date } = timesheets ?? {};

                  return <Text>{moment(date).format('MMM DD, YYYY')}</Text>;
                },
              },
              {
                title: 'Hours',
                key: 'hours',
                dataIndex: 'hours',
                render: (_, row) => {
                  const { timesheets = {} } = row ?? {};
                  const { approvedHours } = timesheets ?? {};

                  return (
                    <div style={{ textAlign: 'right' }}>
                      <Text strong>{approvedHours}</Text>
                    </div>
                  );
                },
              },
            ]}
            dataSource={data ?? []}
            pagination={{
              hideOnSinglePage: true,
              pageSize: 999,
            }}
            summary={(tableData) => {
              let total = 0;
              tableData?.forEach?.((d) => {
                total += Number(d?.timesheets?.approvedHours ?? 0);
              });

              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={2} align='right'>
                      {' '}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <Text type='secondary' strong>
                        Total hours
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align='right'>
                      <Text strong>{total}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        </>
      )) ||
        ErrorMessageAlert}
    </Drawer>
  );
}
