import { Link } from 'react-router-dom';
import { CommentData } from './CommentsContainer';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGlobalContext } from '../../context/GlobalContext';
import { useState } from 'react';
import Button from '../ui/Button';
import { Pencil, Save, Trash2, XCircle } from 'lucide-react';
import { axiosRequest } from '../../api/axios';
import useImage from '../../hooks/useImage';
import DeleteModal from '../Other/DeleteModal';
import { PostUpdates } from '../Post/PostCard';

type CommentCardProps = {
  comment: CommentData;
  setPostUpdates: React.Dispatch<React.SetStateAction<PostUpdates>>;
};

type CommentUpdatesData = {
  commentId: string;
  commentContent: string;
};

const CommentCard = ({ comment, setPostUpdates }: CommentCardProps) => {
  const { currentUserId, token } = useGlobalContext();
  const { userId, profileName, profileImageId, commentId, commentContent, postId } = comment;
  const [commentUpdates, setCommentUpdates] = useState(commentContent);
  const [isHoverd, setIsHoverd] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isCurrentUser = currentUserId === comment.userId;
  const queryClient = useQueryClient();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const {
    data: avatarImageSrc,
    isLoading: isAvatarImageSrcLoading,
    isSuccess: isAvatarImageSrcSuccsess,
  } = useImage({ imageId: profileImageId, imageParams: 'original', token });

  const { mutate: mutateCreateComment } = useMutation({
    mutationFn: ({ commentId, commentContent }: CommentUpdatesData) => updateComment({ commentId, commentContent }),
  });

  const { mutate: mutateDeleteComment } = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      setPostUpdates((prev) => ({ ...prev, countComments: prev.countComments - 1 }));
      queryClient.setQueryData(['userComments', postId], (prev: CommentData[]) =>
        prev.filter((prveComment) => prveComment.commentId !== commentId)
      );
    },
  });

  const handleUpdate = () => {
    mutateCreateComment({ commentId, commentContent: commentUpdates });
    setEditComment(false);
  };

  const updateComment = async (data: CommentUpdatesData) => {
    const response = await axiosRequest<CommentData>({
      method: 'patch',
      url: '/comments',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  const deleteComment = async (commentId: string) => {
    const response = await axiosRequest({
      method: 'delete',
      url: `/comments/`,
      data: {
        commentId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  const handleDelete = () => {
    mutateDeleteComment(commentId);
  };

  return (
    <div onMouseOver={() => setIsHoverd(true)} onMouseLeave={() => setIsHoverd(false)} className="flex w-full gap-2">
      <DeleteModal isModalOpen={isModalOpen} onClose={closeModal} onConfirm={handleDelete} item="comment" />
      {isAvatarImageSrcLoading ? (
        <div>Image is loading...</div>
      ) : isAvatarImageSrcSuccsess ? (
        <Link className="flex-shrink-0" to={`/${userId}`} replace>
          <img className="h-10 w-10 cursor-pointer rounded-full border-4 border-white" src={avatarImageSrc} alt="avatar" />
        </Link>
      ) : null}
      <div className="flex w-10/12 flex-col">
        <div className="flex gap-2">
          <Link to={`/${userId}`} replace>
            <p className="text-md flex-shrink-0 cursor-pointer font-sans font-bold">{profileName}</p>
          </Link>
          {editComment ? (
            <>
              <Button onClick={handleUpdate} size="sm" className="mt-0.5 h-fit items-center">
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="mt-0.5 h-fit items-center" onClick={() => setEditComment(false)}>
                <XCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="mt-0.5 h-fit items-center bg-red-300 hover:bg-red-500" onClick={openModal}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              {isHoverd && isCurrentUser ? (
                <Button onClick={() => setEditComment(true)} variant="ghost" size="sm" className="mt-0.5 h-fit">
                  <Pencil className="h-4 w-4" />
                </Button>
              ) : null}
            </>
          )}
        </div>
        <div>
          {editComment ? (
            <textarea
              className="text-md min-h-min w-full resize-y rounded-3xl ring-opacity-100 focus:border-transparent focus:ring-0"
              value={commentUpdates}
              onChange={(e) => setCommentUpdates(e.target.value)}
            />
          ) : (
            <div className="w-auto break-words text-sm">{commentUpdates}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
