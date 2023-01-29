import { createBrowserRouter } from 'react-router-dom';
import Board from './board';
import Boards from './boards';
import Login from './login';
import NotFound from './not-found';
import Register from './register';
import Root from './root';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        errorElement: <NotFound />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: <Register />,
          },
          {
            path: 'boards',
            element: <Boards />,
          },
          {
            path: 'boards/:board',
            element: <Board />,
          },
        ],
      },
    ],
  },
]);

export default router;
