import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import toast, { Toaster } from 'react-hot-toast';
import axios, { AxiosError } from 'axios';

export type Profile = {
  profileId: string;
  profileName: string;
  profileStatus: string | null;
  userId: string;
  imageId: string | null;
};

export type FetchProfileProps = {
  method: 'get' | 'post' | 'delete' | 'patch' | 'put';
  url: string;
  formData?: FormData;
};

type GlobalContextProviderProps = {
  children: ReactNode;
};

type GlobalContext = {
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  token: string;
  userId: string;
  fetchProfile: ({ method, url, formData }: FetchProfileProps) => Promise<Profile | undefined>;
  fetchAvatarImage: (imageId: string | null | undefined) => Promise<string | undefined>;
  myProfile: Profile;
  myAvatarImageSrc: string;
  setMyAvatarImageSrc: React.Dispatch<React.SetStateAction<string>>;
};

const GlobalContext = createContext({} as GlobalContext);

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const [token, setToken] = useLocalStorage('token', '');
  const [userId, setUserId] = useLocalStorage('userId', '');
  const [myProfile, setMyProfile] = useLocalStorage<Profile>('pofile', {} as Profile);
  const [myAvatarImageSrc, setMyAvatarImageSrc] = useLocalStorage('myAvatarImageSrc', '');

  const fetchProfile = async ({ method, url, formData }: FetchProfileProps): Promise<Profile | undefined> => {
    try {
      const response = await axios<Profile>({
        method,
        baseURL: process.env.REACT_APP_BASE_URL,
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.msg);
      }
      console.log(error);
    }
  };

  const fetchAvatarImage = async (imageId: string | null | undefined): Promise<string | undefined> => {
    try {
      const response = await axios<ArrayBuffer>({
        method: 'get',
        baseURL: process.env.REACT_APP_BASE_URL,
        url: `/images/original/${!imageId ? 'default' : imageId}`,
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const imageBlob = new Blob([response.data], { type: response.headers['content-type'] });
      const imageUrl = URL.createObjectURL(imageBlob);
      return imageUrl;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.msg);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchProfile({ method: 'get', url: `/profiles/${userId}` }).then((res) => {
      if (!res) return;
      setMyProfile(res);
      fetchAvatarImage(res.imageId).then((res) => {
        if (!res) return;
        setMyAvatarImageSrc(res);
      });
    });
  }, [token]);

  return (
    <GlobalContext.Provider
      value={{
        setToken,
        setUserId,
        token,
        userId,
        fetchProfile,
        fetchAvatarImage,
        myProfile,
        myAvatarImageSrc,
        setMyAvatarImageSrc,
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </GlobalContext.Provider>
  );
};
