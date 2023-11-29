import { useGlobalContext } from '../context/GlobalContext';
import NewComment from './NewComment';
import CommentCard from './CommentCard';
import { useQuery } from '@tanstack/react-query';
import { axiosRequest } from '../api/axios';
import { PostUpdates } from './PostCard';

type CommentsContainerProps = {
  postId: string;
  setPostUpdates: React.Dispatch<React.SetStateAction<PostUpdates>>;
};

export type CommentData = {
  commentId: string;
  commentContent: string;
  userId: string;
  postId: string;
  commentEdited: boolean;
  updatedAt: Date;
  createdAt: Date;
  profileName: string;
  profileImageId: string | null;
};

const ComentsContainer = ({ postId, setPostUpdates }: CommentsContainerProps) => {
  const { token } = useGlobalContext();

  const {
    data: comments,
    isLoading: areCommentsLoading,
    isSuccess: areCommentsSuccess,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ['userComments', { postId }],
    queryFn: () => fetchComments(),
    enabled: !!postId,
  });

  const fetchComments = async () => {
    const response = await axiosRequest<CommentData[]>({
      method: 'get',
      url: `/comments/${postId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  return (
    <div className="mx-10 flex max-h-96 w-full flex-col gap-2 overflow-hidden overflow-y-scroll">
      <NewComment postId={postId} setPostUpdates={setPostUpdates} refetchComments={refetchComments} />
      {areCommentsLoading ? (
        <div>Comments are loading...</div>
      ) : areCommentsSuccess ? (
        <>
          {comments.map((comment) => (
            <CommentCard key={comment.commentId} comment={comment} />
          ))}
        </>
      ) : null}
    </div>
  );
};

export default ComentsContainer;
