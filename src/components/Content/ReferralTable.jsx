import { useEffect } from 'react';
import { Avatar, Space, Typography, Table } from 'antd';
import useRequest from '../../hooks/useRequest';
import supabase from '../../services/supabase';
import { useSelector } from 'react-redux';
import { selectSession } from '../../redux/slices/user';
import Fader from '../Fader';
import moment from 'moment';

const { Text } = Typography;
const getReferrals = async (values = {}) => {
  const { clientId } = values;

  const { data, error } = await supabase
    .from('clients')
    .select('name, avatarUrl, createdAt')
    .eq('referredBy', clientId);

  return data;
};

export default function ReferralTable() {
  const { loading, data, fetch } = useRequest(getReferrals);
  const session = useSelector(selectSession);

  useEffect(() => {
    fetch({ clientId: session.id });
  }, [session]);

  return (
    <Fader>
      <Table
        loading={loading}
        style={{ maxWidth: 600, marginTop: 20 }}
        dataSource={data || []}
        columns={[
          {
            title: 'Client name',
            dataIndex: 'name',
            key: 'name',
            render: (name, row) => {
              return (
                <Space>
                  <Avatar src={row.avatarUrl} />
                  <Text>{name}</Text>
                </Space>
              );
            },
          },
          {
            title: 'Date registered',
            width: 250,
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => moment(date).format('lll'),
          },
        ]}
        pagination={{
          hideOnSinglePage: true,
        }}
      />
    </Fader>
  );
}
