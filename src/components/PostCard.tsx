import { Heart, HeartCrack, MessageCircle, Pencil, Save, XCircle } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import { PostData } from './PostsContainer';
import { useState } from 'react';
import formatTimesAgo from '../utils/formatTimesAgo';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosRequest } from '../api/axios';
import PostForm from './PostForm';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import ComentsContainer from './CommentsContainer';

type PostCardProps = {
  post: PostData;
};

type LikeData = {
  count: number;
  isLiked: boolean;
};

export type PostUpdates = {
  postEdited: boolean;
  postContent: string;
  imageId: string | null;
  countComments: number;
  selectedImage: File | undefined;
};

const PostCard = ({ post }: PostCardProps) => {
  const {
    postId,
    userId,
    postEdited,
    postContent,
    createdAt,
    updatedAt,
    countComments,
    countLikes,
    isLiked,
    imageId,
    profileImageId,
    profileName,
  } = post;
  const { fetchImage, token, currentUserId } = useGlobalContext();
  const [postUpdates, setPostUpdates] = useState<PostUpdates>({
    postEdited,
    postContent,
    imageId,
    countComments,
    selectedImage: undefined,
  });
  const [likes, setLikes] = useState<LikeData>({ count: countLikes, isLiked });
  const [isHoverd, setIsHoverd] = useState(false);
  const [editPost, setEditPost] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const {
    data: avatarImageSrc,
    isLoading: isAvatarImageSrcLoading,
    isSuccess: isAvatarImageSrcSuccsess,
  } = useQuery({
    queryKey: ['postAvatarImageSrc', postId, postUpdates],
    queryFn: () => fetchImage({ imageId: profileImageId, imageParams: 'original' }),
  });

  const sendLikeMutation = useMutation({
    mutationFn: (method: 'post' | 'delete') => sendLike(method),
  });

  const updatePostMutation = useMutation({
    mutationFn: (formData: FormData) => updatePost(formData),
  });

  const handleLike = () => {
    if (likes.isLiked) {
      sendLikeMutation.mutate('delete');
    } else {
      sendLikeMutation.mutate('post');
    }
  };

  const sendLike = async (method: 'post' | 'delete') => {
    await axiosRequest({
      method,
      baseURL: process.env.REACT_APP_BASE_URL,
      url: `likes/${postId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    method === 'post'
      ? setLikes((prev) => ({ count: prev.count + 1, isLiked: true }))
      : setLikes((prev) => ({ count: prev.count - 1, isLiked: false }));
  };

  const handleUpdate = () => {
    const formData = new FormData();
    if (postUpdates.selectedImage) formData.append('file', postUpdates.selectedImage);
    formData.append('postContent', postUpdates.postContent);
    formData.append('postId', postId);

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

    setPostUpdates((prev) => ({ ...prev, postEdited: true, imageId: response.imageId, postContent: response.postContent }));
    return response;
  };

  return (
    <div
      onMouseOver={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
      className="mx-auto grid w-full gap-5 overflow-hidden rounded-2xl bg-white px-8 py-6 shadow-lg"
    >
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
            <p className="cursor-pointer font-sans text-2xl font-bold">{profileName}</p>
          </Link>
        </div>
        <div className="flex gap-2 px-3">
          {editPost ? (
            <>
              <Button onClick={handleUpdate} size="sm" className="items-center rounded-full px-1.5 py-1">
                <Save />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="items-center rounded-full px-1.5 py-1"
                onClick={() => setEditPost((prev) => !prev)}
              >
                <XCircle />
              </Button>
            </>
          ) : (
            <>
              {isHoverd && userId === currentUserId ? (
                <Button onClick={() => setEditPost((prev) => !prev)} variant="ghost" size="sm" className="rounded-full px-1.5 py-1">
                  <Pencil />
                </Button>
              ) : null}
            </>
          )}
        </div>
        <div className="flex items-stretch gap-3">
          <span>{postUpdates.postEdited ? 'edited' : 'created'}</span>
          <div>
            {postUpdates.postEdited ? formatTimesAgo(new Date(!postEdited ? Date.now() : updatedAt)) : formatTimesAgo(new Date(createdAt))}
          </div>
        </div>
      </div>
      <PostForm editPost={editPost} postUpdates={postUpdates} setPostUpdates={setPostUpdates} />
      <div className="mx-5 flex justify-between">
        <div onClick={handleLike} className="flex cursor-pointer gap-2">
          {likes.isLiked ? <HeartCrack /> : <Heart />}
          {likes.count}
        </div>
        <div onClick={() => setShowComments((prev) => !prev)} className="flex cursor-pointer gap-2">
          <MessageCircle />
          {postUpdates.countComments}
        </div>
      </div>
      {showComments ? <ComentsContainer postId={postId} setPostUpdates={setPostUpdates} /> : null}
    </div>
  );
};

export default PostCard;
