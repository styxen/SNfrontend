import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import reactLogo from '../assets/react.svg';

const LoginPage = () => {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src={reactLogo} alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
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
