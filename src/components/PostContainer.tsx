import { useState } from 'react';
import { Profile, useGlobalContext } from '../context/GlobalContext';
import { axiosRequest } from '../api/axios';
import { useQuery } from '@tanstack/react-query';
import { PenSquare } from 'lucide-react';
import PostCard from './PostCard';
import Button from './ui/Button';
import NewPost from './NewPost';

export type PostData = {
  postId: string;
  userId: string;
  postContent: string;
  imageId: string | null;
  postEdited: boolean;
  createdAt: Date;
  countLikes: number;
  countComments: number;
  isLiked: boolean;
};

type PostCotainerProps = {
  profile: Profile;
  avatarImageSrc: string;
  isCurrentUser: boolean;
};

const PostContainer = ({ profile, avatarImageSrc, isCurrentUser }: PostCotainerProps) => {
  const { userId, profileName } = profile;
  const { token } = useGlobalContext();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [newPost, setNewPost] = useState<PostData | null>(null);
  const [createNewPost, setCreateNewPost] = useState(false);

  useQuery({
    queryKey: ['userPosts', { userId }],
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

    setPosts(response);
    return response;
  };

  return (
    <div className="ph-3 grid h-fit gap-10 px-20 font-sans leading-tight">
      {isCurrentUser ? (
        <Button onClick={() => setCreateNewPost(true)} className="w-40">
          <PenSquare />
        </Button>
      ) : null}
      {createNewPost ? (
        <NewPost
          userId={userId}
          profileName={profileName}
          avatarImageSrc={avatarImageSrc}
          setNewPost={setNewPost}
          setCreateNewPost={setCreateNewPost}
        />
      ) : null}
      {newPost ? <PostCard key={newPost.postId} post={newPost} avatarImageSrc={avatarImageSrc} profileName={profileName} /> : null}
      {posts.map((post) => (
        <PostCard key={post.postId} post={post} avatarImageSrc={avatarImageSrc} profileName={profileName} />
      ))}
    </div>
  );
};

export default PostContainer;
