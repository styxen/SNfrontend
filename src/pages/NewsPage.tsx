import { useState } from 'react';
import NavBar from '../components/NavBar';
import NewsPostContaiener from '../components/NewsPostContaiener';
import SideBar from '../components/SideBar';
import { Profile, useGlobalContext } from '../context/GlobalContext';

const NewsPage = () => {
  const { currentUserId, currentProfile } = useGlobalContext();
  const [selectedUser, setSelectedUser] = useState(currentUserId);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

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
          <NewsPostContaiener />
        </div>
        <SideBar handlePinProfile={handlePinProfile} selectedUser={selectedUser} selectedProfile={selectedProfile} />
      </div>
    </div>
  );
};

export default NewsPage;
