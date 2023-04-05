import { Card, Col, Empty, Input, Row, Spin, Typography } from 'antd';
import { useSelector } from 'react-redux';
import Fader from '../Fader';
import VirtualAssistant from './VirtualAssistant';
import {
  selectCategory,
  selectRefresh,
  selectSubCategory,
} from '../../redux/slices/selections';
import { useEffect, useState } from 'react';
import useRequest from '../../hooks/useRequest';
import BookModal from './BookModal';
import { request } from '../../services/api';

const { Title } = Typography;

export default function VirtualAssistantWrapper() {
  const category = useSelector(selectCategory);
  const subCategories = useSelector(selectSubCategory);
  const refresh = useSelector(selectRefresh);
  const { loading, data, fetch } = useRequest(request);
  const [va, setVa] = useState([]);
  const [search, setSearch] = useState('');

  const isBottom = (el) => {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  };

  const fetchNow = async (page = 1) => {
    await fetch({
      path: 'public/virtual-assistants',
      data: { category, subCategories, page, search },
    });
    window.searching = false;
  };

  const trackScrolling = () => {
    const wrappedElement = document.getElementById('va-list');
    if (isBottom(wrappedElement) && !window.searching) {
      const { totalPages, currentPage } = data ?? {};
      if (currentPage < totalPages && !loading) {
        fetchNow(currentPage + 1);
      }
    }
  };

  useEffect(() => {
    setVa([]);
    fetchNow();
  }, [category, subCategories, refresh]);

  useEffect(() => {
    setVa([]);
    fetchNow();
  }, [search]);

  useEffect(() => {
    document.removeEventListener('scroll', trackScrolling);
    const { list } = data ?? {};
    const finalVa = [...va];

    if (Array.isArray(list)) {
      finalVa.push(...list);
    }

    setVa(finalVa);

    document.addEventListener('scroll', trackScrolling);
    return () => {
      document.removeEventListener('scroll', trackScrolling);
    };
  }, [data]);

  useEffect(() => {}, []);

  return (
    <Col span={24} id='va-list' style={{ paddingBottom: 60 }}>
      <Fader delay={1300}>
        <Row>
          <Col xs={24} sm={24} md={12}>
            <Title level={3} style={{ textAlign: 'left' }}>
              Pick your future virtual assistant
            </Title>
          </Col>
          <Col xs={24} sm={24} md={12} style={{ textAlign: 'right' }}>
            <Input.Search
              size='large'
              allowClear
              style={{ width: '100%', maxWidth: 500, marginTop: 20 }}
              placeholder='Search for profession / skills / experience'
              onSearch={(text) => {
                window.searching = true;
                setSearch(text);
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }} gutter={[12, 12]}>
          {(va.length < 1 && !loading && (
            <Col span={24} align='center' style={{ marginTop: 20 }}>
              <Card style={{ width: 350 }}>
                <Empty description='No virtual assistants found' />
              </Card>
            </Col>
          )) ||
            null}
          {va?.map((v) => (
            <VirtualAssistant {...v} />
          ))}
          {(loading && (
            <div align='center' style={{ width: '100%', marginTop: 20 }}>
              <Fader>
                <Spin size='large' />
              </Fader>
            </div>
          )) ||
            null}
        </Row>
      </Fader>
      <BookModal />
    </Col>
  );
}
