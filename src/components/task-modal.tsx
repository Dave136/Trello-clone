import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, LegacyRef } from 'react';
import BasicModal from './basic-modal';

type Props = {
  action: (payload: FormInput) => Promise<void>;
  closeRef?: LegacyRef<HTMLAnchorElement>;
};

type FormInput = {
  title: string;
  label: 'design' | 'development' | 'feature' | 'bugs' | 'other';
  description: string;
};

const schema = yup.object({
  title: yup.string().required(),
  label: yup.string().required(),
  description: yup.string().required(),
});

export default function TaskModal({ action, closeRef }: Props) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormInput) => {
    try {
      setLoading(true);
      await action(data);
      toast.success('Task added!');
    } catch (error: any) {
      console.log(error);
      toast.error('Sorry! cannot create tasks');
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <BasicModal id="new-task" title="Add task" closeRef={closeRef}>
      <div className="card flex-shrink-0 w-full bg-base-100">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                placeholder="john@doe.com"
                {...register('title')}
                className={`input input-bordered ${
                  errors.title?.message && 'input-error'
                }`}
              />
              {errors.title?.message && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.title?.message}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Label</span>
              </label>
              <select
                {...register('label')}
                className={`input input-bordered ${
                  errors.label?.message && 'input-error'
                }`}
              >
                <option disabled defaultValue="">
                  Label
                </option>
                <option value="design">Design</option>
                <option value="development">Development</option>
                <option value="feature">Feature</option>
                <option value="bugs">Bugs</option>
                <option value="other">Other</option>
              </select>
              <label className="label">
                {errors.label?.message && (
                  <span className="label-text-alt text-error">
                    {errors.label?.message}
                  </span>
                )}
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                type="text"
                placeholder="Description"
                {...register('description')}
                className={`input input-bordered ${
                  errors.description?.message && 'input-error'
                }`}
              />
              <label className="label">
                {errors.description?.message && (
                  <span className="label-text-alt text-error">
                    {errors.description?.message}
                  </span>
                )}
              </label>
            </div>
            <div className="form-control mt-6">
              <button
                className={`btn btn-primary ${loading && 'loading'}`}
                type="submit"
              >
                {loading ? '' : 'Add task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </BasicModal>
  );
}
