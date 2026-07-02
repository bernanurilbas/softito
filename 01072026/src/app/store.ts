import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import customersReducer from '../features/customers/customersSlice';
import dealsReducer from '../features/deals/dealsSlice';
import tasksReducer from '../features/tasks/tasksSlice';
import settingsReducer from '../features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customersReducer,
    deals: dealsReducer,
    tasks: tasksReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
