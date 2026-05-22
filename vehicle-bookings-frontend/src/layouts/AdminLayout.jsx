import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, toggleTheme } from '../features/ui/uiSlice';
import { logout } from '../features/auth/authSlice';
import { 
  Menu, Dashboard, DirectionsCar, BarChart, 
  People, Settings, Notifications, LightMode, DarkMode, ExitToApp
} from '@mui/icons-material';

const AdminLayout = () => {
  const { sidebarOpen, theme } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { name: 'Bookings', path: '/bookings', icon: <DirectionsCar /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart /> },
    { name: 'Customers', path: '/customers', icon: <People /> },
    { name: 'Settings', path: '/settings', icon: <Settings /> },
  ];

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${theme}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-20`}>
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {sidebarOpen ? 'Vehicle Bookings' : 'VB'}
          </span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {sidebarOpen && <span>{link.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => dispatch(logout())}
            className="flex items-center w-full px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
          >
            <ExitToApp className="mr-3" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center">
            <button 
              onClick={() => dispatch(toggleSidebar())}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            >
              <Menu />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-800 dark:text-white">
              {navLinks.find(l => location.pathname.startsWith(l.path))?.name || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Notifications />
            </button>
            <button 
              onClick={() => dispatch(toggleTheme())}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {theme === 'dark' ? <LightMode /> : <DarkMode />}
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
