import { useEffect, useState } from 'react';
import { Profile, useGlobalContext } from '../context/GlobalContext';
import { Link } from 'react-router-dom';

const MiniProfile = ({ profileId, profileName, userId, imageId }: Profile) => {
  const [imageUrl, setImageUrl] = useState('');
  const { fetchAvatarImage } = useGlobalContext();

  useEffect(() => {
    fetchAvatarImage(imageId).then((res) => {
      if (!res) return;
      setImageUrl(res);
    });
  }, []);

  return (
    <div key={profileId} className="flex items-center gap-2">
      <Link to={`/${userId}`} replace>
        <img className="h-10 w-10 rounded-full border-4 border-white cursor-pointer" src={imageUrl} alt="avatar" />
      </Link>
      <Link to={`/${userId}`} replace>
        <h3 className="font text-2xl mb-1 text-left cursor-pointer">{profileName}</h3>
      </Link>
    </div>
  );
};

export default MiniProfile;
