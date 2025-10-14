import {themeVars} from '@/theme/theme.css';
import {Tabs, Typography, type TabsProps} from 'antd';
import Inview from './views/inview';
import ScrollView from './views/scroll';
import BackgroundView from './views/background';

export default function AnimatePage() {
  const TABS: TabsProps['items'] = [
    {key: 'inview', label: 'In View', children: <Inview />},
    {key: 'scroll', label: 'Scroll', children: <ScrollView />},
    {key: 'background', label: 'Background', children: <BackgroundView />},
  ];
  return (
    <>
      <Typography.Link
        href='https://www.framer.com/motion/'
        style={{color: themeVars.colors.palette.primary.default}}
        className='mb-4 block'
      >
        https://www.framer.com/motion/
      </Typography.Link>
      <Tabs items={TABS} type='card' />
    </>
  );
}
