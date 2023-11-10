import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { useGlobalContext } from '../context/GlobalContext';

const NavBar = () => {
  const { myAvatarImageSrc } = useGlobalContext();

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('profile');
    localStorage.removeItem('myAvatarImageSrc');
  };

  return (
    <nav className="sticky container flex justify-between mx-auto bg-grey-lighter px-8 pt-6">
      <div>
        <Link to="/">
          <Button variant="ghost">home</Button>
        </Link>
        <Button variant="ghost">news</Button>
        <Button variant="ghost">chats</Button>
        <Button variant="ghost">notifications</Button>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8">
          <img className="w-full h-full rounded-full cursor-pointer" src={myAvatarImageSrc} alt="myAvatar" />
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
