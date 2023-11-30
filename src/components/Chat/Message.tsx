import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { MessageData } from './ChatCard';
import formatTimesAgo from '../../utils/formatTimesAgo';

type MessageProps = {
  message: MessageData;
  selectMessage: (message: MessageData) => void;
};

const Message = ({ message, selectMessage }: MessageProps) => {
  const { currentUserId } = useGlobalContext();
  const [isHoverd, setIsHoverd] = useState(false);
  const { userId, messageEdited, updatedAt, createdAt } = message;

  return (
    <div
      onMouseOver={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
      onDoubleClick={() => selectMessage(message)}
      className={`flex ${userId === currentUserId ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`min-w-[10em] break-words rounded-full px-5 py-1 font-serif text-lg ${
          userId === currentUserId ? 'bg-gray-200 text-end' : 'bg-green-200'
        } border-2 ${messageEdited ? 'border-yellow-300' : ''}`}
      >
        {isHoverd ? (
          <div className="flex items-stretch justify-center gap-3 text-sm">
            <span>{messageEdited ? 'edited' : 'created'}</span>
            <div>
              {messageEdited ? formatTimesAgo(new Date(!messageEdited ? Date.now() : updatedAt)) : formatTimesAgo(new Date(createdAt))}
            </div>
          </div>
        ) : null}
        {message.messageContent}
      </div>
    </div>
  );
};

export default Message;
