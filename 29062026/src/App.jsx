import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Filter from './pages/Filter';
import Detail from './pages/Detail';
import Payment from './pages/Payment';
import PaymentResult from './pages/PaymentResult';
import ManageTickets from './pages/ManageTickets';

function App() {
  const searchCriteria = useSelector((state) => state.tickets.searchCriteria);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/filter"
            element={
              <Filter
                key={`${searchCriteria.from}-${searchCriteria.to}-${searchCriteria.date}-${searchCriteria.type}`}
              />
            }
          />
          <Route path="/detail" element={<Detail />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          <Route path="/admin" element={<ManageTickets />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
