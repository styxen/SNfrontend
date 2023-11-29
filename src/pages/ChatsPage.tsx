import ChatsSideBar from '../components/ChatsSideBar';
import NavBar from '../components/NavBar';
import ChatCard from '../components/ChatCard';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';

type ChatsPageProps = {
  wsClient: Socket;
};

const ChatsPage = ({ wsClient }: ChatsPageProps) => {
  const { chatRoomId } = useParams();

  return (
    <div className="container mx-auto">
      <NavBar />
      <div className="flex h-[98vh] pt-16">
        <div className="h-full flex-grow px-20 py-6">
          <div className="h-full rounded-2xl border-b bg-white px-10 py-6 shadow-lg">
            {!chatRoomId ? (
              <h3 className="font-serif text-3xl">Select a chat.</h3>
            ) : (
              <ChatCard chatRoomId={chatRoomId} wsClient={wsClient} />
            )}
          </div>
        </div>
        <ChatsSideBar />
      </div>
    </div>
  );
};

export default ChatsPage;
