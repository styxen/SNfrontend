import { Heart, MessageCircle, Save, XCircle } from 'lucide-react';
import Button from './ui/Button';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QueryObserverResult, RefetchOptions, useMutation, useQuery } from '@tanstack/react-query';
import { axiosRequest } from '../api/axios';
import { PostData } from './PostsContainer';
import { useGlobalContext } from '../context/GlobalContext';

type NewPostProps = {
  userId: string;
  setCreateNewPost: React.Dispatch<React.SetStateAction<boolean>>;
  refetchPosts: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<PostData[], Error>>;
};

const NewPost = ({ userId, setCreateNewPost, refetchPosts }: NewPostProps) => {
  const { token, currentProfile, fetchImage } = useGlobalContext();
  const { profileName, imageId } = currentProfile!;
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);

  const {
    data: avatarImageSrc,
    isLoading: isAvatarImageSrcLoading,
    isSuccess: isAvatarImageSrcSuccsess,
  } = useQuery({
    queryKey: ['imageSrc', imageId],
    queryFn: () => fetchImage({ imageId, imageParams: 'original' }),
    enabled: !!imageId,
  });

  const { mutate: mutateCreatePost } = useMutation({
    mutationFn: (formData: FormData) => createPost(formData),
    onSuccess: () => refetchPosts(),
  });

  const handleCreate = () => {
    const formData = new FormData();
    if (selectedImage) formData.append('file', selectedImage);
    formData.append('postContent', postContent);

    mutateCreatePost(formData);
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

    return response;
  };

  const selectImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedImage(file);
  };

  return (
    <div className="mx-auto grid w-full gap-5 overflow-hidden rounded-2xl bg-white px-8 py-6 shadow-lg">
      <div className="flex justify-between">
        <div className="flex items-stretch gap-2">
          {isAvatarImageSrcLoading ? (
            <div>Image is loading...</div>
          ) : isAvatarImageSrcSuccsess ? (
            <Link className="flex-shrink-0" to={`/${userId}`} replace>
              <img className="h-10 w-10 cursor-pointer rounded-full border-4 border-white" src={avatarImageSrc} alt="avatar" />
            </Link>
          ) : null}
          <Link className="flex-shrink-0" to={`/${userId}`} replace>
            <span className="cursor-pointer font-sans text-2xl font-bold">{profileName}</span>
          </Link>
        </div>
        <div className="flex items-stretch gap-2">
          <Button onClick={handleCreate} size="sm" className="items-center rounded-full px-1.5 py-1">
            <Save />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="items-center rounded-full px-1.5 py-1"
            onClick={() => setCreateNewPost((prev) => !prev)}
          >
            <XCircle />
          </Button>
        </div>
      </div>
      <div className="h-fit py-3">
        <textarea
          className={`min-h-min w-full resize-y border-transparent text-2xl ring-opacity-100 focus:border-transparent focus:ring-0`}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
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
