import { useParams } from 'react-router-dom';
import Profile from '../components/Profile';
import { useGlobalContext } from '../context/GlobalContext';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

const UserPage = () => {
  const { id } = useParams();
  const { userId } = useGlobalContext();
  const isCurrentUser = id === userId;

  return (
    <div className="container mx-auto">
      <NavBar />
      <div className="flex">
        <div className="flex-grow">
          <Profile isCurrentUser={isCurrentUser} />
        </div>
        <div className="flex-none w-96">
          <SideBar />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
