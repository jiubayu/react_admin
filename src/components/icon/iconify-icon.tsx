// Iconify 为几种流行的 UI 框架提供原生图标组件
// 一种语法适用于 150 多个图标集的 200,000 多个图标。
// 渲染 SVG。许多组件仅渲染图标字体，看起来很丑陋。Iconify 仅使用像素完美的 SVG。
// 按需加载图标。无需捆绑图标，组件将自动从 Iconify API 加载您使用的图标数据
// 简单使用:Icon icon="ant-design:account-book-filled" />
import {Icon, disableCache} from '@iconify/react';

import styled from 'styled-components';

import type {IconProps} from '@iconify/react';

interface Props extends IconProps {
  size?: IconProps['width'];
}
export default function Iconify({
  icon,
  size = '1em',
  className = '',
  ...other
}: Props) {
  return (
    <StyledIconify className='anticon'>
      {/* 然后使用Icon组件，以图标名称作为图标参数 <Icon icon='mdi-light:home' /> */}
      <Icon
        icon={icon}
        width={size}
        height={size}
        className={`m-auto ${className}`}
        {...other}
      />
    </StyledIconify>
  );
}

disableCache('local');
const StyledIconify = styled.div`
  display: inline-flex;
  vertical-align: middle;
  svg {
    display: inline-block;
  }
`;
