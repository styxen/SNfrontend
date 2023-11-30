import { useParams } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { useQuery } from '@tanstack/react-query';
import ProfileCard from '../components/Profile/ProfileCard';
import PostContainer from '../components/Post/PostsContainer';
import NavBar from '../components/Other/NavBar';
import SideBar from '../components/SideBar/SideBar';
import { useState } from 'react';

export type ModalData = {
  isOpen: boolean;
  item: 'post' | 'comment' | 'message' | 'accaunt';
  handleDelete?: () => void;
};

const UserPage = () => {
  const { userId } = useParams();
  const { currentUserId, fetchProfile } = useGlobalContext();
  const [isSideBarOpen, setIsSidebarOpen] = useState(false);
  const isCurrentUser = userId === currentUserId;

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

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
      <NavBar openSidebar={openSidebar} />
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
        <SideBar isSideBarOpen={isSideBarOpen} closeSidebar={closeSidebar} />
      </div>
    </div>
  );
};

export default UserPage;
