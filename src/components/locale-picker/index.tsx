import {Dropdown, type MenuProps} from 'antd';
import type {LocalEnum} from '#/enum';
import useLocale, {LANGUAGE_MAP} from '@/locales/useLocale';
import {IconButton, SvgIcon} from '../icon';

type Locale = keyof typeof LocalEnum;

function LocalePicker() {
  const {setLocale, locale} = useLocale();

  const localeList: MenuProps['items'] = Object.values(LANGUAGE_MAP).map(
    (item) => ({
      key: item.locale,
      label: item.label,
      icon: <SvgIcon icon={item.icon} size='20' className='rounded-md' />,
    })
  );

  return (
    <Dropdown
      placement='bottomRight'
      trigger={['click']}
      menu={{items: localeList, onClick: (e) => setLocale(e.key as Locale)}}
    >
      {/* <IconButton className='h-10 w-10 hover:scale-105'>
        <SvgIcon
          icon={`ic-locale_${locale}`}
          size='24'
          className='rounded-md'
        />
      </IconButton> */}
      <span>{locale}</span>
    </Dropdown>
  );
}

export default LocalePicker;
