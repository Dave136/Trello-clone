import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Board = {
  id: string;
  title: string;
  userId: string;
};

interface BoardState {
  boards: Board[];
  add: (board: Board) => void;
  remove: (id: string) => void;
  update: (board: Board) => void;
  getByUserId: (id: string) => Board[] | undefined;
  clear: () => void;
}

const useBoardStore = create<BoardState>()(
  devtools(
    persist(
      (set, get) => ({
        boards: [],
        add: (params) =>
          set((state) => ({
            boards: [params, ...state.boards],
          })),
        remove: (id) =>
          set({
            boards: get().boards.filter((board) => board.id !== id),
          }),
        update: (board) =>
          set((state) => ({
            boards: state.boards.map((current) =>
              current.id === board.id ? { ...board } : current
            ),
          })),
        getByUserId: (id) =>
          get().boards.filter((board) => board.userId === id),
        clear: () =>
          set((state) => ({
            boards: [],
          })),
      }),
      {
        name: 'user-storage',
      }
    )
  )
);

export default useBoardStore;
