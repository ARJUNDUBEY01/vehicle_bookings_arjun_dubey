import { Helmet } from 'react-helmet-async';
import { Search, MoreVert, Mail, Phone } from '@mui/icons-material';

export default function Customers() {
  // Mock data for customers
  const customers = [
    { id: 'CUST-001', name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98765 43210', rides: 45, status: 'Active' },
    { id: 'CUST-002', name: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 98765 43211', rides: 12, status: 'Active' },
    { id: 'CUST-003', name: 'Amit Kumar', email: 'amit.k@example.com', phone: '+91 98765 43212', rides: 3, status: 'Inactive' },
    { id: 'CUST-004', name: 'Sneha Gupta', email: 'sneha.g@example.com', phone: '+91 98765 43213', rides: 28, status: 'Active' },
    { id: 'CUST-005', name: 'Vikram Singh', email: 'vikram.s@example.com', phone: '+91 98765 43214', rides: 0, status: 'New' },
  ];

  return (
    <>
      <Helmet>
        <title>Customers | Vehicle Bookings</title>
        <meta name="description" content="Manage customer database and profiles." />
      </Helmet>
      
      <div className="space-y-6 fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Customer Directory</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium">
            + Add Customer
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers by name, email or phone..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
            />
          </div>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{customer.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{customer.id}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <MoreVert />
                </button>
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  {customer.email}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Phone className="h-4 w-4 mr-3 text-gray-400" />
                  {customer.phone}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Rides: </span>
                  <span className="font-semibold text-gray-900 dark:text-white">{customer.rides}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  customer.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  customer.status === 'Inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {customer.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
