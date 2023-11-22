import { SetStateAction, useRef } from 'react';
import { Profile } from '../context/GlobalContext';

type ProfileFormProps = {
  editProfile: boolean;
  profile: Profile;
  setProfile: React.Dispatch<SetStateAction<Profile>>;
  avatarImageSrc: string;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | undefined>>;
};

const ProfileForm = ({ editProfile, profile, setProfile, avatarImageSrc, setSelectedImage }: ProfileFormProps) => {
  const { profileName, profileStatus } = profile;
  const inputImageRef = useRef<HTMLInputElement>(null);

  const handleImgClick = () => {
    if (!inputImageRef.current) return;
    inputImageRef.current.click();
  };

  const selectImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedImage(file);
  };

  return (
    <form className="flex">
      <img
        onClick={handleImgClick}
        className="-mt-16 mr-4 h-40 w-40 cursor-pointer rounded-full border-4 border-white"
        src={avatarImageSrc}
        alt="avatar"
      />
      {editProfile ? (
        <div className="flex flex-col justify-items-start gap-0 py-4">
          <input onChange={(event) => selectImage(event)} ref={inputImageRef} type="file" className="hidden" />
          <h3 className="mb-1 text-left text-base font-bold md:text-2xl">
            Name:{' '}
            <input
              className="ml-1 cursor-text border-none border-transparent bg-none p-0 text-left text-base outline-0 focus:border-transparent focus:ring-0 md:text-2xl"
              value={profileName}
              onChange={(event) => setProfile((profile) => ({ ...profile, profileName: event.target.value }))}
            />
          </h3>
          <h5 className="text-grey-dark text-left text-sm sm:flex md:text-base">
            Status:{' '}
            <input
              className="ml-1 cursor-text border-none border-transparent bg-none p-0 text-left text-sm focus:border-transparent focus:ring-0 md:text-base"
              value={profileStatus}
              onChange={(event) => setProfile((profile) => ({ ...profile, profileStatus: event.target.value }))}
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
