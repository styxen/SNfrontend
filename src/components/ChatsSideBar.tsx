import { useGlobalContext } from '../context/GlobalContext';
import { axiosRequest } from '../api/axios';
import { useQuery } from '@tanstack/react-query';
import ChatRoomCard from './ChatRoomCard';

export type ChatRoomData = {
  chatRoomId: string;
  firstUserId: string;
  secondUserId: string;
  profileImageId: string | null;
  prfileName: string;
};

const ChatsSideBar = () => {
  const { token, currentUserId } = useGlobalContext();

  const {
    data: chatRooms,
    isLoading: areChatRoomsloading,
    isSuccess: areChatRoomsSuccess,
  } = useQuery({
    queryKey: ['chatRooms', currentUserId],
    queryFn: () => fetchChatRooms(),
  });

  const fetchChatRooms = async () => {
    const response = await axiosRequest<ChatRoomData[]>({
      method: 'get',
      url: '/chatrooms/all',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  return (
    <aside className="h-[92vh] w-96 flex-none px-3 py-6 font-sans">
      <div className="mx-auto h-full w-full overflow-hidden overflow-y-scroll rounded-2xl bg-white shadow-lg">
        <div className="mx-3 flex flex-col gap-2">
          {areChatRoomsloading ? (
            <div>ChatRooms are loading...</div>
          ) : areChatRoomsSuccess ? (
            <div className="mt-5 flex flex-col gap-2">
              {chatRooms.map((chatRoom) => (
                <ChatRoomCard key={chatRoom.chatRoomId} chatRoom={chatRoom} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
};

export default ChatsSideBar;
