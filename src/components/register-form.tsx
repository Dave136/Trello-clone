import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/user';

type FormInput = {
  username: string;
  email: string;
  password: string;
  repeatPassword: boolean;
};

const schema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().lowercase().required(),
  password: yup.string().required(),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useUserStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormInput) => {
    try {
      setLoading(true);
      registerUser(data);
      toast.success('User has been registered successfully!');
      setTimeout(() => {
        navigate('/boards');
      }, 1000);
    } catch (error: any) {
      if (error?.status >= 400 || error?.status < 500) {
        toast.warning(error.data);
        return;
      }
      toast.error(
        error?.data || 'Server Error! Was an error while creating user'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card !max-w-md w-full bg-base-100">
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="johndoe"
              {...register('username')}
              className={`input w-full input-bordered ${
                errors.username?.message && 'input-error'
              }`}
            />
            {errors.username?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.username?.message}
                </span>
              </label>
            )}
          </div>
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
            {errors.password?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.password?.message}
                </span>
              </label>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Repeat Password</span>
            </label>
            <input
              type="password"
              placeholder="repeat password"
              {...register('repeatPassword')}
              className={`input input-bordered ${
                errors.repeatPassword?.message && 'input-error'
              }`}
            />
            {errors.repeatPassword?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.repeatPassword?.message}
                </span>
              </label>
            )}
          </div>
          <div className="form-control mt-6">
            <button
              className={`btn btn-info ${loading && 'loading'}`}
              type="submit"
            >
              {loading ? '' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
