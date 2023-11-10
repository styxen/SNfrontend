import { useEffect, useRef, useState } from 'react';
import { useGlobalContext, Profile } from '../context/GlobalContext';
import { useParams } from 'react-router-dom';
import ProfileForm from './ProfileForm';
import ProfileCard from './ProfileCard';

export type FetchDataProps = {
  method: 'get' | 'post' | 'delete' | 'patch' | 'put';
  url: string;
  formData?: FormData;
};

type ProfileProps = {
  isCurrentUser: boolean;
};

const Profile = ({ isCurrentUser }: ProfileProps) => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [profile, setProfile] = useState<Profile>({} as Profile);
  const [imageSrc, setImageSrc] = useState('');
  const [edit, setEdit] = useState(false);
  const { fetchProfile, fetchAvatarImage, setMyAvatarImageSrc } = useGlobalContext();
  const inputImageRef = useRef<HTMLInputElement>(null);

  const fetchData = ({ method, url, formData }: FetchDataProps) => {
    fetchProfile({ method, url, formData }).then((res) => {
      if (!res) return;
      setProfile(res);
      setName(res.profileName || '');
      setStatus(res.profileStatus || '');
      fetchAvatarImage(res.imageId).then((res) => {
        if (!res) return;
        setImageSrc(res);
        if (isCurrentUser) setMyAvatarImageSrc(res);
      });
    });
  };

  useEffect(() => {
    fetchData({ method: 'get', url: `/profiles/${id}` });
  }, [id]);

  return (
    <div className="font-sans leading-tight min-h-screen bg-grey-lighter p-6 pl-3">
      {edit ? (
        <ProfileForm
          imageSrc={imageSrc}
          name={name}
          status={status}
          profile={profile}
          inputImageRef={inputImageRef}
          setName={setName}
          setStatus={setStatus}
          setEdit={setEdit}
          fetchData={fetchData}
        />
      ) : (
        <ProfileCard imageSrc={imageSrc} name={name} status={status} isCurrentUser={isCurrentUser} setEdit={setEdit} />
      )}
    </div>
  );
};

export default Profile;
