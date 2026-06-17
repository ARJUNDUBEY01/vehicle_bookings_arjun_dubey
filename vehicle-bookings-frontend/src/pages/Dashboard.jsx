import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardStats } from '../features/data/dataSlice';
import { Helmet } from 'react-helmet-async';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];

export default function Dashboard() {
  const dispatch = useDispatch();
  const { kpis, charts, loading, error } = useSelector((state) => state.data.dashboardStats);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">Error loading dashboard: {error}</div>;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | Vehicle Bookings</title>
        <meta name="description" content="Overview of vehicle booking analytics and performance metrics." />
      </Helmet>
      
      <div className="space-y-6 fade-in">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Overview Analytics</h2>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bookings</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{kpis.totalBookings.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">₹{kpis.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Success Rate</h3>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
              {kpis.totalBookings > 0 ? Math.round((kpis.successRate / kpis.totalBookings) * 100) : 0}%
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Cancellations</h3>
            <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">{kpis.cancellations}</p>
          </div>
        </div>

        {/* Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Revenue by Vehicle Type</h3>
            <div className="h-80">
              {charts.revenueByVehicle.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.revenueByVehicle}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full text-gray-400 dark:text-gray-500">No aggregation data available</div>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Booking Status Split</h3>
            <div className="h-80 flex items-center justify-center">
              {charts.statusSplit.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.statusSplit}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {charts.statusSplit.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-gray-400 dark:text-gray-500">No status data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
