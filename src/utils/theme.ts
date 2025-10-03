import color from 'color';
import {themeTokens} from '../theme/type';

/**
 * @example
 * const rgb = rgbAlpha("#000000", 0.24);
 * console.log(rgb); // "rgba(0, 0, 0, 0.24)"
 *
 * const rgb = rgbAlpha("var(--colors-palette-primary-main)", 0.24);
 * console.log(rgb); // "rgba(var(--colors-palette-primary-main), 0.24)"
 *
 * const rgb = rgbAlpha("rgb(var(--colors-palette-primary-main))", 0.24);
 * console.log(rgb); // "rgba(rgb(var(--colors-palette-primary-main)), 0.24)"
 *
 * const rgb = rgbAlpha([200, 250, 214], 0.24);
 * console.log(rgb); // "rgba(200, 250, 214, 0.24)"
 */
export function rgbAlpha(
  color: string | string[] | number[],
  alpha: number
): string {
  // ensure alpha value is between 0-1
  const safeAlpha = Math.max(0, Math.min(1, alpha));

  // if color is CSS variable
  if (typeof color === 'string') {
    if (color.startsWith('#')) {
      return `rgba(${hexToRgbChannel(color)}, ${safeAlpha})`;
    }
    if (color.includes('var(')) {
      return `rgba(${color}, ${safeAlpha})`;
    }
    if (color.startsWith('--')) {
      return `rgba(var(${color}), ${safeAlpha})`;
    }

    // handle "200, 250, 214" or "200 250 214" format
    if (color.includes(',') || color.includes(' ')) {
      const rgb = color.split(/[,\s]+/).map((n) => n.trim());
      return `rgba(${rgb.join(', ')}, ${safeAlpha})`;
    }
  }

  // handle array format [200, 250, 214]
  if (Array.isArray(color)) {
    return `rgba(${color.join(', ')}, ${safeAlpha})`;
  }

  throw new Error('Invalid color format');
}
/**
 * @example
 * const rgbChannel = hexToRgbChannel("#000000");
 * console.log(rgbChannel); // "0, 0, 0"
 */
export const hexToRgbChannel = (hex: string) => {
  const rgb = color(hex).rgb().array();
  return rgb.join(',');
};

/**
 * convert to CSS vars
 * @param propertyPath example: `colors.palette.primary`
 * @returns example: `--colors-palette-primary`
 */
export const toCssVar = (propertyPath: string) => {
  return `--${propertyPath.split('.').join('-')}`;
};

/**
 * convert to CSS vars
 * @param propertyPath example: `colors.palette.primary`
 * @returns
 * ```js
 * {
 *   lighter: "var(--colors-palette-primary-lighter)",
 *   light: "var(--colors-palette-primary-light)",
 *   main: "rgb(var(--colors-palette-primary-main))",
 *   dark: "rgb(var(--colors-palette-primary-dark))",
 *   darker: "rgb(var(--colors-palette-primary-darker))"
 * }
 * ```
 */
export const toCssVars = (propertyPath: string) => {
  const variants = getThemeTokenVariants(propertyPath);
  const result = variants.reduce((acc, variant) => {
    const variantKey = variant === 'default' ? 'DEFAULT' : variant;
    acc[variantKey] = `var(${toCssVar(`${propertyPath}-${variant}`)})`;
    return acc;
  }, {} as Record<string, string>);
  return result;
};

/**
 * get variants in {@link themeTokens}
 * @param propertyPath example: `colors.palette.primary`
 * @returns example: `["lighter", "light", "main", "dark", "darker"]`
 */
export const getThemeTokenVariants = (propertyPath: string) => {
  const keys = propertyPath.split('.');
  const val = keys.reduce((obj: any, key) => {
    if (obj && typeof obj === 'object') {
      return obj[key];
    }
    return;
  }, themeTokens);

  return val ? Object.keys(val) : [];
};

/**
 * remove px unit
 * @param value example: "16px"
 * @returns example: 16
 */
/**
 * remove px unit and convert to number
 * @param value example: "16px", "16.5px", "-16px", "16", 16
 * @returns example: 16, 16.5, -16, 16, 16
 * @throws Error if value is invalid
 */
export const removePx = (value: string | number): number => {
  // 如果已经是数字，直接返回
  if (typeof value === 'number') return value;

  // 如果是空字符串，抛出错误
  if (!value) {
    throw new Error('Invalid value: empty string');
  }

  // 移除所有的空格
  const trimmed = value.trim();

  // 检查是否以px结尾，不区分大小写
  const hasPx = /px$/i.test(trimmed);

  // 提取数字部分
  const num = hasPx ? trimmed.slice(0, -2) : trimmed;

  // 转换为数字
  // Number （1）如果是Boolean值，true和false将分别转换为1和0
  // （2）如果是数字值，只是简单的传入和返回 （3）如果是null值，返回0。（4）如果是undefined,返回NaN。
  // （5）如果是字符串，遵循下列规则： 如果字符串截去开头和结尾的空白字符后，不是纯数字字符串，那么最终返回结果为NaN。
  // parseInt （1）如果第一个字符不是数字字符或者负号，parseInt()就会返回NaN;
  //  （2）如果第一个字符是数字字符，parseInt()会继续解析第二个字符，直到解析完所有后续字符或者遇到了一个非数字字符。
  //  （3）如果字符串以”0x”开头且后跟数字字符，就会将其当作一个十六进制整数。以”0”开头且后跟数字字符，就会将其当作一个八进制整数。
  //  （4）parseInt()函数增加了第二参数用于指定转换时使用的基数（即多少进制）。
  //  （5）当parseInt()函数所解析的是浮点数字符串时，取整操作所使用的方法为“向下取整”。
  // parseFloat 与parseInt()一样，parseFloat()也可以解析以数字开头的部分数字字符串(非数字部分字符串在转换过程中会被去除)。
  // （1）与parseInt()不同的是，parseFloat()可以将字符串转换成浮点数；但同时，parseFloat()只接受一个参数，且仅能处理10进制字符串。
  // （2）字符串中的第一个小数点是有效的，而第二个小数点就是无效的了，因此它后面的字符串将被忽略。
  // （3）如果字符串包含的是一个可解析为整数的数（没有小数点，或者小数点后面都是零），parseFloat()会返回整数。
  const result = Number.parseFloat(num);

  // 验证结果是否为有效数字
  // 经过parseFloat处理后，如果result是NaN，那么表明value是无效的
  if (Number.isNaN(result)) {
    throw new Error(`Invalid value: ${value}`);
  }

  return result;
};
