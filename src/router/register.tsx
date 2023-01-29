import { Link } from 'react-router-dom';
import RegisterForm from '../components/register-form';

export default function Register() {
  return (
    <section className="hero min-h-screen bg-base-200 relative">
      <div className="hero-content">
        <header className="flex items-center justify-center">
          {/* <img className="w-12" src={LogoWhite} alt="Twitt logo white" /> */}
        </header>
        <section className="flex flex-col items-center justify-center min-w-[90rem]">
          <h3 className="font-bold text-3xl my-4">Register</h3>
          <RegisterForm />
          <label className="label-text mt-4">
            Already have an account?{' '}
            <Link to="/login" className="label-text link-hover">
              login
            </Link>
          </label>
        </section>
      </div>
    </section>
  );
}
