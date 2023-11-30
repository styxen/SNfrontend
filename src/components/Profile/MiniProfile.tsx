import { useState } from 'react';
import { Profile, useGlobalContext } from '../../context/GlobalContext';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { Pin, PinOff } from 'lucide-react';
import useImage from '../../hooks/useImage';

type MiniProfileProps = {
  profile: Profile;
  handlePinProfile: (profile: Profile) => void;
  selectedUser: string;
};

const MiniProfile = ({ profile, handlePinProfile, selectedUser }: MiniProfileProps) => {
  const { currentUserId, token } = useGlobalContext();
  const { profileId, profileName, userId, imageId, isFollowed } = profile;
  const [isHovered, setIsHoverd] = useState(false);

  const {
    data: avatarImageSrc,
    isLoading: isAvatarImageSrcLoading,
    isSuccess: isAvatarImageSrcSuccsess,
  } = useImage({ imageId, imageParams: 'compressed', token });

  return (
    <div
      onMouseOver={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
      key={profileId}
      className="relative flex w-full items-center gap-2 rounded-full bg-gray-100 p-1"
    >
      {isAvatarImageSrcLoading ? (
        <div>Image is loading...</div>
      ) : isAvatarImageSrcSuccsess ? (
        <Link to={`/${userId}`} replace>
          <img className="h-16 w-16 cursor-pointer rounded-full border-4 border-white" src={avatarImageSrc} alt="avatar" />
        </Link>
      ) : null}
      <div className="flex flex-col gap-0">
        <Link to={`/${userId}`} replace>
          <h3 className="cursor-pointer text-left font-serif text-2xl">{profileName}</h3>
        </Link>
        {userId === currentUserId ? (
          <span className="font-sans text-gray-600">me</span>
        ) : (
          <span className={`font-sans ${isFollowed ? 'text-green-500' : 'text-red-500'}`}>followed</span>
        )}
      </div>
      {isHovered ? (
        <Button onClick={() => handlePinProfile(profile)} variant="ghost" size="sm" className="absolute right-3 rounded-full px-1.5 py-1">
          {selectedUser === userId ? <PinOff /> : <Pin />}
        </Button>
      ) : null}
    </div>
  );
};

export default MiniProfile;
