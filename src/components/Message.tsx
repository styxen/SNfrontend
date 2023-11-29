import { useGlobalContext } from '../context/GlobalContext';
import { MessageData } from './ChatCard';

type MessageProps = {
  message: MessageData;
};

const Message = ({ message }: MessageProps) => {
  const { currentUserId } = useGlobalContext();
  const { userId } = message;

  return (
    <div className={`flex ${userId === currentUserId ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`min-w-[10em] break-words rounded-full px-5 py-1 font-serif text-lg ${
          userId === currentUserId ? 'bg-gray-200 text-end' : 'bg-green-200'
        }`}
      >
        {message.messageContent}
      </div>
    </div>
  );
};

export default Message;
