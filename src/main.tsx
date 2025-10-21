import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import ProgressBar from './components/progress-bar';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <HelmetProvider>
    <QueryClientProvider client={new QueryClient()}>
      <Suspense>
        <ProgressBar/>
      </Suspense>
    </QueryClientProvider>
  </HelmetProvider>
);
