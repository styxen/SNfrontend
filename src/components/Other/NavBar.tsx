import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { useGlobalContext } from '../../context/GlobalContext';
import { Bell, PanelRightOpen } from 'lucide-react';
import useImage from '../../hooks/useImage';
import { useEffect, useState } from 'react';

type NavBarProps = {
  openSidebar: () => void;
};

const NavBar = ({ openSidebar }: NavBarProps) => {
  const { currentProfile, token } = useGlobalContext();
  const [isButtonHidden, setIsButtonHidden] = useState(true);

  const {
    data: avatarImageSrc,
    isLoading: isAvatarImageSrcLoading,
    isSuccess: isAvatarImageSrcSuccsess,
  } = useImage({ imageId: currentProfile?.imageId ?? null, imageParams: 'original', token });

  const logOut = () => {
    ['token', 'userId', 'profile'].map((item) => localStorage.removeItem(item));
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      setIsButtonHidden(screenWidth >= 1000);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav className="container fixed z-20 mx-auto flex justify-between rounded-b-2xl bg-white px-8 py-3">
      <div>
        <Link to="/">
          <Button variant="ghost">home</Button>
        </Link>
        <Link to="/news">
          <Button variant="ghost">news</Button>
        </Link>
        <Link to="/chats/">
          <Button variant="ghost">chats</Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="rounded-full px-2 py-1">
          <Bell />
        </Button>
        {isAvatarImageSrcLoading ? <div>Image is loading...</div> : null}
        {isAvatarImageSrcSuccsess ? (
          <Link to="/">
            <div className="h-8 w-8">
              <img className="h-full w-full cursor-pointer rounded-full" src={avatarImageSrc} alt="myAvatar" />
            </div>
          </Link>
        ) : null}
        <Link to="/auth/login">
          <Button onClick={logOut} variant="ghost">
            log out
          </Button>
        </Link>
        <Button className={`${isButtonHidden ? 'hidden' : 'flex'}`} onClick={openSidebar} variant="ghost">
          <PanelRightOpen />
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
