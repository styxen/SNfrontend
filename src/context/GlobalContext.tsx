import { ReactNode, createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Toaster } from 'react-hot-toast';
import { axiosRequest } from '../api/axios';

export type Profile = {
  profileId: string;
  profileName: string;
  profileStatus: string;
  userId: string;
  imageId: string | null;
  isFollowed: boolean;
};

type GlobalContextProviderProps = {
  children: ReactNode;
};

type GlobalContext = {
  currentProfile: Profile;
  setCurrentProfile: React.Dispatch<React.SetStateAction<Profile>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  currentUserId: string;
  setCurrentUserId: React.Dispatch<React.SetStateAction<string>>;
  currentAvatarImageSrc: string;
  setCurrentAvatarImageSrc: React.Dispatch<React.SetStateAction<string>>;
  fetchProfile: ({ userId }: FetchProfileProps) => Promise<Profile>;
  fetchImage: ({ imageId, imageParams }: FetchImageProps) => Promise<string>;
};

type FetchProfileProps = {
  userId: string;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
};

type FetchImageProps = {
  imageId: string | null;
  imageParams: 'original' | 'compressed';
  setImageSrc: React.Dispatch<React.SetStateAction<string>>;
};

const GlobalContext = createContext({} as GlobalContext);

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const [token, setToken] = useLocalStorage('token', '');
  const [currentUserId, setCurrentUserId] = useLocalStorage('userId', '');
  const [currentProfile, setCurrentProfile] = useLocalStorage<Profile>('profile', {} as Profile);
  const [currentAvatarImageSrc, setCurrentAvatarImageSrc] = useLocalStorage('avatarImageSrc', '');

  const fetchProfile = async ({ userId, setProfile }: FetchProfileProps): Promise<Profile> => {
    const response = await axiosRequest<Profile>({
      method: 'get',
      url: `/profiles/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProfile(response);
    return response;
  };

  const fetchImage = async ({ imageId, imageParams, setImageSrc }: FetchImageProps): Promise<string> => {
    const response = await axiosRequest<ArrayBuffer>({
      method: 'get',
      url: `/images/${imageParams}/${!imageId ? 'default' : imageId}`,
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const imageBlob = new Blob([response]);
    const imageUrl = URL.createObjectURL(imageBlob);
    setImageSrc(imageUrl);
    return imageUrl;
  };

  return (
    <GlobalContext.Provider
      value={{
        currentProfile,
        setCurrentProfile,
        token,
        setToken,
        currentUserId,
        setCurrentUserId,
        currentAvatarImageSrc,
        setCurrentAvatarImageSrc,
        fetchProfile,
        fetchImage,
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </GlobalContext.Provider>
  );
};
