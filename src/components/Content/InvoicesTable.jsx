/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import { Button, Space, Table, Tag, Typography } from 'antd';
import useRequest from '../../hooks/useRequest';
import { getInvoices } from '../../services/supabase';
import { useEffect } from 'react';
import { createInvoiceUrl, currencyFormat } from '../../helpers/utils';

import { setInvoiceId } from '../../redux/slices/invoices';
import { useDispatch } from 'react-redux';
import { request } from '../../services/api';
import { TbDownload, TbExternalLink } from 'react-icons/tb';

const { Text, Link } = Typography;

export default function InvoicesTable() {
  const { loading, fetch, data, errorMessage } = useRequest(request);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch({ path: 'invoices/list' });
  }, []);

  const locale = {
    emptyText:
      (errorMessage && <Text type='danger'>{errorMessage}</Text>) ||
      'No invoices found',
  };

  return (
    <Table
      style={{ overflow: 'auto' }}
      locale={locale}
      loading={loading}
      columns={[
        {
          title: 'Actions',
          dataIndex: 'id',
          key: 'actions',
          width: 64,
          fixed: 'left',
          render: (id) => {
            return (
              <div style={{ minWidth: 64, textAlign: 'center' }}>
                <Space>
                  <Button
                    icon={<TbExternalLink />}
                    type='link'
                    onClick={() => {
                      dispatch(setInvoiceId(id));
                    }}
                  />
                  <Link href={createInvoiceUrl(id)} target='_blank'>
                    <TbDownload />
                  </Link>
                </Space>
              </div>
            );
          },
        },
        {
          title: 'Status',
          width: 100,
          dataIndex: 'status',
          key: 'status',
          render: (status) => (
            <Tag color={status === 'paid' ? 'green' : 'red'}>{status}</Tag>
          ),
        },
        {
          title: 'Invoice #',
          width: 100,
          dataIndex: 'id',
          key: 'id',
          render: (id) => (
            <div style={{ minWidth: 100 }}>
              <Text strong>{String(id).padStart(6, '0')}</Text>
            </div>
          ),
        },
        {
          title: 'Project name',
          dataIndex: 'tdProjects',
          key: 'projectName',
          render: (tdProjects) => {
            return (
              <div style={{ minWidth: 200 }}>
                <Text>{tdProjects?.name}</Text>
              </div>
            );
          },
        },
        {
          title: 'Due date',
          width: 150,
          dataIndex: 'dueDate',
          key: 'dueDate',
          render: (date) => {
            return (
              <div style={{ minWidth: 100 }}>
                <Text>{moment(date).format('MMM DD, YYYY')}</Text>
              </div>
            );
          },
        },
        {
          title: 'Amount',
          width: 150,
          dataIndex: 'total',
          key: 'total',
          render: (total) => {
            return (
              <div style={{ minWidth: 100, textAlign: 'right' }}>
                <Link strong>{currencyFormat(total)}</Link>
              </div>
            );
          },
        },
      ]}
      dataSource={data ?? []}
      pagination={{
        pageSize: 999,
        hideOnSinglePage: true,
      }}
    />
  );
}
