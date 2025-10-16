import {useRouter} from '@/router/hooks';
import {useLayoutEffect} from 'react';

type Props = {
  src: string;
};

function ExternalLink({src}: Props) {
  const {back} = useRouter();
  useLayoutEffect(() => {
    window.open(src, '_black');
    back();
  });
  return <div />;
}

export default ExternalLink;
