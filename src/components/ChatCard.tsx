import { useQuery } from '@tanstack/react-query';
import { useGlobalContext } from '../context/GlobalContext';
import { axiosRequest } from '../api/axios';
import { useEffect, useRef, useState } from 'react';
import Button from './ui/Button';
import Message from './Message';
import { Socket } from 'socket.io-client';

type ChatCardProps = {
  chatRoomId: string;
  wsClient: Socket;
};

export type MessageData = {
  userId: string;
  chatRoomId: string;
  messageId: string;
  messageContent: string;
  messageEdited: boolean;
  updatedAt: Date;
  createdAt: Date;
};

const ChatCard = ({ chatRoomId, wsClient }: ChatCardProps) => {
  const { token, currentUserId } = useGlobalContext();
  const [newMessage, setNewMessage] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    data: messages,
    isLoading: areMessagesLoading,
    isSuccess: areMessagesSuccess,
  } = useQuery({
    queryKey: ['chatMessages', chatRoomId],
    queryFn: () => fetchChatMessages(),
    enabled: !!chatRoomId,
  });

  useEffect(() => {
    wsClient.emit('JoinRoomEvent', { chatRoomId, token });
  }, [chatRoomId]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, [messages]);

  const fetchChatMessages = async () => {
    const response = axiosRequest<MessageData[]>({
      method: 'get',
      url: `messages/${chatRoomId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage) return;

    wsClient.emit('SendMessageEvent', { chatRoomId, userId: currentUserId, messageContent: newMessage });
    setNewMessage('');
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col justify-between gap-5">
      <div className="flex h-full flex-col gap-2 overflow-scroll" ref={scrollContainerRef}>
        {areMessagesLoading ? (
          <p>Messages are loading...</p>
        ) : areMessagesSuccess && messages.length > 0 ? (
          <>
            {messages.map((message) => (
              <Message key={message.messageId} message={message} />
            ))}
          </>
        ) : (
          <p>There are no messages.</p>
        )}
      </div>
      <form onSubmit={(e) => sendMessage(e)} className="flex justify-between gap-5">
        <input
          type="text"
          required
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full overflow-x-auto rounded-full"
        />
        <Button className="rounded-full">Send</Button>
      </form>
    </div>
  );
};

export default ChatCard;
