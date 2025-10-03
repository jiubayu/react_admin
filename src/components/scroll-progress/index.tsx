// 一个功能强大且易于使用的动画库 Framer Motion
// Framer Motion 的核心组件是 motion。你可以通过将普通的 HTML 元素（如 div、span 等）替换为 motion.div、motion.span 等来启用动画。
// initial={{ opacity: 0 }} // 初始状态
// animate={{ opacity: 1 }} // 动画状态
// exit={{ opacity: 0 }} // 退出状态
// transition={{ duration: 0.5 }} // 动画时长
import {
  type HTMLMotionProps,
  type MotionValue,
  m,
  useSpring,
} from 'framer-motion';
import type {CSSProperties} from 'react';

import {useTheme} from '@/theme/hooks';

interface Props extends HTMLMotionProps<'div'> {
  color?: string;
  scrollYProgress: MotionValue<number>;
  height?: number;
}
/**
 * https://www.framer.com/motion/scroll-animations/##spring-smoothing
 */
export default function ScrollProgress({
  scrollYProgress,
  height = 4,
  color,
  ...other
}: Props) {
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const {themeTokens} = useTheme();

  const backgroundColor = color || themeTokens.color.palette.primary.default;

  const style: CSSProperties = {
    transformOrigin: '0%',
    height,
    backgroundColor,
  };

  return <m.div style={{scaleX, ...style}} {...other} />;
}
