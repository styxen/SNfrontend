import ChatsSideBar from '../components/SideBar/ChatsSideBar';
import NavBar from '../components/Other/NavBar';
import ChatCard from '../components/Chat/ChatCard';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { useState } from 'react';

type ChatsPageProps = {
  wsClient: Socket;
};

const ChatsPage = ({ wsClient }: ChatsPageProps) => {
  const { chatRoomId } = useParams();
  const [isSideBarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="container mx-auto">
      <NavBar openSidebar={openSidebar} />
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
        <ChatsSideBar isSideBarOpen={isSideBarOpen} closeSidebar={closeSidebar} />
      </div>
    </div>
  );
};

export default ChatsPage;
