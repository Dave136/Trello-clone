import { useEffect, useState } from 'react';
import BoardSkeleton from '../components/board-skeleton';
import DropContainers from '../components/drop-containers';
import useBoardStore from '../store/board';
import useUserStore from '../store/user';

const initialState: IBoard = {
  id: '',
  title: '',
  userId: '',
  starred: false,
  items: [],
};

export default function Board() {
  const [loading, setLoading] = useState(false);
  const [board, setBoard] = useState<IBoard>(initialState);
  // const params = useParams();
  const boardStore = useBoardStore();
  const user = useUserStore((state) => state.user);

  const fetchBoard = async () => {
    try {
      const data = boardStore.getByUserId(user!.id);

      if (!data?.length) {
        return;
      }

      setBoard(prepareBoard(data[0]));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const prepareBoard = (board: IBoard) => {
    const items = {
      ...board,
      items: (board.items || []).map((item) => ({
        ...item,
        cards: item.cards || [],
      })),
    };

    return items;
  };

  useEffect(() => {
    setLoading(true);
    if (user?.id) {
      fetchBoard();
    }
  }, []);

  if (loading) {
    return <BoardSkeleton count={5} />;
  }

  return <DropContainers id={board.id} items={board?.items ?? []} />;
}
