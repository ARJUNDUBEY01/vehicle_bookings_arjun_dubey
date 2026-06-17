import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { loginUser, clearError } from '../features/auth/authSlice';
import { DirectionsCar, Visibility, VisibilityOff } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      const resultAction = await dispatch(loginUser(values));
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success('Successfully logged in!');
        navigate('/dashboard');
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>Login | Vehicle Bookings Admin</title>
        <meta name="description" content="Login to the Vehicle Bookings Admin Dashboard" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <DirectionsCar className="text-blue-600 dark:text-blue-400 h-8 w-8" style={{ fontSize: 36 }} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Vehicle Bookings
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to access your dashboard
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`appearance-none block w-full px-4 py-3 border ${
                      formik.touched.email && formik.errors.email 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors`}
                    placeholder="admin@rideops.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`appearance-none block w-full px-4 py-3 border ${
                      formik.touched.password && formik.errors.password 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors`}
                    placeholder="••••••••"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formik.errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
