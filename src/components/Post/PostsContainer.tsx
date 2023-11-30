import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { axiosRequest } from '../../api/axios';
import { useQuery } from '@tanstack/react-query';
import { PenSquare } from 'lucide-react';
import PostCard from './PostCard';
import Button from '../ui/Button';
import NewPost from './NewPost';

export type PostData = {
  userId: string;
  postId: string;
  postContent: string;
  imageId: string | null;
  postEdited: boolean;
  updatedAt: Date;
  createdAt: Date;
  profileName: string;
  profileImageId: string | null;
  countLikes: number;
  countComments: number;
  isLiked: boolean;
};

type PostCotainerProps = {
  userId: string;
  isCurrentUser: boolean;
};

const PostContainer = ({ userId, isCurrentUser }: PostCotainerProps) => {
  const { token } = useGlobalContext();
  const [createNewPost, setCreateNewPost] = useState(false);

  const {
    data: posts,
    isLoading: isPostsLoading,
    isSuccess: isPostsSuccess,
  } = useQuery({
    queryKey: ['userPosts', userId],
    queryFn: () => fetchPosts(),
    enabled: !!userId,
  });

  const fetchPosts = async () => {
    const response = await axiosRequest<PostData[]>({
      method: 'get',
      url: `/posts/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  return (
    <div className="grid h-fit gap-10 px-20 py-3 font-sans leading-tight">
      {isCurrentUser ? (
        <Button size="lg" onClick={() => setCreateNewPost(true)}>
          <PenSquare />
        </Button>
      ) : null}
      {createNewPost ? <NewPost userId={userId} setCreateNewPost={setCreateNewPost} /> : null}
      {isPostsLoading ? (
        <div>Posts are loading...</div>
      ) : isPostsSuccess ? (
        posts.map((post) => <PostCard key={post.postId} post={post} />)
      ) : null}
    </div>
  );
};

export default PostContainer;
