import { Heart, MessageCircle, Save } from 'lucide-react';
import Button from './ui/Button';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { axiosRequest } from '../api/axios';
import { PostData } from './PostContainer';
import { useGlobalContext } from '../context/GlobalContext';

type NewPostProps = {
  userId: string;
  profileName: string;
  avatarImageSrc: string;
  setNewPost: React.Dispatch<React.SetStateAction<PostData | null>>;
  setCreateNewPost: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewPost = ({ userId, profileName, avatarImageSrc, setNewPost, setCreateNewPost }: NewPostProps) => {
  const { token } = useGlobalContext();
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);

  const createPostMutation = useMutation({
    mutationFn: (formData: FormData) => createPost(formData),
  });

  const handleCreate = () => {
    const formData = new FormData();
    if (selectedImage !== undefined && selectedImage !== null) {
      formData.append('file', selectedImage);
    }

    if (postContent === '') return;
    formData.append('postContent', postContent);
    createPostMutation.mutate(formData);
    setCreateNewPost(false);
  };

  const createPost = async (formData: FormData) => {
    const response = await axiosRequest<PostData>({
      method: 'post',
      url: '/posts',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    setNewPost(response);
    return response;
  };

  const selectImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedImage(file);
  };

  return (
    <div className="mx-auto grid w-full gap-5 overflow-hidden rounded-2xl bg-white px-8 py-6 shadow-lg">
      <div className="flex">
        <div className="flex items-stretch gap-2">
          <Link to={`/${userId}`} replace>
            <img className="h-10 w-10 cursor-pointer rounded-full border-4 border-white" src={avatarImageSrc} alt="avatar" />
          </Link>
          <Link to={`/${userId}`} replace>
            <span className="cursor-pointer font-sans text-2xl font-bold">{profileName}</span>
          </Link>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="h-fit w-11/12 py-3">
          <textarea
            className={`min-h-min w-full resize-y border-transparent text-2xl ring-opacity-100 focus:border-transparent focus:ring-0`}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </div>
        <Button onClick={handleCreate} size="sm" className="items-center rounded-full px-1.5 py-1">
          <Save />
        </Button>
      </div>
      <input onChange={(event) => selectImage(event)} type="file" />
      <div className="mx-5 flex justify-between">
        <div className="flex cursor-pointer gap-2">
          <Heart />0
        </div>
        <div className="flex cursor-pointer gap-2">
          <MessageCircle />0
        </div>
      </div>
    </div>
  );
};

export default NewPost;
