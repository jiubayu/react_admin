import {NavLink} from 'react-router';
import {useTheme} from '@/theme/hooks';

import {Iconify} from '../icon';

interface Props {
  size?: number | string;
}

function Logo({size = 50}: Props) {
  const {themeTokens} = useTheme();
  return (
    <NavLink to='/'>
      <Iconify
        icon='solar:code-square-bold'
        size={size}
        color={themeTokens.color.palette.primary.default}
      />
    </NavLink>
  );
}

export default Logo;
