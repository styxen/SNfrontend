import { FormEvent, useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from './ui/Button';

type AuthFormProps = {
  authAction: 'login' | 'register';
};

type ResponseData = {
  token: string;
  userId: string;
};

const AuthForm = ({ authAction }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setUserId, userId } = useGlobalContext();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios<ResponseData>({
        method: 'post',
        baseURL: process.env.REACT_APP_BASE_URL,
        url: `/auth/${authAction}`,
        data: {
          userEmail: email,
          userPassword: password,
        },
        headers: {},
      });

      setToken(response.data.token);
      setUserId(response.data.userId);
      navigate(`/${userId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.msg);
      }
      console.log(error);
    }
  };

  return (
    <form className="space-y-6" onSubmit={(event) => handleSubmit(event)} method="POST">
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Email address
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
            Password
          </label>
        </div>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <Button type="submit" className="max-w-sm mx-auto w-full">
          {authAction === 'login' ? 'Sign In' : 'Register'}
        </Button>
      </div>
    </form>
  );
};

export default AuthForm;
