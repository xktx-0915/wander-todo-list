import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Plan from '../pages/Plan';
import Types from '../pages/Types';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'plans',
        element: <Plan />,
      },
      {
        path: 'types',
        element: <Types />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
