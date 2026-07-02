import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './app/store';
import { fetchSettings } from './features/settings/settingsSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import Deals from './pages/Deals';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Fetch initial database settings (Dark mode preference etc.)
    dispatch(fetchSettings());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Login layout */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard/CRM layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
                {/* Persistent Navigation */}
                <Sidebar />
                
                {/* Central Workspace area */}
                <main className="flex-grow min-w-0 h-screen overflow-y-auto relative pt-16 lg:pt-0">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/customers/:id" element={<CustomerDetails />} />
                    <Route path="/deals" element={<Deals />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/settings" element={<Settings />} />
                    
                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
