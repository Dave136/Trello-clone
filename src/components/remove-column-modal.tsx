import { LegacyRef } from 'react';
import BasicModal from './basic-modal';

type Props = {
  action: (payload: boolean) => Promise<void>;
  closeRef?: LegacyRef<HTMLAnchorElement>;
};

export default function RemoveColumnModal({ action, closeRef }: Props) {
  return (
    <BasicModal id="remove-column" title="Add column" closeRef={closeRef}>
      <div className="flex flex-col">
        <h2>Are you sure that you want remove the column?</h2>
        <div className="flex gap-2 mt-4 justify-center">
          <button className="btn btn-error" onClick={() => action(true)}>
            remove
          </button>
          <button className="btn btn-outline" onClick={() => action(false)}>
            cancel
          </button>
        </div>
      </div>
    </BasicModal>
  );
}
