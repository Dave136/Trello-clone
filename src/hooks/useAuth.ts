import { useEffect, useState } from 'react';
import useUserStore, { type User } from '../store/user';

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const currentUser = useUserStore((state) => state.user);

  useEffect(() => {
    if (!currentUser) return;

    setUser(currentUser);
  }, []);

  return user;
}
