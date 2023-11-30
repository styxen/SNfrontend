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
  refetchCurrentProfile: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<Profile, Error>>;
};

type FetchProfileProps = {
  userId: string;
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

  return (
    <GlobalContext.Provider
      value={{
        currentProfile,
        token,
        setToken,
        currentUserId,
        setCurrentUserId,
        fetchProfile,
        refetchCurrentProfile,
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </GlobalContext.Provider>
  );
};
