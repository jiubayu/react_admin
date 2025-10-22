// Slim progress bars for Ajax'y applications. Inspired by Google, YouTube, and Medium.
// 优雅的页面加载进度条 https://awesometop.cn/posts/ee30009b2af4433ca3963569407c1432
import NProgress from 'nprogress';
import {useEffect} from 'react';

export default function ProgressBar() {
  useEffect(() => {
    let lastHref = window.location.href;

    const handleRouteChange = () => {
      NProgress.start();
      const timer = setTimeout(() => NProgress.done(), 1000);

      return () => {
        clearTimeout(timer);
        NProgress.done();
      };
    };

    // 监听href变化
    const observer = new MutationObserver(() => {
      const currentHref = window.location.href;
      if (currentHref !== lastHref) {
        lastHref = currentHref;
        handleRouteChange();
      }
    });

    // 监听整个文档的变化
    observer.observe(document, {
      childList: true,
      subtree: true,
    });

    // 监听popstate事件(处理浏览器前进后退)
    window.addEventListener('popstate', handleRouteChange);

    // 初始时加载一次
    handleRouteChange();

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
