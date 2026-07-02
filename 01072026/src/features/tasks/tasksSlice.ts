import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  customerId: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: string;
}

interface TasksState {
  items: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:5000/tasks');
    if (!response.ok) throw new Error('Görev listesi alınamadı.');
    return (await response.json()) as Task[];
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (taskData: Omit<Task, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          id: String(Date.now()),
        }),
      });
      if (!response.ok) throw new Error('Görev eklenemedi.');
      return (await response.json()) as Task;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (task: Task, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error('Görev güncellenemedi.');
      return (await response.json()) as Task;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleTaskCompleted = createAsyncThunk(
  'tasks/toggleTaskCompleted',
  async (task: Task, { rejectWithValue }) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      const response = await fetch(`http://localhost:5000/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) throw new Error('Görev durumu güncellenemedi.');
      return (await response.json()) as Task;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Görev silinemedi.');
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.items.unshift(action.payload);
      })
      // Update
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Toggle
      .addCase(toggleTaskCompleted.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
