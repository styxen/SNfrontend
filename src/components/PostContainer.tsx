import { useState } from 'react';
import { Profile, useGlobalContext } from '../context/GlobalContext';
import { axiosRequest } from '../api/axios';
import { useQuery } from '@tanstack/react-query';
import { PenSquare } from 'lucide-react';
import PostCard from './PostCard';
import Button from './ui/Button';
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
    <div className="grid h-fit gap-10 px-20 py-3 font-sans leading-tight">
      {isCurrentUser ? (
        <Button size="lg" onClick={() => setCreateNewPost(true)}>
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
      {newPost ? <PostCard key={newPost.postId} post={newPost} /> : null}
      {posts.map((post) => (
        <PostCard key={post.postId} post={post} />
      ))}
    </div>
  );
};

export default PostContainer;
