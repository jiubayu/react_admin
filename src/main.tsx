import {Suspense} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
// helmet
import {HelmetProvider} from 'react-helmet-async';
// vercel analytics
import {Analytics} from '@vercel/analytics/react';
// svg icons
import 'virtual:svg-icons-register';

import ProgressBar from './components/progress-bar';
import worker from './_mock';
import App from './App';

// i18n
import './locales/i18n';
// css
import './global.css';
import './theme/theme.css';

const charAt = `
    ███████╗██╗      █████╗ ███████╗██╗  ██╗ 
    ██╔════╝██║     ██╔══██╗██╔════╝██║  ██║
    ███████╗██║     ███████║███████╗███████║
    ╚════██║██║     ██╔══██║╚════██║██╔══██║
    ███████║███████╗██║  ██║███████║██║  ██║
    ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
  `;
console.info(`%c${charAt}`, 'color: #5BE49B');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <HelmetProvider>
    <QueryClientProvider client={new QueryClient()}>
      <Suspense>
        <ProgressBar />
        {/* Vercel Analytics 是 Vercel 提供的分析统计功能，如果你使用 Vercel
        部署你的网站，那么可以很方便地使用 Vercel 自带的分析统计功能 */}
        <Analytics />
      </Suspense>
    </QueryClientProvider>
  </HelmetProvider>
);

// start service worker mock in development
// 指定如何处理未匹配的请求
// bypass：不打印任何内容，按原样执行请求 warn：打印警告但按原样执行请求。  error：打印错误并停止请求执行。
worker.start({onUnhandledRequest: 'bypass'});
