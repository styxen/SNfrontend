import { useQuery } from '@tanstack/react-query';
import { PostUpdates } from './PostCard';
import { useRef } from 'react';
import { useGlobalContext } from '../context/GlobalContext';

type PostFormProps = {
  editPost: boolean;
  postUpdates: PostUpdates;
  setPostUpdates: React.Dispatch<React.SetStateAction<PostUpdates>>;
};

const PostForm = ({ editPost, postUpdates, setPostUpdates }: PostFormProps) => {
  const { fetchImage } = useGlobalContext();
  const { postContent, imageId } = postUpdates;
  const inputImageRef = useRef<HTMLInputElement>(null);

  const {
    data: postImageSrc,
    isLoading: isPostImageSrcLoading,
    isSuccess: isPostImageSrcSuccsess,
  } = useQuery({
    queryKey: ['postImageSrc', { imageId }],
    queryFn: () => fetchImage({ imageId, imageParams: 'compressed' }),
    enabled: !!imageId,
  });

  const handleImgClick = () => {
    if (!inputImageRef.current || !editPost) return;
    inputImageRef.current.click();
  };

  const selectImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPostUpdates((prev) => ({ ...prev, file }));
  };

  return (
    <>
      {editPost ? (
        <div className="h-fit py-3">
          <textarea
            className="min-h-min w-full resize-y border-transparent text-2xl ring-opacity-100 focus:border-transparent focus:ring-0"
            value={postContent}
            onChange={(e) => setPostUpdates((prev) => ({ ...prev, postContent: e.target.value }))}
          />
        </div>
      ) : (
        <div className="overflow-auto break-words p-3 text-2xl">{postContent}</div>
      )}
      {isPostImageSrcLoading ? (
        <div>Image is loading...</div>
      ) : isPostImageSrcSuccsess ? (
        <>
          {editPost ? (
            <input onChange={(event) => selectImage(event)} type="file" />
          ) : (
            <div className="flex flex-grow">
              <img onClick={handleImgClick} src={postImageSrc} alt="postimage" className="w-full rounded-lg" />
              <input onChange={(event) => selectImage(event)} ref={inputImageRef} type="file" className="hidden" />
            </div>
          )}
        </>
      ) : null}
    </>
  );
};

export default PostForm;
