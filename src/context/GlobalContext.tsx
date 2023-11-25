import { ReactNode, createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Toaster } from 'react-hot-toast';
import { axiosRequest } from '../api/axios';
import { QueryObserverResult, RefetchOptions, useQuery } from '@tanstack/react-query';

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
  currentProfile: Profile | undefined;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  currentUserId: string;
  setCurrentUserId: React.Dispatch<React.SetStateAction<string>>;
  fetchProfile: ({ userId }: FetchProfileProps) => Promise<Profile>;
  fetchImage: ({ imageId, imageParams }: FetchImageProps) => Promise<string>;
  refetchCurrentProfile: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<Profile, Error>>;
};

type FetchProfileProps = {
  userId: string;
};

type FetchImageProps = {
  imageId: string | null;
  imageParams: 'original' | 'compressed';
};

const GlobalContext = createContext({} as GlobalContext);

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const [token, setToken] = useLocalStorage('token', '');
  const [currentUserId, setCurrentUserId] = useLocalStorage('userId', '');

  const { refetch: refetchCurrentProfile, data: currentProfile } = useQuery<Profile>({
    retry: true,
    queryKey: ['currentProfile', currentUserId],
    queryFn: () => fetchProfile({ userId: currentUserId }),
    enabled: !!currentUserId,
  });

  const fetchProfile = async ({ userId }: FetchProfileProps): Promise<Profile> => {
    const response = await axiosRequest<Profile>({
      method: 'get',
      url: `/profiles/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  const fetchImage = async ({ imageId, imageParams }: FetchImageProps): Promise<string> => {
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
    return imageUrl;
  };

  return (
    <GlobalContext.Provider
      value={{
        currentProfile,
        token,
        setToken,
        currentUserId,
        setCurrentUserId,
        fetchProfile,
        fetchImage,
        refetchCurrentProfile,
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </GlobalContext.Provider>
  );
};
