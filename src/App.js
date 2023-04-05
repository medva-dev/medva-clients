import { ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Wrapper from './components/Wrapper';
import Login from './components/Login';
import Logout from './components/Logout';
import EmailConfirmation from './components/EmailConfirmation';
import GoogleLogin from './components/Google/GoogleLogin';

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#293893',
            colorError: '#FF2E63',
          },
        }}
      >
        <Routes>
          <Route path='/google-after-login' element={<GoogleLogin />} />
          <Route path='/confirm' element={<EmailConfirmation />} />
          <Route path='/login' element={<Login />} />
          <Route path='/reset-password' element={<Login />} />
          <Route path='/signup' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/appointments' element={<Wrapper />} />

          <Route path='/' element={<Wrapper />}>
            <Route path=':menu' element={<Wrapper />} />
          </Route>
        </Routes>
        {/* <Wrapper /> */}
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
