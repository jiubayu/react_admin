import {useEffect} from 'react';

export default function ProgressBar() {
  useEffect(() => {
    let lastHref = window.location.href;

    const handleRouteChange = () => {
      NProgress();
    };
  }, []);
}
