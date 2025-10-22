// Framer是世界上最好的无需代码的网站构建器 https://motion.net.cn/docs/framer
import {LazyMotion, domMax, m} from 'framer-motion';

type Props = {
  children: React.ReactNode;
};
/**
 * [Reduce bundle size by lazy-loading a subset of Motion's features](https://www.framer.com/motion/lazy-motion/)
 */
export function MotionLazy({children}: Props) {
  return (
    <LazyMotion strict features={domMax}>
      <m.div style={{height: '100%'}}> {children} </m.div>
    </LazyMotion>
  );
}
