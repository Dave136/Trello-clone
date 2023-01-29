import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import 'react-toastify/dist/ReactToastify.min.css';

export default function Root() {
  const user = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    navigate('/boards');
  }, [user]);

  return (
    <div>
      {user?.id && (
        <header>
          <nav>
            <a href="#">link1</a>
            <a href="#">link2</a>
            <a href="#">link3</a>
          </nav>
        </header>
      )}
      <Outlet />
      <ToastContainer />
    </div>
  );
}
