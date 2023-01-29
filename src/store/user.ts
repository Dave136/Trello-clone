import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
};

interface UserState {
  user: User | null;
  users: User[];
  register: (params: Omit<User, 'id'>) => void;
  login: (email: string, password: string) => void;
  findByEmail: (email: string) => User | undefined;
  clear: () => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        users: [],
        register: (params) =>
          set((state) => ({
            users: [
              {
                id: crypto.randomUUID(),
                ...params,
              },
              ...state.users,
            ],
          })),
        login: (email, password) =>
          set((state) => {
            const found = state.users.find((user) => user.email === email);

            if (!found?.id || password !== found.password) {
              throw new Error('Invalid credentials');
            }

            return {
              user: found,
            };
          }),
        findByEmail: (email) =>
          get().users.find((user) => user.email === email),
        clear: () =>
          set((state) => ({
            users: [],
            user: null,
          })),
        logout: () =>
          set((state) => ({
            user: null,
          })),
      }),
      {
        name: 'user-storage',
      }
    )
  )
);

export default useUserStore;
