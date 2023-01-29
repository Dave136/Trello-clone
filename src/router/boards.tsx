import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Star } from 'phosphor-react';
import BoardsSkeleton from '../components/boards-skeleton';
import BoardTitle from '../components/board-title';
import BoardModal from '../components/board-modal';
import useBoardStore from '../store/board';
import useUserStore from '../store/user';

export default function Boards() {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const openModalRef = useRef<HTMLAnchorElement | null>(null);
  const closeModalRef = useRef<HTMLAnchorElement | null>(null);
  const [refresh, setRefresh] = useState(false);

  const boardStore = useBoardStore();

  const fetchBoards = async () => {
    try {
      const result = boardStore?.getByUserId(user!.id) || [];
      setBoards(result);
      setRefresh(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      fetchBoards();
    }
  }, [refresh]);

  const addBoard = async (title: string) => {
    if (!user?.id) return;

    const board: IBoard = {
      title,
      id: crypto.randomUUID(),
      userId: user?.id,
      starred: false,
    };

    boardStore.add(board);
    closeModalRef.current?.click();
    toast.success('Board added successfully!');
    setRefresh(true);
  };

  const starBoard = (id: string, starred: boolean) => {
    boardStore.update(id, { starred });
    setRefresh(true);
  };

  const starredBoards = boards.filter((board) => board.starred);

  if (loading) {
    return <BoardsSkeleton count={4} />;
  }

  return (
    <div className="pt-16 py-4 px-3">
      {!!starredBoards.length && (
        <>
          <div className="flex mb-3 items-center text-xl">
            <Star size={24} className="mr-2" /> Starred Boards
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {starredBoards.map((board) => (
              <BoardTitle
                key={board?.id}
                title={board.title}
                handleClick={() => navigate(`/boards/${board.id}`)}
                starToggling={() => starBoard(board?.id, !board.starred)}
                starred={board.starred}
              />
            ))}
          </div>
        </>
      )}

      <div className="flex mb-3 items-center text-xl">
        <User size={24} className="mr-2" /> Personal Boards
      </div>
      <div className="grid grid-cols-4 gap-4">
        {boards.map((board) => (
          <BoardTitle
            key={board.id}
            title={board.title}
            handleClick={() => navigate(`/boards/${board.id}`)}
            starToggling={() => starBoard(board.id, !board.starred)}
            starred={board.starred}
          />
        ))}

        <BoardTitle
          title="Add new board"
          handleClick={() => openModalRef.current?.click()}
          addition
        />
        <a href="#new-board" className="hidden" ref={openModalRef} hidden />

        <BoardModal action={addBoard} closeRef={closeModalRef} />
      </div>
    </div>
  );
}
