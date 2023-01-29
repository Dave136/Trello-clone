import { MouseEvent, FormEvent, useState, LegacyRef } from 'react';
import BasicModal from './basic-modal';

type Props = {
  action: (payload: string) => Promise<void>;
  closeRef?: LegacyRef<HTMLAnchorElement>;
};

type HandleCreateEvent =
  | FormEvent<HTMLFormElement>
  | MouseEvent<HTMLButtonElement>;

export default function ColumnModal({ action, closeRef }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmptyText = (text: string) =>
    !text || !text.trim() || text.length === 0;

  const handleCreate = async (e: HandleCreateEvent) => {
    e?.preventDefault();
    setLoading(true);

    if (isEmptyText(name)) {
      setLoading(false);
      return;
    }

    await action(name);
    setName('');
    setLoading(false);
  };

  return (
    <BasicModal id="new-column" title="Add column" closeRef={closeRef}>
      <form className="flex flex-col" onSubmit={handleCreate}>
        <div className="form-control">
          <input
            type="text"
            className="input input-bordered"
            placeholder="title"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <button
          className={`btn btn-primary mt-4 ${
            isEmptyText(name) ? 'disabled' : ''
          } ${loading ? 'loading' : ''}`}
          onClick={handleCreate}
        >
          Add column
        </button>
      </form>
    </BasicModal>
  );
}
