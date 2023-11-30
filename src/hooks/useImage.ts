import { useQuery } from '@tanstack/react-query';
import { axiosRequest } from '../api/axios';

type FetchImageProps = {
  imageId: string | null;
  imageParams: 'original' | 'compressed';
};

type UseImageProps = {
  token: string;
  imageParams: 'original' | 'compressed';
  imageId: string | null;
};

const useImage = ({ token, imageId, imageParams }: UseImageProps) => {
  const fetchImage = async ({ imageId, imageParams }: FetchImageProps): Promise<string> => {
    const response = await axiosRequest<ArrayBuffer>({
      method: 'get',
      url: `/images/${imageParams}/${!imageId ? 'default' : imageId}`,
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const imageBlob = new Blob([response]);
    const imageUrl = URL.createObjectURL(imageBlob);
    return imageUrl;
  };

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['imageSrc', imageId],
    queryFn: () => fetchImage({ imageId, imageParams }),
  });

  return { data, isLoading, isSuccess };
};

export default useImage;
