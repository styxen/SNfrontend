import { useGlobalContext } from '../../context/GlobalContext';
import { ChatRoomData } from '../SideBar/ChatsSideBar';
import { Link, useParams } from 'react-router-dom';
import Button from '../ui/Button';
import { MessageSquare } from 'lucide-react';
import useImage from '../../hooks/useImage';

type ChatRoomCardProps = {
  chatRoom: ChatRoomData;
};

const ChatRoomCard = ({ chatRoom }: ChatRoomCardProps) => {
  const { chatRoomId: currentChatRoomId } = useParams();
  const { currentUserId, token } = useGlobalContext();
  const { chatRoomId, profileImageId, prfileName, firstUserId, secondUserId } = chatRoom;
  const otherUserId = firstUserId === currentUserId ? secondUserId : firstUserId;

  const {
    data: avatarImageSrc,
    isLoading: isAvatarImageSrcLoading,
    isSuccess: isAvatarImageSrcSuccsess,
  } = useImage({ imageId: profileImageId, imageParams: 'compressed', token });

  return (
    <div
      className={`relative flex w-full items-center gap-2 rounded-full p-1 ${
        !currentChatRoomId || currentChatRoomId !== chatRoomId ? 'bg-gray-100' : 'bg-green-200'
      }`}
    >
      {isAvatarImageSrcLoading ? (
        <div>Image is loading...</div>
      ) : isAvatarImageSrcSuccsess ? (
        <Link to={`/${otherUserId}`} replace>
          <img className="h-20 w-20 cursor-pointer rounded-full border-4 border-white" src={avatarImageSrc} alt="avatar" />
        </Link>
      ) : null}
      <div className="flex w-8/12 flex-col">
        <Link to={`/${otherUserId}`} replace>
          <h3 className="cursor-pointer text-left font-serif text-2xl">{prfileName}</h3>
        </Link>
        <Link to={`/chats/${chatRoomId}`} className="h-fit w-full">
          <Button size="sm" className="w-full rounded-2xl bg-transparent">
            <MessageSquare />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ChatRoomCard;
