import classNames from 'classnames';
import { Card, Col, Row, Typography } from 'antd';
import Scribe from '../../assets/images/scribe.svg';
import Admin from '../../assets/images/admin.svg';
import Biller from '../../assets/images/biller.svg';
import Receptionist from '../../assets/images/receptionist.svg';
import Fader from '../Fader';
import store from '../../redux/store';
import {
  selectSubCategory,
  setSubCategory,
} from '../../redux/slices/selections';
import { useSelector } from 'react-redux';
import Selected from './Selected';
import { useEffect } from 'react';
const { Title, Text } = Typography;

export default function SubCategoryPicker() {
  const subCategories = useSelector(selectSubCategory);
  const addSubCategorySelection = (cat) => {
    const selections = store.getState().selections.subCategory;
    let currentlySelected = false;
    if (selections?.[cat] === true) {
      currentlySelected = true;
    }

    store.dispatch(
      setSubCategory({ subCategory: cat, selected: !currentlySelected })
    );
  };

  useEffect(() => {
    let hasSelection = false;
    Object.values(subCategories || {}).forEach((val) => {
      if (val === true) {
        hasSelection = true;
      }
    });

    if (hasSelection) {
      const list = document.getElementById('va-list');
      if (list) {
        const dimensions = list.getBoundingClientRect();
        window.scrollTo({
          left: window.scrollX,
          top: dimensions.top - 100,
          behavior: 'smooth',
        });
      }
    }
  }, [subCategories]);

  return (
    <>
      <Col span={24} align='center'>
        <Fader>
          <Text type='secondary' id='subCategory'>
            Which type of virtual assistant do you need?
          </Text>
        </Fader>
      </Col>
      <Col span={24}>
        <Fader delay={1300}>
          <Row style={{}} gutter={[12, 12]}>
            <Col xs={12} sm={12} md={6}>
              <Card
                className={classNames('card-va-type', {
                  selected: subCategories?.['admin'] === true,
                })}
                onClick={() => addSubCategorySelection('admin')}
              >
                <Selected show={subCategories?.['admin'] === true} />
                <div>
                  <img
                    alt='Admin'
                    src={Admin}
                    style={{
                      height: '200px',
                      maxWidth: '80%',
                      margin: 'auto',
                    }}
                  />
                </div>
                <div>
                  <Title level={4}>Admin</Title>
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card
                className={classNames('card-va-type', {
                  selected: subCategories?.['biller'] === true,
                })}
                onClick={() => addSubCategorySelection('biller')}
              >
                <Selected show={subCategories?.['biller'] === true} />
                <div>
                  <img
                    alt='Biller'
                    src={Biller}
                    style={{
                      height: '200px',
                      maxWidth: '90%',
                      margin: 'auto',
                    }}
                  />
                </div>
                <div>
                  <Title level={4}>Biller</Title>
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card
                className={classNames('card-va-type', {
                  selected: subCategories?.['scribe'] === true,
                })}
                onClick={() => addSubCategorySelection('scribe')}
              >
                <Selected show={subCategories?.['scribe'] === true} />
                <div>
                  <img
                    alt='Scribe'
                    src={Scribe}
                    style={{
                      height: '200px',
                      maxWidth: '90%',
                      margin: 'auto',
                    }}
                  />
                </div>
                <div>
                  <Title level={4}>Scribe</Title>
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card
                className={classNames('card-va-type', {
                  selected: subCategories?.['receptionist'] === true,
                })}
                onClick={() => addSubCategorySelection('receptionist')}
              >
                <Selected show={subCategories?.['receptionist'] === true} />
                <div>
                  <img
                    alt='Receptionist'
                    src={Receptionist}
                    style={{
                      height: '200px',
                      maxWidth: '90%',
                      margin: 'auto',
                    }}
                  />
                </div>
                <div>
                  <Title level={4} ellipsis>
                    Receptionist
                  </Title>
                </div>
              </Card>
            </Col>
          </Row>
        </Fader>
      </Col>
    </>
  );
}
