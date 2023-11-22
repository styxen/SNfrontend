import { Pencil, Save, XCircle } from 'lucide-react';
import { PostUpdates } from './PostCard';
import Button from './ui/Button';
import { useGlobalContext } from '../context/GlobalContext';
import { useRef, useState } from 'react';
import { PostData } from './PostContainer';
import { useMutation } from '@tanstack/react-query';
import { axiosRequest } from '../api/axios';

type PostFormProps = {
  post: PostData;
  editPost: boolean;
  setEditPost: React.Dispatch<React.SetStateAction<boolean>>;
  postUpdates: PostUpdates;
  setPostUpdates: React.Dispatch<React.SetStateAction<PostUpdates>>;
  userId: string;
  postImageSrc: string;
  isHoverd: boolean;
};

const PostForm = ({ post, editPost, setEditPost, postUpdates, setPostUpdates, postImageSrc, userId, isHoverd }: PostFormProps) => {
  const { postContent } = postUpdates;
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const inputImageRef = useRef<HTMLInputElement>(null);
  const { currentUserId, token } = useGlobalContext();

  const updatePostMutation = useMutation({
    mutationFn: (formData: FormData) => updatePost(formData),
  });

  const handleImgClick = () => {
    if (!inputImageRef.current || !editPost) return;
    inputImageRef.current.click();
  };

  const selectImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedImage(file);
  };

  const handleUpdate = () => {
    const formData = new FormData();
    if (selectedImage !== undefined && selectedImage !== null) {
      formData.append('file', selectedImage);
    }

    if (post.postContent !== postContent && postContent !== '') {
      formData.append('postContent', postContent);
    }

    formData.append('postId', post.postId);

    updatePostMutation.mutate(formData);
    setEditPost(false);
  };

  const updatePost = async (formData: FormData) => {
    const response = await axiosRequest<PostData>({
      method: 'patch',
      url: '/posts',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    setPostUpdates((prev) => ({ ...prev, postEdited: true, imageId: response.imageId }));
    return response;
  };

  return (
    <>
      {editPost ? (
        <div className="flex justify-between">
          <div className="h-fit w-11/12 py-3">
            <textarea
              className="min-h-min w-full resize-y border-transparent text-2xl ring-opacity-100 focus:border-transparent focus:ring-0"
              value={postContent}
              onChange={(e) => setPostUpdates((prev) => ({ ...prev, postContent: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2 px-3">
            {editPost ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="items-center rounded-full px-1.5 py-1"
                  onClick={() => setEditPost((prev) => !prev)}
                >
                  <XCircle />
                </Button>
                <Button onClick={handleUpdate} size="sm" className="items-center rounded-full px-1.5 py-1">
                  <Save />
                </Button>
              </>
            ) : (
              <>
                {isHoverd && userId === currentUserId ? (
                  <Button
                    onClick={() => setEditPost((prev) => !prev)}
                    variant="ghost"
                    size="sm"
                    className="items-stretch rounded-full px-1.5 py-1"
                  >
                    <Pencil />
                  </Button>
                ) : null}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-between">
          <div className="w-11/12 break-words p-3 text-2xl">{postContent}</div>
          <div className="p-3">
            {isHoverd && userId === currentUserId ? (
              <Button
                onClick={() => setEditPost((prev) => !prev)}
                variant="ghost"
                size="sm"
                className="items-stretch rounded-full px-1.5 py-1"
              >
                <Pencil />
              </Button>
            ) : null}
          </div>
        </div>
      )}
      {!postImageSrc ? (
        <>
          {editPost ? (
            <>
              <input onChange={(event) => selectImage(event)} type="file" />
            </>
          ) : null}
        </>
      ) : (
        <div className="flex flex-grow">
          <img onClick={handleImgClick} src={postImageSrc} alt="postimage" className="w-full rounded-lg" />
          <input onChange={(event) => selectImage(event)} ref={inputImageRef} type="file" className="hidden" />
        </div>
      )}
    </>
  );
};

export default PostForm;
