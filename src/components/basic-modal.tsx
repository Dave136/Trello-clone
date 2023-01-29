import { LegacyRef } from 'react';

type Props = {
  id: string;
  title: string;
  className?: string;
  children: JSX.Element | JSX.Element[];
  closeRef?: LegacyRef<HTMLAnchorElement>;
};

function BasicModal({ id, title, children, className, closeRef }: Props) {
  return (
    <>
      <div className="modal" id={id}>
        <div className={`modal-box w-96 max-w-2xl ${className}`}>
          <header className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">{title}</h3>
            <a
              href="#"
              className="btn btn-sm btn-circle bg-base-300 border-none text-black"
              ref={closeRef}
            >
              ✕
            </a>
          </header>
          {children}
        </div>
      </div>
    </>
  );
}

export default BasicModal;
