import TacoSearch from '../search/TacoSearch'
import Bar from './Bar'
interface MNavBarProps {
  branding: JSX.Element
  home: JSX.Element
  profile: JSX.Element
  more: JSX.Element
}

export default function MobileNavBar ({ branding, home, profile, more }: MNavBarProps): JSX.Element {
  return (
    <header className='xl:hidden relative z-20'>
      <Bar
        className='max-w-screen-xl gap-x-2 md:px-4 py-2'
        backgroundClass={Bar.BG_DARK}
        borderBottom
      >
        <div className='hidden md:block w-12'>{branding}</div>
        <div className='md:hidden w-12'>{home}</div>

        <div className='md:pl-6 mx-auto w-full md:max-w-lg sm:max-w-md'>
          <TacoSearch />
        </div>

        <div className='hidden md:block w-12'>{profile}</div>
        <div className='w-12'>{more}</div>
      </Bar>
    </header>
  )
}
