import { useParams } from 'react-router-dom';
import { Profile, useGlobalContext } from '../context/GlobalContext';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProfileCard from '../components/ProfileCard';
import PostContainer from '../components/PostContainer';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

const UserPage = () => {
  const { userId } = useParams();
  const { currentUserId, currentProfile, fetchProfile, fetchImage } = useGlobalContext();
  const [profile, setProfile] = useState<Profile>({} as Profile);
  const [avatarImageSrc, setAvatarImageSrc] = useState('');
  const [editProfile, setEditProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(currentUserId);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const isCurrentUser = userId === currentUserId;

  useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile({ userId: userId!, setProfile }),
    enabled: !!userId,
  });

  useQuery({
    queryKey: ['imageSrc', profile],
    queryFn: () => fetchImage({ imageId: profile.imageId, imageParams: 'original', setImageSrc: setAvatarImageSrc }),
    enabled: !!profile,
  });

  const handlePinProfile = (profile: Profile) => {
    if (profile.userId === selectedUser) {
      setSelectedUser(currentUserId);
      setSelectedProfile(currentProfile);
      return;
    }
    !profile.isFollowed ? setSelectedProfile({ ...profile, isFollowed: true }) : setSelectedProfile(profile);
    setSelectedUser(profile.userId);
  };

  return (
    <div className="container mx-auto">
      <NavBar />
      <div className="flex pt-16">
        <div className="flex-grow overflow-y-auto ">
          <ProfileCard
            isCurrentUser={isCurrentUser}
            profile={profile}
            setProfile={setProfile}
            avatarImageSrc={avatarImageSrc}
            editProfile={editProfile}
            setEditProfile={setEditProfile}
            handlePinProfile={handlePinProfile}
          />
          <PostContainer profile={profile} avatarImageSrc={avatarImageSrc} isCurrentUser={isCurrentUser} />
        </div>
        <SideBar handlePinProfile={handlePinProfile} selectedUser={selectedUser} selectedProfile={selectedProfile} />
      </div>
    </div>
  );
};

export default UserPage;
