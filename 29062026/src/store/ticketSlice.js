import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5001/tickets';

// Async Thunks
export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Biletler alınırken sunucuda bir hata oluştu.');
  }
  return await response.json();
});

export const addTicket = createAsyncThunk('tickets/addTicket', async (newTicket) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTicket),
  });
  if (!response.ok) {
    throw new Error('Bilet eklenirken bir hata oluştu.');
  }
  return await response.json();
});

export const updateTicket = createAsyncThunk('tickets/updateTicket', async (updatedTicket) => {
  const response = await fetch(`${API_URL}/${updatedTicket.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTicket),
  });
  if (!response.ok) {
    throw new Error('Bilet güncellenirken bir hata oluştu.');
  }
  return await response.json();
});

export const deleteTicket = createAsyncThunk('tickets/deleteTicket', async (ticketId) => {
  const response = await fetch(`${API_URL}/${ticketId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Bilet silinirken bir hata oluştu.');
  }
  return ticketId;
});

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    tickets: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    searchCriteria: {
      from: '',
      to: '',
      date: new Date().toISOString().split('T')[0], // Defaults to today
      type: 'bus', // 'bus' or 'flight'
    },
    selectedTicketId: localStorage.getItem('selectedTicketId') || null,
    filters: {
      maxPrice: 3000,
      selectedCompanies: [],
      sortBy: 'time', // 'time' or 'price'
    }
  },
  reducers: {
    setSearchCriteria: (state, action) => {
      state.searchCriteria = { ...state.searchCriteria, ...action.payload };
    },
    setSelectedTicketId: (state, action) => {
      state.selectedTicketId = action.payload;
      if (action.payload) {
        localStorage.setItem('selectedTicketId', action.payload);
      } else {
        localStorage.removeItem('selectedTicketId');
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        maxPrice: 3000,
        selectedCompanies: [],
        sortBy: 'time',
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tickets
      .addCase(fetchTickets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add Ticket
      .addCase(addTicket.fulfilled, (state, action) => {
        state.tickets.push(action.payload);
      })
      // Update Ticket
      .addCase(updateTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex((ticket) => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      // Delete Ticket
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter((ticket) => ticket.id !== action.payload);
      });
  }
});

export const { setSearchCriteria, setSelectedTicketId, setFilters, resetFilters } = ticketSlice.actions;
export default ticketSlice.reducer;

