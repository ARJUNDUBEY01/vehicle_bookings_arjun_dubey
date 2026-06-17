import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch all bookings with pagination, sorting, and filters
export const fetchBookings = createAsyncThunk(
  'data/fetchBookings',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings', { params });
      return response.data; // Expected format: { data: [...], total: count }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

// Create a new booking
export const createBooking = createAsyncThunk(
  'data/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);

// Fetch dashboard aggregation analytics
export const fetchDashboardStats = createAsyncThunk(
  'data/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const [bookingsRes, revenueRes, successRes, cancelledRes] = await Promise.all([
        api.get('/stats/total-bookings').catch(() => ({ data: { data: { count: 0 } } })),
        api.get('/stats/revenue-by-vehicle').catch(() => ({ data: { data: [] } })),
        api.get('/stats/success-rides').catch(() => ({ data: { data: [] } })),
        api.get('/stats/cancelled-rides').catch(() => ({ data: { data: [] } }))
      ]);

      return {
        totalBookings: bookingsRes.data.data?.count || 0,
        revenueData: revenueRes.data.data || [],
        successData: successRes.data.data || [],
        cancelledData: cancelledRes.data.data || []
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

const initialState = {
  bookings: {
    data: [],
    total: 0,
    loading: false,
    error: null,
  },
  dashboardStats: {
    kpis: {
      totalBookings: 0,
      totalRevenue: 0,
      successRate: 0,
      cancellations: 0
    },
    charts: {
      revenueByVehicle: [],
      statusSplit: []
    },
    loading: false,
    error: null,
  }
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearDataError: (state) => {
      state.bookings.error = null;
      state.dashboardStats.error = null;
    }
  },
  extraReducers: (builder) => {
    // Bookings Reducers
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.bookings.loading = true;
        state.bookings.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings.loading = false;
        state.bookings.data = action.payload.data || [];
        state.bookings.total = action.payload.total || 0;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.bookings.loading = false;
        state.bookings.error = action.payload;
      });

    // Dashboard Stats Reducers
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboardStats.loading = true;
        state.dashboardStats.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStats.loading = false;
        
        const totalRevenue = action.payload.revenueData.reduce((acc, curr) => acc + (curr.totalRevenue || 0), 0);
        
        state.dashboardStats.kpis = {
          totalBookings: action.payload.totalBookings,
          totalRevenue: totalRevenue,
          successRate: action.payload.successData.length,
          cancellations: action.payload.cancelledData.length
        };

        state.dashboardStats.charts.revenueByVehicle = action.payload.revenueData.map(d => ({
          name: d._id || 'Unknown',
          revenue: d.totalRevenue || 0
        }));

        state.dashboardStats.charts.statusSplit = [
          { name: 'Success', value: action.payload.successData.length },
          { name: 'Cancelled', value: action.payload.cancelledData.length }
        ];
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboardStats.loading = false;
        state.dashboardStats.error = action.payload;
      });
  }
});

export const { clearDataError } = dataSlice.actions;
export default dataSlice.reducer;
