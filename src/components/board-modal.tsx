import { MouseEvent, FormEvent, useState, LegacyRef } from 'react';
import BasicModal from './basic-modal';

type Props = {
  action: (payload: string) => Promise<void>;
  closeRef?: LegacyRef<HTMLAnchorElement>;
};

type HandleCreateEvent =
  | FormEvent<HTMLFormElement>
  | MouseEvent<HTMLButtonElement>;

export default function BoardModal({ action, closeRef }: Props) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmptyText = (text: string) =>
    !text || !text.trim() || text.length === 0;

  const handleCreate = async (e: HandleCreateEvent) => {
    e?.preventDefault();
    setLoading(true);

    if (isEmptyText(title)) return;

    await action(title);
    setTitle('');
    setLoading(false);
  };

  return (
    <BasicModal id="new-board" title="Add board" closeRef={closeRef}>
      <form className="flex flex-col" onSubmit={handleCreate}>
        <div className="form-control">
          <input
            type="text"
            className="input input-bordered"
            placeholder="title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>
        <button
          className={`btn btn-primary mt-4 ${
            isEmptyText(title) ? 'disabled' : ''
          } ${loading ? 'loading' : ''}`}
          onClick={handleCreate}
        >
          Add
        </button>
      </form>
    </BasicModal>
  );
}
