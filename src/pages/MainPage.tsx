import { useQuery } from '@tanstack/react-query';
import { useGlobalContext } from '../context/GlobalContext';
import { Navigate } from 'react-router-dom';

const MainPage = () => {
  const { setCurrentProfile, setCurrentAvatarImageSrc, currentUserId, currentProfile, fetchProfile, fetchImage } = useGlobalContext();

  useQuery({
    queryKey: ['currentProfile', { currentUserId }],
    queryFn: () => fetchProfile({ userId: currentUserId, setProfile: setCurrentProfile }),
    enabled: !!currentUserId,
  });

  useQuery({
    queryKey: ['currentImageSrc', { currentProfile }],
    queryFn: () => fetchImage({ imageId: currentProfile.imageId, imageParams: 'original', setImageSrc: setCurrentAvatarImageSrc }),
    enabled: !!currentProfile,
  });

  return <Navigate to={currentUserId ? `/${currentUserId}` : '/auth/login'} replace />;
};

export default MainPage;
