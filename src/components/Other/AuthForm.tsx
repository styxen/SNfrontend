import { FormEvent, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { axiosRequest } from '../../api/axios';
import { useMutation } from '@tanstack/react-query';

type AuthFormProps = {
  authAction: 'login' | 'register';
};

type ResponseData = {
  token: string;
  userId: string;
};

type AuthData = {
  userEmail: string;
  userPassword: string;
};

const AuthForm = ({ authAction }: AuthFormProps) => {
  const { setCurrentUserId, setToken } = useGlobalContext();
  const [authData, setAuthData] = useState<AuthData>({ userEmail: '', userPassword: '' });
  const navigate = useNavigate();

  const { mutate: mutateAuth } = useMutation({
    mutationFn: () => authRequest(),
    onSuccess: (data) => {
      setCurrentUserId(data.userId);
      setToken(data.token);
      navigate(`/`);
    },
  });

  const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutateAuth();
  };

  const authRequest = async () => {
    const response = await axiosRequest<ResponseData>({
      method: 'post',
      url: `/auth/${authAction}`,
      data: authData,
    });

    return response;
  };

  return (
    <form className="space-y-6" onSubmit={(event) => handleAuth(event)} method="POST">
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
            onChange={(event) => setAuthData((data) => ({ ...data, userEmail: event.target.value }))}
            value={authData.userEmail}
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
            onChange={(event) => setAuthData((data) => ({ ...data, userPassword: event.target.value }))}
            value={authData.userPassword}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <Button type="submit" className="mx-auto w-full max-w-sm">
          {authAction === 'login' ? 'Sign In' : 'Register'}
        </Button>
      </div>
    </form>
  );
};

export default AuthForm;
