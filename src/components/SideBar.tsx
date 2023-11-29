import { useState } from 'react';
import { Profile, useGlobalContext } from '../context/GlobalContext';
import { axiosRequest } from '../api/axios';
import MiniProfile from './MiniProfile';
import { useQuery } from '@tanstack/react-query';

const SideBar = () => {
  const { token, currentUserId } = useGlobalContext();
  const [searchString, setSearchString] = useState('');
  const [searchParams, setSearchParams] = useState<'all' | 'followed'>('followed');
  const [selectedUser, setSelectedUser] = useState(currentUserId);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const {
    data: profiles,
    isLoading: isProfilesLoading,
    isSuccess: isProfilesSuccess,
  } = useQuery({
    queryKey: ['filteredProfiles', { searchString, selectedUser, searchParams }],
    queryFn: () => fetchAllProfiles(),
  });

  const fetchAllProfiles = async () => {
    const response = await axiosRequest<Profile[]>({
      method: 'post',
      url: `/profiles/${searchParams}/${selectedUser}`,
      data: {
        searchString,
      },
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  const handlePinProfile = (profile: Profile) => {
    if (profile.userId === selectedUser) {
      setSelectedUser(currentUserId);
      setSelectedProfile(null);
      return;
    }
    setSelectedProfile(profile);
    setSelectedUser(profile.userId);
  };

  return (
    <aside className="h-[92vh] w-96 flex-none px-3 py-6 font-sans">
      <div className="mx-auto h-full w-full overflow-hidden overflow-y-scroll rounded-2xl bg-white shadow-lg">
        {!selectedProfile || selectedUser === currentUserId ? null : (
          <div className="mx-4 mt-5">
            <MiniProfile profile={selectedProfile} handlePinProfile={handlePinProfile} selectedUser={selectedUser} />
          </div>
        )}
        <input
          placeholder="Search"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value || '')}
          className="sticky mx-3 mb-3 mt-5 w-80 rounded-full border border-neutral-400 px-4 py-1 text-lg shadow-inner shadow-neutral-200 outline-none focus:border-slate-900"
        ></input>
        <div className="mb-3 flex flex-wrap justify-center">
          <div className="me-4 flex items-center">
            <input
              id="green-radio"
              type="radio"
              value="followed"
              name="colored-radio"
              onChange={() => setSearchParams('followed')}
              checked={searchParams === 'followed' ? true : false}
              className="h-4 w-4 border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-green-600"
            />
            <label htmlFor="green-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              followed
            </label>
          </div>
          <div className="me-4 flex items-center">
            <input
              id="red-radio"
              type="radio"
              value="all"
              name="colored-radio"
              onChange={() => setSearchParams('all')}
              checked={searchParams === 'all' ? true : false}
              className="h-4 w-4 border-gray-300 bg-gray-100 text-red-600 focus:ring-2 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-red-600"
            />
            <label htmlFor="red-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              all
            </label>
          </div>
        </div>
        <div className="mx-4 flex flex-col gap-2">
          {isProfilesLoading ? (
            <div>Profiles are loading...</div>
          ) : isProfilesSuccess ? (
            <>
              {profiles
                .filter((profile) => profile.userId !== selectedUser)
                .map((profile, index) => {
                  return <MiniProfile key={index} profile={profile} handlePinProfile={handlePinProfile} selectedUser={selectedUser} />;
                })}
            </>
          ) : null}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
