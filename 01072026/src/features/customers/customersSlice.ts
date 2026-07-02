import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  avatar: string;
}

interface CustomersState {
  items: Customer[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CustomersState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:5000/customers');
    if (!response.ok) throw new Error('Müşteri listesi alınamadı.');
    return (await response.json()) as Customer[];
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const addCustomer = createAsyncThunk(
  'customers/addCustomer',
  async (customerData: Omit<Customer, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...customerData,
          id: String(Date.now()), // generate unique id string
        }),
      });
      if (!response.ok) throw new Error('Müşteri eklenemedi.');
      return (await response.json()) as Customer;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async (customer: Customer, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/customers/${customer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });
      if (!response.ok) throw new Error('Müşteri güncellenemedi.');
      return (await response.json()) as Customer;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/customers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Müşteri silinemedi.');
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<Customer[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add
      .addCase(addCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.items.unshift(action.payload);
      })
      // Update
      .addCase(updateCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteCustomer.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default customersSlice.reducer;
