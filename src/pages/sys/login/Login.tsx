import {Dropdown, Layout, Typography} from 'antd';
import {useUserToken} from '@/store/userStore';
import {themeVars} from '@/theme/theme.css';
import {rgbAlpha} from '@/utils/theme';
import {useTranslation} from 'react-i18next';
import {Navigate} from 'react-router';
import Overlay from '@/assets/images/background/overlay.jpg';
import DashboardImg from '@/assets/images/background/dashboard.png';

import {LoginStateProvider} from './providers/LoginStateProvider';
import SettingButton from '@/layouts/_common/setting-button';
import LocalePicker from '@/components/locale-picker';

import LoginForm from './LoginForm';
import MobileForm from './MobileForm';
import QrCodeForm from './QrcodeForm';
import RegisterForm from './RegisterForm';
import ResetForm from './ResetForm';
// /dashboard/workbench
import {HOMEPAGE} from '@/consts/global';

const gradientBg = rgbAlpha(themeVars.colors.background.defaultChannel, 0.9);
const bg = `linear-gradient(${gradientBg}, ${gradientBg}) center center / cover no-repeat, url(${Overlay})`;

function Login() {
  const {t} = useTranslation();
  const token = useUserToken();

  // 判断用户是否有权限
  if (token.accessToken) {
    // 有权限，则跳转到主页
    return <Navigate to={HOMEPAGE} replace />;
  }

  return (
    <Layout className='relative flex !min-h-screen !w-full !flex-row'>
      <div
        className='hidden grow flex-col items-center justify-center gap-[80px] bg-center bg-no-repeat md:flex'
        style={{background: bg}}
      >
        <div className='text-3xl font-bold leading-normal lg:text-4xl xl:text-5xl'>
          React Admin
        </div>
        <img
          className='max-w-[480px] xl:max-w-[560px]'
          src={DashboardImg}
          alt=''
        />
        <Typography.Title className='flex flex-row gap-16 text-2xl'>
          {t('sys.login.signInSecondTitle')}
        </Typography.Title>
      </div>

      <div className='m-auto flex !h-screen w-full max-w-[480px] flex-col items-center justify-center px=[16px] lg:px-[64px]'>
        {/* 提供了这三个属性和方法 loginState, setLoginState, backToLogin */}
        <LoginStateProvider>
          <LoginForm />
          <MobileForm />
          <QrCodeForm />
          <RegisterForm />
          <ResetForm />
        </LoginStateProvider>
      </div>

      <div className='absolute right-2 top-0 flex flex-row'>
        <LocalePicker />
        <SettingButton />
      </div>
    </Layout>
  );
}

export default Login;
