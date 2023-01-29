import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/navbar';
import useUserStore from '../store/user';
import 'react-toastify/dist/ReactToastify.min.css';

export default function Root() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    try {
      if (!user?.id) {
        navigate('/login');
        return;
      }

      if (['login', 'register'].includes(location.pathname.split('/')[1])) {
        navigate('/boards');
        return;
      }

      navigate(location.pathname);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <button className="btn btn-ghost loading"></button>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Outlet />
      <ToastContainer />
    </div>
  );
}
