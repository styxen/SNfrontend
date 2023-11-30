import { Link } from 'react-router-dom';
import AuthForm from '../components/Other/AuthForm';

const LoginPage = () => {
  return (
    <div className="bg-grey-lighter flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-36 sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <AuthForm authAction="login" />
        <div className="mt-6 text-center text-sm">
          <Link to={'/auth/register'} className="font-semibold leading-6 text-slate-900 hover:text-slate-500">
            Don't have an accaunt?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
