import { useRef } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { ProfileUpdatesData } from './ProfileCard';
import useImage from '../../hooks/useImage';

type ProfileFormProps = {
  editProfile: boolean;
  imageId: string | null;
  profileUpdates: ProfileUpdatesData;
  setProfileUpdates: React.Dispatch<React.SetStateAction<ProfileUpdatesData>>;
};

const ProfileForm = ({ editProfile, imageId, profileUpdates, setProfileUpdates }: ProfileFormProps) => {
  const { token } = useGlobalContext();
  const inputImageRef = useRef<HTMLInputElement>(null);
  const { profileName, profileStatus } = profileUpdates;

  const {
    data: avatarImageSrc,
    isLoading: isAvatarImageSrcLoading,
    isSuccess: isAvatarImageSrcSuccsess,
  } = useImage({ imageId, imageParams: 'original', token });

  const handleImgClick = () => {
    if (!inputImageRef.current) return;
    inputImageRef.current.click();
  };

  const selectImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setProfileUpdates((prev) => ({ ...prev, file }));
  };

  return (
    <form className="flex">
      {isAvatarImageSrcLoading ? (
        <div>Image is loading...</div>
      ) : isAvatarImageSrcSuccsess ? (
        <img
          onClick={handleImgClick}
          className="-mt-16 mr-4 h-40 w-40 cursor-pointer rounded-full border-4 border-white"
          src={avatarImageSrc}
          alt="avatar"
        />
      ) : null}
      {editProfile ? (
        <div className="flex flex-col justify-items-start gap-0 py-4">
          <input onChange={(event) => selectImage(event)} ref={inputImageRef} type="file" className="hidden" />
          <h3 className="mb-1 text-left text-base font-bold md:text-2xl">
            Name:{' '}
            <input
              className="ml-1 cursor-text border-none border-transparent bg-none p-0 text-left text-base outline-0 focus:border-transparent focus:ring-0 md:text-2xl"
              value={profileName}
              onChange={(event) => setProfileUpdates((prev) => ({ ...prev, profileName: event.target.value }))}
            />
          </h3>
          <h5 className="text-grey-dark text-left text-sm sm:flex md:text-base">
            Status:{' '}
            <input
              className="ml-1 cursor-text border-none border-transparent bg-none p-0 text-left text-sm focus:border-transparent focus:ring-0 md:text-base"
              value={profileStatus}
              onChange={(event) => setProfileUpdates((prev) => ({ ...prev, profileStatus: event.target.value }))}
            />
          </h5>
        </div>
      ) : (
        <div className="flex flex-col py-4">
          <h3 className="mb-1 text-left text-base font-bold md:text-2xl">{profileName}</h3>
          <div className="text-grey-dark inline-flex items-center text-left text-sm sm:flex md:text-base">{profileStatus}</div>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
