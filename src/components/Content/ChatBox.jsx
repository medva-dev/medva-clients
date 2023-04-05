import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  Card,
  FloatButton,
  Empty,
  Row,
  Space,
  Avatar,
  Input,
  Button,
  Col,
  Badge,
} from 'antd';
import Text from 'antd/es/typography/Text';
import { CustomerServiceOutlined, SendOutlined } from '@ant-design/icons';
import useRequest from '../../hooks/useRequest';
import supabase, { getClientId } from '../../services/supabase';
import Message from './Message';
import { useDispatch, useSelector } from 'react-redux';
import {
  initializeMessages,
  insertMessage,
  selectMessages,
  selectShow,
  setRefreshUnread,
  setShow,
} from '../../redux/slices/messages';
import UnreadCounter from './UnreadCounter';

const xSend = async (values = {}) => {
  const insert = {
    message: values?.message,
    clientId: values?.clientId,
  };

  const { data, error } = await supabase.from('messages').insert(insert);
  console.log({ data, error });
};

const xMarkAsRead = async (clientId) => {
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    'mark_message_as_seen_by_client',
    { clientId }
  );

  console.log({ rpcData, rpcError });
};

const xMessages = async (values = {}) => {
  const { clientId } = values;
  const { data, error } = await supabase
    .from('messages')
    .select()
    .eq('clientId', clientId)
    .order('createdAt', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  await xMarkAsRead(clientId);

  return data;
};

export default function ChatBox() {
  const open = useSelector(selectShow);
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  // const [messages, setMessages] = useState([]);
  // const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);
  const clientId = getClientId();
  const { loading, fetch: sendNow } = useRequest(xSend);

  const {
    loading: fetchingMessages,
    fetch: fetchMessages,
    data,
  } = useRequest(xMessages);

  const keyUp = ({ key }) => {
    if (key === 'Enter') {
      send();
    }
  };

  const markAsRead = async () => {
    await xMarkAsRead(clientId);
    dispatch(setRefreshUnread());
  };

  const openChange = (status) => {
    if (window.stopClosing === true) {
      return;
    }

    dispatch(setShow(status));
  };

  const send = async () => {
    if (!message?.trim?.()) {
      inputRef?.current?.focus?.();
      return;
    }

    setMessage('');
    inputRef?.current?.focus?.();
    await sendNow({ message, clientId });
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    fetchMessages({ clientId }).then(() => {
      dispatch(setRefreshUnread());
    });
  }, [open, clientId]);

  useEffect(() => {
    const channel = supabase
      .channel('changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `clientId=eq.${clientId}`,
        },
        (payload) => {
          dispatch(insertMessage(payload.new));
          dispatch(setRefreshUnread());
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [clientId]);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      dispatch(initializeMessages(data));
    }
  }, [data]);

  return (
    <FloatButton.Group
      open={open}
      trigger='click'
      type='primary'
      style={{ right: 24, bottom: 15 }}
      description={<UnreadCounter clientId={clientId} />}
      icon={
        <>
          <CustomerServiceOutlined />
        </>
      }
      onOpenChange={openChange}
    >
      <Card
        onClick={markAsRead}
        style={{ width: 300, right: 260 }}
        title={
          <Space>
            <Avatar
              style={{
                backgroundColor: '#fff',
                verticalAlign: 'middle',
                color: '#293893',
              }}
              gap={20}
            >
              Md
            </Avatar>
            <Text strong style={{ color: '#fff' }}>
              MedVA Specialist
            </Text>
          </Space>
        }
        headStyle={{ backgroundColor: '#293893', color: '#fff' }}
        bodyStyle={{ padding: 0 }}
      >
        <Space
          id='messages'
          direction='vertical'
          style={{
            width: '100%',
            minHeight: 330,
            maxHeight: 330,
            overflow: 'auto',
            padding: 10,
            display: 'flex',
            justifyContent: 'flex-end',
            flexDirection: 'column',
          }}
        >
          {(fetchingMessages && <Card loading />) || null}
          {(!fetchingMessages && messages.length < 1 && (
            <Empty
              description='Let us know your thoughts'
              style={{ marginBottom: 90 }}
            />
          )) ||
            null}
          {(!fetchingMessages &&
            messages.length > 0 &&
            messages.map((m) => {
              return <Message {...m} key={m.id} />;
            })) ||
            null}
        </Space>
        <Row
          style={{
            marginTop: 0,
            borderTop: '1px solid rgb(0,0,0,0.1)',
            padding: 10,
          }}
        >
          <Col span={20}>
            <Input
              ref={inputRef}
              value={message}
              placeholder='Enter your message'
              onKeyUp={keyUp}
              onChange={(event) => {
                setMessage(event?.target?.value ?? '');
              }}
            />
          </Col>
          <Col span={4} align='right'>
            <Button
              icon={<SendOutlined />}
              loading={loading}
              onClick={send}
            ></Button>
          </Col>
        </Row>
      </Card>
    </FloatButton.Group>
  );
}
