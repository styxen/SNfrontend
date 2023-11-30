import { UserCog2, MessageSquare, Save, XCircle, Trash2 } from 'lucide-react';
import { Profile, useGlobalContext } from '../../context/GlobalContext';
import Button from '../ui/Button';
import ProfileForm from './ProfileForm';
import { useState } from 'react';
import { QueryObserverResult, RefetchOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosRequest } from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../Other/DeleteModal';

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

type ChatRoomData = {
  chatRoomId: string;
  firstUserId: string;
  secondUserId: string;
};

const ProfileCard = ({ isCurrentUser, profile, refetchProfile }: ProfileCardProps) => {
  const { token, refetchCurrentProfile } = useGlobalContext();
  const { isFollowed, userId, profileName, profileStatus, imageId } = profile;
  const [profileUpdates, setProfileUpdates] = useState<ProfileUpdatesData>({ profileName, profileStatus, selectedImage: undefined });
  const [editProfile, setEditProfile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { mutate: mutateProfileUpdate } = useMutation({
    mutationFn: (formData: FormData) => updateProfile(formData),
    onSuccess: () => (refetchProfile(), refetchCurrentProfile()),
  });

  const { mutate: mutateFollow } = useMutation({
    mutationFn: (method: 'post' | 'delete') => followRequest(method),
  });

  const { mutate: mutateCreateChatRoom } = useMutation({
    mutationFn: () => createChatRoom(),
    onSuccess: (data) => navigate(`/chats/${data.chatRoomId}`),
  });

  const { mutate: mutateDeleteProfile } = useMutation({
    mutationFn: () => deleteProfile(),
    onSuccess: () => {
      queryClient.cancelQueries();
      ['token', 'userId', 'profile'].map((item) => localStorage.removeItem(item));
      navigate('/auth/login');
    },
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

  const followRequest = async (method: 'post' | 'delete') => {
    await axiosRequest({
      method,
      url: `followers/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const sendMessage = () => {
    mutateCreateChatRoom();
  };

  const createChatRoom = async () => {
    const response = await axiosRequest<ChatRoomData>({
      method: 'get',
      url: `chatRooms/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  const deleteProfile = async () => {
    const response = await axiosRequest({
      method: 'delete',
      url: '/users/',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  const handleDelete = () => {
    mutateDeleteProfile();
  };

  return (
    <div className="h-fit px-3 py-6 font-sans leading-tight">
      <DeleteModal isModalOpen={isModalOpen} onClose={closeModal} onConfirm={handleDelete} item="accaunt" />
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
            <div className="flex h-fit flex-col gap-3 md:flex-row">
              {!isCurrentUser ? (
                <>
                  <Button onClick={handleFollow} variant={isFollowed ? 'ghost' : 'default'} className="md:w-30 w-24 rounded-full">
                    {isFollowed ? 'Unfollow' : 'Follow'}
                  </Button>
                  <Button onClick={sendMessage} variant="ghost" className="md:w-30 w-24 rounded-full">
                    <MessageSquare />
                  </Button>
                </>
              ) : (
                <>
                  {!editProfile ? (
                    <Button variant="ghost" className="md:w-30 w-24 rounded-full" onClick={() => setEditProfile((prev) => !prev)}>
                      <UserCog2 />
                    </Button>
                  ) : (
                    <>
                      <Button onClick={openModal} className="md:w-30 w-24 items-center rounded-full bg-red-300 hover:bg-red-500">
                        <Trash2 />
                      </Button>
                      <Button onClick={handleUpdate} className="md:w-30 w-24 rounded-full">
                        <Save />
                      </Button>
                      <Button variant="ghost" className="md:w-30 w-24 rounded-full" onClick={() => setEditProfile((prev) => !prev)}>
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
