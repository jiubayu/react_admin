import { ThemeProvider } from './theme/';
import {AntdAdapter} from './theme/adapter/antd.adapter';
import { MotionLazy } from './components/animate/motion-lazy';

function App() {
  return (
    <ThemeProvider adapters={[AntdAdapter]}>
      <MotionLazy></MotionLazy>
    </ThemeProvider>
  );
}

export default App;
