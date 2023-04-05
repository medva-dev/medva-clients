import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Affix, Avatar, Button, Dropdown, Grid } from 'antd';
import { selectSession, setDrawer } from '../../redux/slices/user';
import ChatBox from '../Content/ChatBox';
import { menuItems } from '.';

export default function User() {
  const dispatch = useDispatch();
  const { lg } = Grid.useBreakpoint();
  const session = useSelector(selectSession);

  const showDrawer = () => {
    dispatch(setDrawer(true));
  };

  if (!session || !session?.user) {
    return <span />;
  }

  return (
    <>
      <Affix offsetTop={0}>
        {(lg && (
          <Dropdown
            menu={{
              items: menuItems(true, true),
            }}
            autoAdjustOverflow={false}
            placement='bottomRight'
          >
            <Avatar
              style={{
                backgroundColor: '#2c3291',
                verticalAlign: 'middle',
                marginTop: -7,
              }}
              size='large'
              src={session?.user?.user_metadata?.avatar_url ?? undefined}
            >
              <UserOutlined />
            </Avatar>
          </Dropdown>
        )) || <Button icon={<MenuOutlined />} onClick={showDrawer} />}
      </Affix>
      <ChatBox />
    </>
  );
}
