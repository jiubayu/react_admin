import HeaderSimple from '../_common/header-simple';
type Props = {
  children: React.ReactNode;
};

export default function SampleLayout({children}: Props) {
  return (
    <div className='flex h-screen w-full flex-col text-text-base bg-bg'>
      <HeaderSimple />
      {children}
    </div>
  );
}
