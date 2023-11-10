import { useState } from 'react';
import Button from './ui/Button';
import { FetchDataProps } from './Profile';
import { Profile } from '../context/GlobalContext';

type ProfileFormProps = {
  imageSrc: string;
  name: string;
  status: string;
  profile: Profile;
  inputImageRef: React.RefObject<HTMLInputElement>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  fetchData: ({ method, url, formData }: FetchDataProps) => void;
};

const ProfileForm = ({ imageSrc, name, status, profile, inputImageRef, setName, setStatus, setEdit, fetchData }: ProfileFormProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null | undefined>(null);

  const handleImgClick = () => {
    if (!inputImageRef.current) return;
    inputImageRef.current.click();
  };

  const selectImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setSelectedImage(file);
  };

  const handleUpdate = () => {
    const formData = new FormData();
    if (selectedImage !== undefined && selectedImage !== null) {
      formData.append('file', selectedImage);
    }

    if (name !== profile.profileName && name !== '') {
      formData.append('profileName', name);
    }

    if (status !== profile.profileStatus && status !== '') {
      formData.append('profileStatus', status);
    }

    fetchData({ method: 'patch', url: '/profiles/update', formData });
    setEdit(false);
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
      <div
        className="bg-cover h-40"
        style={{
          backgroundImage: "url('src/assets/watercolor-sky-background.avif')",
        }}
      ></div>
      <div className="border-b px-4 pb-6">
        <div className="flex justify-between text-center items-center sm:text-left sm:flex">
          <div className="flex">
            <img
              onClick={handleImgClick}
              className="h-40 w-40 rounded-full border-4 border-white -mt-16 mr-4 cursor-pointer"
              src={imageSrc}
              alt="avatar"
            />
            <input onChange={(event) => selectImage(event)} ref={inputImageRef} type="file" className="hidden" />
            <div className="flex flex-col py-4 gap-0 justify-items-start">
              <h3 className="font-bold md:text-2xl text-base mb-1 text-left">
                Name:{' '}
                <input
                  className="border-none p-0 bg-none md:text-2xl text-base outline-none cursor-text text-left ml-1"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </h3>
              <h5 className="text-grey-dark sm:flex md:text-base text-sm text-left">
                Status:{' '}
                <input
                  className="border-none p-0 md:text-base text-sm bg-none outline-none cursor-text text-left ml-1"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                />
              </h5>
            </div>
          </div>
          <div className="flex gap-4 md:flex-row flex-col">
            <Button onClick={handleUpdate} className="md:w-40 w-24 rounded-full">
              Save
            </Button>
            <Button variant="ghost" className="md:w-40 w-24 rounded-full" onClick={() => setEdit((prev) => !prev)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
