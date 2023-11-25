import { UserCog2, MessageSquare, Save, XCircle } from 'lucide-react';
import { Profile, useGlobalContext } from '../context/GlobalContext';
import Button from './ui/Button';
import ProfileForm from './ProfileForm';
import { useState } from 'react';
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query';
import { axiosRequest } from '../api/axios';

type ProfileCardProps = {
  isCurrentUser: boolean;
  profile: Profile;
  refetchProfile: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<Profile, Error>>;
};

export type ProfileUpdatesData = {
  profileName: string;
  profileStatus: string;
  selectedImage: File | undefined;
};

const ProfileCard = ({ isCurrentUser, profile, refetchProfile }: ProfileCardProps) => {
  const { token, refetchCurrentProfile } = useGlobalContext();
  const { isFollowed, userId, profileName, profileStatus, imageId } = profile;
  const [profileUpdates, setProfileUpdates] = useState<ProfileUpdatesData>({ profileName, profileStatus, selectedImage: undefined });
  const [editProfile, setEditProfile] = useState(false);

  const { mutate: mutateProfileUpdate } = useMutation({
    mutationFn: (formData: FormData) => updateProfile(formData),
    onSuccess: () => (refetchProfile(), refetchCurrentProfile()),
  });

  const { mutate: mutateFollow } = useMutation({
    mutationFn: (method: 'post' | 'delete') => FollowRequest(method),
  });

  const handleUpdate = () => {
    const formData = new FormData();
    if (profileUpdates.selectedImage) formData.append('file', profileUpdates.selectedImage);
    formData.append('profileName', profileUpdates.profileName);
    formData.append('profileStatus', profileUpdates.profileStatus);

    mutateProfileUpdate(formData);
    setEditProfile(false);
  };

  const updateProfile = async (formData: FormData) => {
    const response = await axiosRequest<Profile>({
      method: 'patch',
      url: '/profiles/update',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  const handleFollow = () => {
    isFollowed ? mutateFollow('delete') : mutateFollow('post');
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
              imageId={imageId}
              profileUpdates={profileUpdates}
              setProfileUpdates={setProfileUpdates}
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
