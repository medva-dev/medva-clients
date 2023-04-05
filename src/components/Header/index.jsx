import { Affix, Button, Col, Drawer, Layout, Menu, Row, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  BookOutlined,
  CalendarOutlined,
  LogoutOutlined,
  MessageOutlined,
  SearchOutlined,
  SettingOutlined,
  ShareAltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import logo from '../../assets/images/logo.png';
import Fader from '../Fader';
import {
  selectDrawer,
  selectSession,
  setDrawer,
} from '../../redux/slices/user';
import User from './User';
import { Link, useNavigate } from 'react-router-dom';

export const menuItems = (logout = true, minimized = false) => {
  const menu = [];

  if (!minimized) {
    menu.push(
      ...[
        {
          label: <Link to='/'>Find VAs</Link>,
          key: 'home',
          icon: <SearchOutlined />,
        },
        {
          label: <Link to='/appointments'>Appointments</Link>,
          key: 'appointments',
          icon: <CalendarOutlined />,
        },
        {
          label: <Link to='/invoices'>Invoices</Link>,
          key: 'invoices',
          icon: <BookOutlined />,
        },
        {
          label: <Link to='/refer'>Refer a colleague</Link>,
          key: 'refer',
          icon: <ShareAltOutlined />,
        },
        {
          label: <Link to='/support'>Support</Link>,
          key: 'support',
          icon: <MessageOutlined />,
        },
        // {
        //   label: 'Hired VAs',
        //   key: 'vas',
        //   icon: <UserOutlined />,
        //   disabled: true,
        // },
      ]
    );
  }

  if (logout) {
    // menu.push({
    //   label: 'Settings',
    //   key: 'account',
    //   icon: <SettingOutlined />,
    //   disabled: true,
    // });
    menu.push({
      key: 'logout',
      danger: true,
      label: <Link to='/logout'>Logout</Link>,
      icon: <LogoutOutlined />,
    });
  }

  return menu;
};

const { Header: AntdHeader } = Layout;

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const session = useSelector(selectSession);
  const drawer = useSelector(selectDrawer);

  const closeDrawer = () => {
    dispatch(setDrawer(false));
  };

  const menuClicked = ({ key }) => {
    closeDrawer();
    console.log({ key });
    if (key === 'appointments') {
      navigate('/appointments');
    } else if (key === 'invoices') {
      navigate('/invoices');
    } else if (key === 'home') {
      navigate('/');
    } else if (key === 'logout') {
      navigate('/logout');
    }
  };

  return (
    <>
      <Drawer
        title={null}
        open={drawer}
        placement='left'
        onClose={closeDrawer}
        width={300}
        closable={false}
      >
        <Menu
          onClick={menuClicked}
          style={{ width: 260, borderRight: 0 }}
          items={menuItems()}
        />
      </Drawer>
      <Affix>
        <AntdHeader
          style={{
            backgroundColor: '#fff',
            borderBottom: '0.5px solid rgb(0,0,0,0.1)',
            padding: 0,
            maxHeight: '100px',
            minWidth: '350px',
          }}
        >
          <Fader>
            <div
              style={{
                width: '100%',
                margin: 'auto',
                maxWidth: 1400,
                padding: 10,
                paddingLeft: 15,
              }}
            >
              <div
                style={{
                  float: 'left',
                  marginTop: 3,
                  width: '100%',
                }}
              >
                <Row>
                  <Col xs={12} sm={12} md={5} lg={4}>
                    <a href='/' title='MedVA'>
                      <img
                        alt='MedVA'
                        src={logo}
                        style={{ height: '35px', margin: 'auto' }}
                      />
                    </a>
                  </Col>
                  <Col xs={0} sm={0} md={0} lg={18}>
                    {(session && (
                      <Menu
                        mode='horizontal'
                        items={menuItems(false)}
                        style={{
                          marginTop: -14,
                          width: '100%',
                          backgroundColor: 'transparent',
                        }}
                      />
                    )) ||
                      null}
                  </Col>
                  <Col xs={12} sm={12} md={19} lg={2}>
                    <div
                      style={{
                        float: 'right',
                        height: '100%',
                        marginTop: -13,
                      }}
                    >
                      {(!session && (
                        <Space>
                          <Button
                            type='primary'
                            ghost
                            onClick={() => {
                              window.location.href = '/signup';
                            }}
                          >
                            Signup
                          </Button>
                          <Button
                            type='primary'
                            onClick={() => {
                              window.location.href = '/login';
                            }}
                          >
                            Login
                          </Button>
                        </Space>
                      )) || <User />}
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Fader>
        </AntdHeader>
      </Affix>
    </>
  );
}
