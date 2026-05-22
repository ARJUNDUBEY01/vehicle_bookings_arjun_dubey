import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardStats } from '../features/data/dataSlice';
import { Helmet } from 'react-helmet-async';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ComposedChart, Line, Bar
} from 'recharts';

export default function Analytics() {
  const dispatch = useDispatch();
  const { charts, loading } = useSelector((state) => state.data.dashboardStats);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Mock data for timeseries (since backend aggregation might not have this yet)
  const timeSeriesData = [
    { time: '00:00', bookings: 120, revenue: 4000 },
    { time: '04:00', bookings: 80, revenue: 3000 },
    { time: '08:00', bookings: 450, revenue: 15000 },
    { time: '12:00', bookings: 600, revenue: 25000 },
    { time: '16:00', bookings: 550, revenue: 22000 },
    { time: '20:00', bookings: 300, revenue: 12000 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Analytics | Vehicle Bookings</title>
        <meta name="description" content="In-depth analytics and insights." />
      </Helmet>
      
      <div className="space-y-6 fade-in">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Advanced Analytics</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Hourly Booking Volume</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="time" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Revenue Trend vs Volume</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="time" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar yAxisId="left" dataKey="bookings" barSize={20} fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Vehicle Performance Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {charts.revenueByVehicle.map((v, i) => (
              <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{v.name}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">₹{v.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
