// 使用 clsx，我们可以轻松地构建组件的类名。
// const className = clsx('user-card', {
//   highlighted: highlighted,
//   disabled: disabled,
//   normal: !highlighted && !disabled,
// });
import { clsx, type ClassValue } from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
