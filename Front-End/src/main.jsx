import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Provider } from 'react-redux'
import store from './Store/store.js'
import Layout from './Layout.jsx'
import { DriverPortal, TeamDashboard, LiveMonitoring, Home, History } from './index.js'

const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '', element: <Home /> },
        { path: '/driver', element: <DriverPortal /> },
        { path: '/team', element: <TeamDashboard /> },

        { path: '/live', element: <LiveMonitoring /> },
        { path: '/history', element: <History /> },
      ],
    },
  ]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
