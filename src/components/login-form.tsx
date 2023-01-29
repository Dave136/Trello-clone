import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { toast } from 'react-toastify';
import useUserStore from '../store/user';
import { useNavigate } from 'react-router-dom';

type FormInput = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup.string().email().lowercase().required(),
  password: yup.string().required(),
});

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();
  // const { setRefreshLogin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ email, password }: FormInput) => {
    try {
      setLoading(true);
      login(email, password);
      navigate('/boards');
      // setToken(result.token);
      // setRefreshLogin(true);
    } catch (error: any) {
      toast.error(error.message || 'Problem authenticating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card flex-shrink-0 w-full bg-base-100">
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="john@doe.com"
              {...register('email')}
              className={`input input-bordered ${
                errors.email?.message && 'input-error'
              }`}
            />
            {errors.email?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.email?.message}
                </span>
              </label>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              {...register('password')}
              className={`input input-bordered ${
                errors.password?.message && 'input-error'
              }`}
            />
            <label className="label">
              {errors.password?.message && (
                <span className="label-text-alt text-error">
                  {errors.password?.message}
                </span>
              )}
              <a href="#" className="label-text-alt link link-hover">
                Forgot password?
              </a>
            </label>
          </div>
          <div className="form-control mt-6">
            <button
              className={`btn btn-primary ${loading && 'loading'}`}
              type="submit"
            >
              {loading ? '' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
