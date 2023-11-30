import { Save, XCircle } from 'lucide-react';
import { CommentData } from './CommentsContainer';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { axiosRequest } from '../../api/axios';
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query';
import { PostUpdates } from '../Post/PostCard';
import useImage from '../../hooks/useImage';

type NewCommentProps = {
  postId: string;
  setPostUpdates: React.Dispatch<React.SetStateAction<PostUpdates>>;
  refetchComments: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<CommentData[], Error>>;
};

type NewCommentData = {
  postId: string;
  commentContent: string;
};

const NewComment = ({ postId, setPostUpdates, refetchComments }: NewCommentProps) => {
  const { currentUserId, currentProfile, token } = useGlobalContext();
  const { profileName, imageId } = currentProfile!;
  const [commentContent, setCommentContent] = useState('');

  const {
    data: avatarImageSrc,
    isLoading: isAvatarImageSrcLoading,
    isSuccess: isAvatarImageSrcSuccsess,
  } = useImage({ imageId, imageParams: 'compressed', token });

  const { mutate: mutateCreateComment } = useMutation({
    mutationFn: ({ postId, commentContent }: NewCommentData) => createComment({ postId, commentContent }),
    onSuccess: () => {
      setPostUpdates((prev) => ({ ...prev, countComments: prev.countComments + 1 }));
      refetchComments();
    },
  });

  const handleCreate = () => {
    mutateCreateComment({ postId, commentContent: commentContent });
    setCommentContent('');
  };

  const createComment = async (data: NewCommentData) => {
    const response = await axiosRequest<CommentData>({
      method: 'post',
      url: '/comments',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  return (
    <div className="flex w-full gap-2">
      {isAvatarImageSrcLoading ? (
        <div>Image is loadin...</div>
      ) : isAvatarImageSrcSuccsess ? (
        <Link className="flex-shrink-0" to={`/${currentUserId}`} replace>
          <img className="h-10 w-10 cursor-pointer rounded-full border-4 border-white" src={avatarImageSrc} alt="avatar" />
        </Link>
      ) : null}
      <div className="flex w-10/12 flex-col gap-1">
        <div className="flex gap-2">
          <Link to={`/${currentUserId}`} replace>
            <p className="text-md flex-shrink-0 cursor-pointer font-sans font-bold">{profileName}</p>
          </Link>
          <Button onClick={handleCreate} size="sm" className="mt-0.5 h-fit items-center">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="mt-0.5 h-fit items-center" onClick={() => setCommentContent('')}>
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <textarea
            className="text-md min-h-min w-full resize-y rounded-3xl ring-opacity-100 focus:border-transparent focus:ring-0"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default NewComment;
