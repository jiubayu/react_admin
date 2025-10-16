import {useMemo} from 'react';
import {useNavigate} from 'react-router';

export function useRouter() {
  const navigate = useNavigate();
  // 所有的路由处理都是通过useRouter进行跳转，所以可以监听到路由的变化
  const router = useMemo(
    () => ({
      back: () => navigate(-1),
      forward: () => navigate(1),
      reload: () => window.location.reload(),
      push: (path: string) => navigate(path),
      replace: (path: string) => navigate(path, {replace: true}),
    }),
    [navigate]
  );
  return router;
}