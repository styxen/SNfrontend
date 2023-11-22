import { Heart, HeartCrack, MessageCircle } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import { PostData } from './PostContainer';
import { useState } from 'react';
import formatTimesAgo from '../utils/formatTimesAgo';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosRequest } from '../api/axios';
import PostForm from './PostForm';
import { Link } from 'react-router-dom';

type PostCardProps = {
  post: PostData;
  avatarImageSrc: string;
  profileName: string;
};

type LikeData = {
  count: number;
  isLiked: boolean;
};

export type PostUpdates = {
  postEdited: boolean;
  postContent: string;
  imageId: string | null;
};

const PostCard = ({ post, avatarImageSrc, profileName }: PostCardProps) => {
  const { userId, postEdited, postContent, createdAt, countComments, countLikes, isLiked, imageId } = post;
  const [postUpdates, setPostUpdates] = useState<PostUpdates>({ postEdited, postContent, imageId });
  const [likes, setLikes] = useState<LikeData>({ count: countLikes, isLiked });
  const { fetchImage, token } = useGlobalContext();
  const [postImageSrc, setPostImageSrc] = useState('');
  const [isHoverd, setIsHoverd] = useState(false);
  const [editPost, setEditPost] = useState(false);

  useQuery({
    retry: 3,
    queryKey: ['postImageSrc', { postImageId: postUpdates.imageId }],
    queryFn: () => fetchImage({ imageId: postUpdates.imageId, imageParams: 'compressed', setImageSrc: setPostImageSrc }),
    enabled: !!postUpdates.imageId,
  });

  const sendLikeMutation = useMutation({
    mutationFn: (method: 'post' | 'delete') => sendLike(method),
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
      url: `likes/${post.postId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    method === 'post'
      ? setLikes((prev) => ({ count: prev.count + 1, isLiked: true }))
      : setLikes((prev) => ({ count: prev.count - 1, isLiked: false }));
    return {};
  };

  return (
    <div
      onMouseOver={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
      className="mx-auto grid w-full gap-5 overflow-hidden rounded-2xl bg-white px-8 py-6 shadow-lg"
    >
      <div className="flex justify-between">
        <div className="flex items-stretch gap-2">
          <Link to={`/${userId}`} replace>
            <img className="h-10 w-10 cursor-pointer rounded-full border-4 border-white" src={avatarImageSrc} alt="avatar" />
          </Link>
          <Link to={`/${userId}`} replace>
            <span className="cursor-pointer font-sans text-2xl font-bold">{profileName}</span>
          </Link>
        </div>
        <div className="flex items-stretch gap-3">
          <span>{postUpdates.postEdited ? 'edited' : 'created'}</span>
          <div>{formatTimesAgo(new Date(createdAt))}</div>
        </div>
      </div>
      <PostForm
        post={post}
        editPost={editPost}
        setEditPost={setEditPost}
        postUpdates={postUpdates}
        setPostUpdates={setPostUpdates}
        userId={userId}
        postImageSrc={postImageSrc}
        isHoverd={isHoverd}
      />
      <div className="mx-5 flex justify-between">
        <div onClick={handleLike} className="flex cursor-pointer gap-2">
          {likes.isLiked ? <HeartCrack /> : <Heart />}
          {likes.count}
        </div>
        <div className="flex cursor-pointer gap-2">
          <MessageCircle />
          {countComments}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
