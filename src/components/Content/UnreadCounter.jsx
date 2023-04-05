import { Badge } from 'antd';
import { useSelector } from 'react-redux';
import supabase from '../../services/supabase';
import useRequest from '../../hooks/useRequest';
import { useEffect, useState } from 'react';
import Fader from '../Fader';
import { selectRefreshUnread } from '../../redux/slices/messages';

const fetchMessages = async (values = {}) => {
  const { clientId } = values;

  const { data, error } = await supabase
    .from('viewMessages')
    .select()
    .eq('clientId', clientId)
    .maybeSingle();

  return data;
};

export default function UnreadCounter({ clientId }) {
  const refresh = useSelector(selectRefreshUnread);
  const { fetch, data } = useRequest(fetchMessages);
  const [count, setCount] = useState(0);

  useEffect(() => {
    void fetch({ clientId });
  }, [refresh]);

  useEffect(() => {
    if (data) {
      setCount(data.clientUnreadCount || 0);
    }
  }, [data]);

  return (
    <Fader>
      <div style={{ position: 'absolute', top: -10, color: 'red' }}>
        {(count > 0 && <Badge count={count} />) || null}
      </div>
    </Fader>
  );
}
