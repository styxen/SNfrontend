import { useGlobalContext } from '../context/GlobalContext';
import { Navigate } from 'react-router-dom';

const MainPage = () => {
  const { currentUserId } = useGlobalContext();

  return <Navigate to={currentUserId ? `/${currentUserId}` : '/auth/login'} replace />;
};

export default MainPage;
