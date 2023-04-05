import classNames from 'classnames';
import { Card, Col, Row, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import Medical from '../../assets/images/medical.svg';
import Dental from '../../assets/images/dental.svg';
import Fader from '../Fader';
import { selectCategory, setCategory } from '../../redux/slices/selections';
import Selected from './Selected';
import { useEffect } from 'react';
import store from '../../redux/store';

const { Title } = Typography;

export default function CategoryPicker() {
  const dispatch = useDispatch();
  const category = useSelector(selectCategory);

  const changeCategory = (cat) => {
    const currentCategory = store.getState().selections?.category;
    if (currentCategory === cat) {
      // deselect
      cat = undefined;
    }
    dispatch(setCategory(cat));
  };

  useEffect(() => {
    if (category) {
      const subCategory = document.getElementById('subCategory');
      if (subCategory) {
        const dimensions = subCategory.getBoundingClientRect();
        window.scrollTo({
          left: window.scrollX,
          top: dimensions.top - 100,
          behavior: 'smooth',
        });
      }
    }
  }, [category]);

  return (
    <Col span={24}>
      <Fader delay={1300}>
        <Row style={{}} gutter={[12, 12]} align='middle' justify='center'>
          <Col xs={12} sm={12} md={8} lg={6}>
            <Card
              className={classNames('card-va-type', {
                selected: category === 'medical',
              })}
              onClick={() => changeCategory('medical')}
            >
              <Selected show={category === 'medical'} />
              <div>
                <img
                  alt='Medical'
                  src={Medical}
                  style={{
                    height: '200px',
                    maxWidth: '80%',
                    margin: 'auto',
                  }}
                />
              </div>
              <div>
                <Title level={4}>Medical</Title>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={8} lg={6}>
            <Card
              className={classNames('card-va-type', {
                selected: category === 'dental',
              })}
              onClick={() => changeCategory('dental')}
            >
              <Selected show={category === 'dental'} />
              <div>
                <img
                  alt='Dental'
                  src={Dental}
                  style={{
                    height: '200px',
                    maxWidth: '80%',
                    margin: 'auto',
                  }}
                />
              </div>
              <div>
                <Title level={4}>Dental</Title>
              </div>
            </Card>
          </Col>
        </Row>
      </Fader>
    </Col>
  );
}
