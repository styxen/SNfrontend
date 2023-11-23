import { PostUpdates } from './PostCard';
import { useRef } from 'react';

type PostFormProps = {
  editPost: boolean;
  postUpdates: PostUpdates;
  setPostUpdates: React.Dispatch<React.SetStateAction<PostUpdates>>;
  postImageSrc: string;
  selectImage: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
};

const PostForm = ({ editPost, postUpdates, setPostUpdates, postImageSrc, selectImage }: PostFormProps) => {
  const { postContent } = postUpdates;
  const inputImageRef = useRef<HTMLInputElement>(null);

  const handleImgClick = () => {
    if (!inputImageRef.current || !editPost) return;
    inputImageRef.current.click();
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
        <div className="break-words p-3 text-2xl">{postContent}</div>
      )}
      {!postImageSrc ? (
        <>{editPost ? <input onChange={(event) => selectImage(event)} type="file" /> : null}</>
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
