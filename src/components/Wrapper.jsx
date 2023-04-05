import { Layout } from 'antd';
import Header from './Header';
import Content from './Content';
// const { Footer, Sider } = Layout;

export default function Wrapper() {
  return (
    <Layout>
      <Header />
      <Content />
      {/* <Footer id='footer' /> */}
    </Layout>
  );
}
