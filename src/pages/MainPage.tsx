import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

const MainPage = () => {
  const { userId } = useGlobalContext();
  console.log(userId);

  return <Navigate to={userId ? `/${userId}` : '/auth/login'} replace />;
};

export default MainPage;
