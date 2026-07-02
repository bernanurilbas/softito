import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface SystemSettings {
  darkMode: boolean;
  currency: string;
  pipelineStages: string[];
}

interface SettingsState {
  config: SystemSettings;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const defaultSettings: SystemSettings = {
  darkMode: false,
  currency: 'TRY',
  pipelineStages: ['new', 'contacted', 'proposal_sent', 'won', 'lost']
};

const initialState: SettingsState = {
  config: defaultSettings,
  status: 'idle',
  error: null,
};

export const fetchSettings = createAsyncThunk('settings/fetchSettings', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:5000/settings');
    if (!response.ok) throw new Error('Ayarlar yüklenemedi.');
    return (await response.json()) as SystemSettings;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (newSettings: SystemSettings, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (!response.ok) throw new Error('Ayarlar kaydedilemedi.');
      return (await response.json()) as SystemSettings;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleLocalDarkMode: (state) => {
      state.config.darkMode = !state.config.darkMode;
      // Sync HTML dark class
      if (state.config.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSettings.fulfilled, (state, action: PayloadAction<SystemSettings>) => {
        state.status = 'succeeded';
        state.config = action.payload;
        // Sync HTML dark class
        if (action.payload.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        state.error = null;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateSettings.fulfilled, (state, action: PayloadAction<SystemSettings>) => {
        state.config = action.payload;
        // Sync HTML dark class
        if (action.payload.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      });
  },
});

export const { toggleLocalDarkMode } = settingsSlice.actions;
export default settingsSlice.reducer;
