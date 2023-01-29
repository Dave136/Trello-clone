import { House, User } from 'phosphor-react';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../store/user';

export default function Navbar() {
  const user = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    user.logout();
    navigate('/login');
  };

  if (!user.user?.id) {
    return null;
  }

  return (
    <div className="navbar bg-base-300">
      <div className="navbar-start">
        <Link
          to="/boards"
          className="btn btn-ghost btn-circle normal-case text-xl"
        >
          <House size={24} weight="thin" />
        </Link>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost normal-case text-xl">Trello</a>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="rounded-full">
              <User size={24} weight="thin" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            {/* <li>
              <a className="justify-between">Profile</a>
            </li>
            <li>
              <a>Settings</a>
            </li> */}
            <li onClick={handleLogout}>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
