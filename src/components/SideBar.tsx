import { useEffect, useState } from 'react';
import { Profile } from '../context/GlobalContext';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import MiniProfile from './MiniProfile';

const SideBar = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const fetchAllProfiles = async () => {
    try {
      const response = await axios<Profile[]>({
        method: 'get',
        baseURL: process.env.REACT_APP_BASE_URL,
        url: '/profiles/all',
      });

      setProfiles(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.msg);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllProfiles();
  }, []);

  return (
    <aside className="font-sans h-full min-h-screen bg-grey-lighter p-6 pl-3 scrollbar-hidden">
      <div className="w-full h-full mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
        <input
          type="search"
          placeholder="Search"
          className="sticky rounded-full border border-neutral-400 shadow-inner shadow-neutral-200 mt-10 mb-3 mx-3 py-1 px-4 text-lg w-80 focus:border-slate-900 outline-none"
        ></input>
        <div className="mx-4">
          {profiles.map((profile, index) => {
            return <MiniProfile key={index} {...profile} />;
          })}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
