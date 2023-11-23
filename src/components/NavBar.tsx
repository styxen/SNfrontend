import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { useGlobalContext } from '../context/GlobalContext';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const NavBar = () => {
  const { currentProfile, fetchImage } = useGlobalContext();
  const [avatarImageSrc, setAvatarImageSrc] = useState('');

  useQuery({
    queryKey: ['navbarAvatarImageSrc', { currentProfile }],
    queryFn: () => fetchImage({ imageId: currentProfile.imageId, imageParams: 'original', setImageSrc: setAvatarImageSrc }),
    enabled: !!currentProfile,
  });

  const logOut = () => {
    ['token', 'userId', 'profile', 'avatarImageSrc'].map((item) => localStorage.removeItem(item));
  };

  return (
    <nav className="container fixed z-50 mx-auto flex justify-between rounded-b-2xl bg-white px-8 py-3">
      <div>
        <Link to="/">
          <Button variant="ghost">home</Button>
        </Link>
        <Link to="/news">
          <Button variant="ghost">news</Button>
        </Link>
        <Button variant="ghost">chats</Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="rounded-full px-2 py-1">
          <Bell />
        </Button>
        <div className="h-8 w-8">
          <img className="h-full w-full cursor-pointer rounded-full" src={avatarImageSrc} alt="myAvatar" />
        </div>
        <Link to="/auth/login">
          <Button onClick={logOut} variant="ghost">
            log out
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
