import {Helmet} from 'react-helmet-async';
import {ThemeProvider} from './theme/theme-provider';
import {AntdAdapter} from './theme/adapter/antd.adapter';
import {MotionLazy} from './components/animate/motion-lazy';
import Toast from './components/toast';

import Logo from '@/assets/images/logo.png';
import Router from './router';

function App() {
  return (
    <ThemeProvider adapters={[AntdAdapter]}>
      <MotionLazy>
        <Helmet>
          <title>React Admin</title>
          <link rel='icon' href={Logo} />
        </Helmet>
        <Toast />

        <Router />
      </MotionLazy>
    </ThemeProvider>
  );
}

export default App;
