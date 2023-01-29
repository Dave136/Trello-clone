import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface BoardState {
  boards: IBoard[];
  add: (board: IBoard) => void;
  remove: (id: string) => void;
  update: (id: string, board: Partial<IBoard>) => void;
  getById: (id: string) => IBoard | undefined;
  getByUserId: (id: string) => IBoard[] | undefined;
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
        update: (id, board) =>
          set((state) => ({
            boards: state.boards.map((current) =>
              current.id === id ? { ...current, ...board } : current
            ),
          })),
        getById: (id) => get().boards.find((board) => board.id === id),
        getByUserId: (id) =>
          get().boards.filter((board) => board.userId === id),
        clear: () =>
          set((state) => ({
            boards: [],
          })),
      }),
      {
        name: 'board-storage',
      }
    )
  )
);

export default useBoardStore;
