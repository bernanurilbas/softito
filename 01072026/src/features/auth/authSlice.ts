import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const getStoredUser = (): User | null => {
  const userJson = localStorage.getItem('crm_user');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }
  return null;
};

const initialUser = getStoredUser();

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
  status: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/users?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('API hatası oluştu.');
      }
      const users: (User & { password?: string })[] = await response.json();
      const user = users[0];
      
      if (user && user.password === password) {
        // Safe copy without password
        const safeUser: User = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        };
        localStorage.setItem('crm_user', JSON.stringify(safeUser));
        return safeUser;
      } else {
        return rejectWithValue('E-posta veya şifre hatalı.');
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Giriş yapılamadı.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('crm_user');
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string || 'Giriş işlemi başarısız.';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
