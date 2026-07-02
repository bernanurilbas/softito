import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface Deal {
  id: string;
  customerId: string;
  title: string;
  value: number;
  stage: string; // new | contacted | proposal_sent | won | lost
  expectedCloseDate: string;
}

interface DealsState {
  items: Deal[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DealsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchDeals = createAsyncThunk('deals/fetchDeals', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:5000/deals');
    if (!response.ok) throw new Error('Satış fırsatları alınamadı.');
    return (await response.json()) as Deal[];
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const addDeal = createAsyncThunk(
  'deals/addDeal',
  async (dealData: Omit<Deal, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dealData,
          id: String(Date.now()),
        }),
      });
      if (!response.ok) throw new Error('Satış fırsatı eklenemedi.');
      return (await response.json()) as Deal;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateDeal = createAsyncThunk(
  'deals/updateDeal',
  async (deal: Deal, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/deals/${deal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deal),
      });
      if (!response.ok) throw new Error('Fırsat güncellenemedi.');
      return (await response.json()) as Deal;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteDeal = createAsyncThunk(
  'deals/deleteDeal',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/deals/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Fırsat silinemedi.');
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchDeals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDeals.fulfilled, (state, action: PayloadAction<Deal[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add
      .addCase(addDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
        const index = state.items.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteDeal.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((d) => d.id !== action.payload);
      });
  },
});

export default dealsSlice.reducer;
