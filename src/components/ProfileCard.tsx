import { UserCog2, MessageSquare, Save, XCircle } from 'lucide-react';
import { Profile, useGlobalContext } from '../context/GlobalContext';
import Button from './ui/Button';
import ProfileForm from './ProfileForm';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { axiosRequest } from '../api/axios';

type ProfileCardProps = {
  isCurrentUser: boolean;
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  avatarImageSrc: string;
  editProfile: boolean;
  setEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
  handlePinProfile: (profile: Profile) => void;
};

const ProfileCard = ({
  isCurrentUser,
  profile,
  setProfile,
  avatarImageSrc,
  editProfile,
  setEditProfile,
  handlePinProfile,
}: ProfileCardProps) => {
  const { isFollowed, userId, profileName, profileStatus } = profile;
  const { currentProfile, setCurrentProfile, token } = useGlobalContext();
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);

  const updateProfileMutation = useMutation({
    mutationFn: (formData: FormData) => updateProfile(formData),
  });

  const sendFollowMutation = useMutation({
    mutationFn: (method: 'post' | 'delete') => FollowRequest(method),
  });

  const handleUpdate = () => {
    const formData = new FormData();
    if (selectedImage !== undefined && selectedImage !== null) formData.append('file', selectedImage);
    if (profileName !== currentProfile.profileName && profileName !== '') formData.append('profileName', profileName);
    if (profileStatus !== currentProfile.profileStatus && profileStatus !== '') formData.append('profileStatus', profileStatus);

    updateProfileMutation.mutate(formData);
    setEditProfile(false);
  };

  const updateProfile = async (formData: FormData) => {
    const response = await axiosRequest<Profile>({
      method: 'patch',
      baseURL: process.env.REACT_APP_BASE_URL,
      url: '/profiles/update',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    setCurrentProfile(response);
    setProfile(response);
    return response;
  };

  const handleFollow = () => {
    if (isFollowed) {
      sendFollowMutation.mutate('delete');
      setProfile((prev) => ({ ...prev, isFollowed: false }));
      handlePinProfile(currentProfile);
    } else {
      sendFollowMutation.mutate('post');
      setProfile((prev) => ({ ...prev, isFollowed: true }));
      handlePinProfile(profile);
    }
  };

  const FollowRequest = async (method: 'post' | 'delete') => {
    await axiosRequest({
      method,
      url: `followers/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <div className="h-fit px-3 py-6 font-sans leading-tight">
      <div className="mx-auto w-full overflow-hidden rounded-2xl bg-white shadow-lg">
        <div
          className="h-40 bg-cover"
          style={{
            backgroundImage: "url('src/assets/watercolor-sky-background.avif')",
          }}
        ></div>
        <div className="border-b px-4 pb-6">
          <div className="flex items-center justify-between text-center sm:flex sm:text-left">
            <ProfileForm
              editProfile={editProfile}
              profile={profile}
              setProfile={setProfile}
              avatarImageSrc={avatarImageSrc}
              setSelectedImage={setSelectedImage}
            />
            <div className="flex h-fit flex-col md:flex-row">
              {!isCurrentUser ? (
                <>
                  <Button onClick={handleFollow} variant={isFollowed ? 'ghost' : 'default'} className="w-24 rounded-full md:w-40">
                    {isFollowed ? 'Unfollow' : 'Follow'}
                  </Button>
                  <Button variant="ghost" className="w-40 rounded-full">
                    <MessageSquare />
                  </Button>
                </>
              ) : (
                <>
                  {!editProfile ? (
                    <Button variant="ghost" className="w-24 rounded-full md:w-40" onClick={() => setEditProfile((prev) => !prev)}>
                      <UserCog2 />
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleUpdate} className="w-24 rounded-full md:w-40">
                        <Save />
                      </Button>
                      <Button variant="ghost" className="w-24 rounded-full md:w-40" onClick={() => setEditProfile((prev) => !prev)}>
                        <XCircle />
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
