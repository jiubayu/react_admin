// Vanilla Extract 是一个零运行时的样式库，允许你在 TypeScript 或 JavaScript 中编写样式，并在构建时生成静态 CSS 文件
// https://juejin.cn/post/7111734321626480648
// globalStyle('html, body', {margin: 0});  => html, body {margin: 0;}
import {themeVars} from '@/theme/theme.css';
import {rgbAlpha} from '@/utils/theme';
import {globalStyle} from '@vanilla-extract/css';
import {style} from '@vanilla-extract/css';

// 你可以使用style() 函数创建一个自动范围的CSS类。你传入元素的样式，然后导出返回值。
export const chartWrapper = style({}, 'apexcharts-wrapper');

// TOOLTIP
globalStyle(`${chartWrapper} .apexcharts-tooltip`, {
  color: themeVars.colors.text.primary,
  borderRadius: themeVars.borderRadius.lg,
  backdropFilter: 'blur(6px)',
  backgroundColor: rgbAlpha(themeVars.colors.background.paperChannel, 0.8),
  boxShadow: themeVars.shadows.card,
});

globalStyle(`${chartWrapper} .apexcharts-tooltip-title`, {
  textAlign: 'center',
  fontWeight: 'bold',
  backgroundColor: themeVars.colors.background.neutral,
});

// TOOLTIP X
globalStyle(`${chartWrapper} .apexcharts-xaxistooltip`, {
  color: themeVars.colors.text.primary,
  borderRadius: themeVars.borderRadius.lg,
  backdropFilter: 'blur(6px)',
  borderColor: 'transparent',
  backgroundColor: themeVars.colors.background.paper,
  boxShadow: themeVars.shadows.card,
});

globalStyle(`${chartWrapper} .apexcharts-xaxistooltip::before`, {
  borderBottomColor: rgbAlpha(themeVars.colors.background.paperChannel, 0.8),
});

globalStyle(`${chartWrapper} .apexcharts-xaxistooltip::after`, {
  borderBottomColor: themeVars.colors.background.paper,
});

// LEGEND
globalStyle(`${chartWrapper} .apexcharts-legend`, {
  padding: 0,
});

globalStyle(`${chartWrapper} .apexcharts-legend-series`, {
  display: 'inline-flex !important',
  alignItems: 'center',
});

globalStyle(`${chartWrapper} .apexcharts-legend-text`, {
  lineHeight: '18px',
  // 它可以用于使文本显示为全大写或全小写，也可单独对每一个单词进行操作
  // capitalize 每个单词的首字母转换为大写
  textTransform: 'capitalize',
});
