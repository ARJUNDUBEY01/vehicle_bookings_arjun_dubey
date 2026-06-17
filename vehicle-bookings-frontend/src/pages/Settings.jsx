import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../features/ui/uiSlice';
import { Helmet } from 'react-helmet-async';
import { DarkMode, LightMode, Person, Notifications, Security } from '@mui/icons-material';

export default function Settings() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Helmet>
        <title>Settings | Vehicle Bookings</title>
        <meta name="description" content="Application settings and preferences." />
      </Helmet>
      
      <div className="max-w-4xl space-y-6 fade-in">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>

        {/* Profile Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <Person className="text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Profile Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input 
                type="text" 
                defaultValue={user?.name || 'Admin User'} 
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input 
                type="email" 
                defaultValue={user?.email || 'admin@rideops.com'} 
                disabled
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium">
              Save Changes
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <DarkMode className="text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Appearance</h3>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark mode theme for the dashboard</p>
            </div>
            <button 
              onClick={() => dispatch(toggleTheme())}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <Notifications className="text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Alerts</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive daily summary reports</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
