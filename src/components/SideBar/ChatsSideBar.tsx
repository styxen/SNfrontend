import { useGlobalContext } from '../../context/GlobalContext';
import { axiosRequest } from '../../api/axios';
import { useQuery } from '@tanstack/react-query';
import ChatRoomCard from '../Chat/ChatRoomCard';
import Button from '../ui/Button';
import { PanelRightClose } from 'lucide-react';
import { useEffect } from 'react';

export type ChatRoomData = {
  chatRoomId: string;
  firstUserId: string;
  secondUserId: string;
  profileImageId: string | null;
  prfileName: string;
};

type ChatsSideBarProps = {
  isSideBarOpen: boolean;
  closeSidebar: () => void;
};

const ChatsSideBar = ({ isSideBarOpen, closeSidebar }: ChatsSideBarProps) => {
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000 && isSideBarOpen) {
        closeSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isSideBarOpen]);

  return (
    <aside className={`h-[92vh] flex-none px-3 py-6 font-sans ${isSideBarOpen ? 'flxe absolute right-5 z-10 w-[24rem]' : 'w-96'}`}>
      <Button
        onClick={closeSidebar}
        variant="ghost"
        size="sm"
        className={`h-fit w-fit p-0 ${isSideBarOpen ? 'absolute left-3 top-6 flex rounded-lg' : 'hidden'}`}
      >
        <PanelRightClose />
      </Button>
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
