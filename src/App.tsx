import { Routes, Route } from 'react-router-dom';
import { GlobalContextProvider } from './context/GlobalContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserPage from './pages/UserPage';
import MainPage from './pages/MainPage';

function App() {
  return (
    <GlobalContextProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="/:id" element={<UserPage />} />
      </Routes>
    </GlobalContextProvider>
  );
}

export default App;
