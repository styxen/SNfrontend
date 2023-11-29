import { useQuery } from '@tanstack/react-query';
import { useGlobalContext } from '../context/GlobalContext';
import { PostData } from './PostsContainer';
import { axiosRequest } from '../api/axios';
import PostCard from './PostCard';

const NewsPostContaiener = () => {
  const { token } = useGlobalContext();

  const {
    data: posts,
    isLoading: arePostsLoading,
    isSuccess: arePostsSuccess,
  } = useQuery({
    queryKey: ['newsPosts'],
    queryFn: () => fetchPosts(),
  });

  const fetchPosts = async () => {
    const response = await axiosRequest<PostData[]>({
      method: 'get',
      url: `/posts`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  return (
    <div className="grid h-fit gap-10 px-20 py-6 font-sans leading-tight">
      <div className="mx-auto flex h-fit w-full flex-col justify-center gap-2 overflow-hidden rounded-2xl border-b bg-white px-10 py-6 pb-6 font-sans leading-tight shadow-lg">
        <h3 className="mb-1 text-left text-base font-bold md:text-2xl">News</h3>
        {arePostsSuccess && posts.length === 0 ? (
          <p className="text-grey-dark inline-flex items-center text-left text-sm sm:flex md:text-base">
            There are no posts from people you follow
          </p>
        ) : null}
      </div>
      {arePostsLoading ? (
        <div>Posts are loading...</div>
      ) : arePostsSuccess ? (
        <>
          {posts.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))}
        </>
      ) : null}
    </div>
  );
};

export default NewsPostContaiener;
