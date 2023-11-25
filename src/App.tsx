import { Routes, Route } from 'react-router-dom';
import { GlobalContextProvider } from './context/GlobalContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import UserPage from './pages/UserPage';
import NewsPage from './pages/NewsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <GlobalContextProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="/news" element={<NewsPage />} />
        <Route path="/:userId" element={<UserPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </GlobalContextProvider>
  );
}

export default App;
