import { Routes, Route } from 'react-router-dom';
import { GlobalContextProvider } from './context/GlobalContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import UserPage from './pages/UserPage';
import NewsPage from './pages/NewsPage';
import NotFoundPage from './pages/NotFoundPage';
import ChatsPage from './pages/ChatsPage';
import { io } from 'socket.io-client';
import { MessageData } from './components/ChatCard';
import { useQueryClient } from '@tanstack/react-query';

function App() {
  const wsClient = io('http://localhost:3000');
  const queryClient = useQueryClient();

  wsClient.on('ReceiveMessageEvent', (data: MessageData) => {
    queryClient.setQueryData(['chatMessages', data.chatRoomId], (prev: MessageData[]) => {
      return [...prev, data];
    });
  });

  return (
    <GlobalContextProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="/news" element={<NewsPage />} />
        <Route path="/chats">
          <Route path="" element={<ChatsPage wsClient={wsClient} />} />
          <Route path=":chatRoomId" element={<ChatsPage wsClient={wsClient} />} />
        </Route>
        <Route path="/:userId" element={<UserPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </GlobalContextProvider>
  );
}

export default App;
