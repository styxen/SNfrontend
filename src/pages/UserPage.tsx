import { useParams } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { useQuery } from '@tanstack/react-query';
import ProfileCard from '../components/ProfileCard';
import PostContainer from '../components/PostsContainer';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

const UserPage = () => {
  const { userId } = useParams();
  const { currentUserId, fetchProfile } = useGlobalContext();
  const isCurrentUser = userId === currentUserId;

  const {
    data: profile,
    isLoading: isProfileLoading,
    isSuccess: isProfileSuccsess,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile({ userId: userId! }),
    enabled: !!userId,
  });

  return (
    <div className="container mx-auto">
      <NavBar />
      <div className="flex pt-16">
        <div className="flex-grow overflow-y-auto ">
          {isProfileLoading ? <div>Profile is loading...</div> : null}
          {isProfileSuccsess ? (
            <>
              <ProfileCard isCurrentUser={isCurrentUser} profile={profile} refetchProfile={refetchProfile} />
              <PostContainer userId={profile.userId} isCurrentUser={isCurrentUser} />
            </>
          ) : null}
        </div>
        <SideBar />
      </div>
    </div>
  );
};

export default UserPage;
