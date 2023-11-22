import { useState } from 'react';
import { Profile, useGlobalContext } from '../context/GlobalContext';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { Pin, PinOff } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type MiniProfileProps = {
  profile: Profile;
  handlePinProfile: (profile: Profile) => void;
  selectedUser: string;
  currentUserId: string;
};

const MiniProfile = ({ profile, handlePinProfile, selectedUser, currentUserId }: MiniProfileProps) => {
  const { profileId, profileName, userId, imageId, isFollowed } = profile;
  const [imageUrl, setImageSrc] = useState('');
  const [isHovered, setIsHoverd] = useState(false);
  const { fetchImage } = useGlobalContext();

  useQuery({
    queryKey: ['currentImageSrc', { profileId }],
    queryFn: () => fetchImage({ imageId, imageParams: 'compressed', setImageSrc }),
    enabled: !!profile,
  });

  return (
    <div
      onMouseOver={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
      key={profileId}
      className="relative flex w-full items-center gap-2 rounded-full bg-gray-100 p-1"
    >
      <Link to={`/${userId}`} replace>
        <img className="h-16 w-16 cursor-pointer rounded-full border-4 border-white" src={imageUrl} alt="avatar" />
      </Link>
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
