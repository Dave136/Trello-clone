import { Link } from 'react-router-dom';
import LoginForm from '../components/login-form';

export default function Login() {
  return (
    <section className="hero min-h-screen bg-base-200 relative">
      <div className="hero-content">
        <section className="flex flex-col items-center justify-center min-w-[25rem]">
          <h3 className="font-bold text-3xl my-4">Register</h3>
          <LoginForm />
          <label className="label-text mt-4">
            You don't have an account?{' '}
            <Link to="/register" className="label-text link-hover">
              register
            </Link>
          </label>
        </section>
      </div>
    </section>
  );
}
