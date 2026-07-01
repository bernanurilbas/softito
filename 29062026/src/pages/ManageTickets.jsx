import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, addTicket, updateTicket, deleteTicket } from '../store/ticketSlice';
import { Bus, Plane, Plus, Trash2, Edit3, X, Check, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana'];
const COMPANIES = {
  bus: ['Kamil Koç', 'Metro Turizm', 'Pamukkale Turizm', 'Varan Turizm'],
  flight: ['Türk Hava Yolları', 'Pegasus', 'AnadoluJet', 'SunExpress']
};

export default function ManageTickets() {
  const dispatch = useDispatch();
  const { tickets, status, error } = useSelector((state) => state.tickets);

  // Local state for modals/forms
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  // Form states
  const [type, setType] = useState('bus');
  const [company, setCompany] = useState('');
  const [from, setFrom] = useState('İstanbul');
  const [to, setTo] = useState('Ankara');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [price, setPrice] = useState('');

  // Edit form states
  const [editCompany, setEditCompany] = useState('');
  const [editFrom, setEditFrom] = useState('');
  const [editTo, setEditTo] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editPrice, setEditPrice] = useState('');

  // Fetch tickets on load
  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  // Set default company when type changes in add form
  useEffect(() => {
    if (COMPANIES[type]) {
      setCompany(COMPANIES[type][0]);
    }
  }, [type]);

  const generateSeats = (ticketType) => {
    const count = ticketType === 'flight' ? 20 : 40;
    const seats = [];
    for (let i = 1; i <= count; i++) {
      seats.push({ number: i, status: 'available' });
    }
    return seats;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!price || Number(price) <= 0) {
      alert('Lütfen geçerli bir fiyat girin.');
      return;
    }
    if (from === to) {
      alert('Nereden ve Nereye şehirleri aynı olamaz.');
      return;
    }

    const newTicket = {
      type,
      company,
      from,
      to,
      date,
      time,
      price: Number(price),
      seats: generateSeats(type)
    };

    dispatch(addTicket(newTicket))
      .unwrap()
      .then(() => {
        setIsAddOpen(false);
        // Reset form
        setPrice('');
      })
      .catch((err) => {
        alert('Hata: ' + err.message);
      });
  };

  const handleEditClick = (ticket) => {
    setEditingTicket(ticket);
    setEditCompany(ticket.company);
    setEditFrom(ticket.from);
    setEditTo(ticket.to);
    setEditDate(ticket.date);
    setEditTime(ticket.time);
    setEditPrice(ticket.price.toString());
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editPrice || Number(editPrice) <= 0) {
      alert('Lütfen geçerli bir fiyat girin.');
      return;
    }
    if (editFrom === editTo) {
      alert('Nereden ve Nereye şehirleri aynı olamaz.');
      return;
    }

    // Preserve existing seats structure
    const updatedTicket = {
      ...editingTicket,
      company: editCompany,
      from: editFrom,
      to: editTo,
      date: editDate,
      time: editTime,
      price: Number(editPrice),
    };

    dispatch(updateTicket(updatedTicket))
      .unwrap()
      .then(() => {
        setEditingTicket(null);
      })
      .catch((err) => {
        alert('Güncellenirken hata oluştu: ' + err.message);
      });
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Bu seferi kalıcı olarak silmek istediğinize emin misiniz?')) {
      dispatch(deleteTicket(id))
        .unwrap()
        .catch((err) => {
          alert('Silinirken hata oluştu: ' + err.message);
        });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit">
            Bilet Yönetim Paneli
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Sistemdeki tüm otobüs ve uçak seferlerini buradan ekleyebilir, düzenleyebilir veya silebilirsiniz.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Sefer Ekle</span>
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-center space-x-2 mb-6">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
        {status === 'loading' && tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="h-10 w-10 text-indigo-600 dark:text-indigo-400 animate-spin mb-3" />
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Biletler yükleniyor...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 mb-4">
              <Bus className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Hiç Sefer Bulunamadı</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-6">Henüz eklenmiş bir bilet veya sefer bulunmuyor.</p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer"
            >
              İlk Seferi Oluştur
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tür</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Firma</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Rota</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tarih / Saat</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fiyat</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Koltuk Durumu</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tickets.map((ticket) => {
                  const totalSeats = ticket.seats?.length || 0;
                  const bookedSeats = ticket.seats?.filter(s => s.status === 'booked').length || 0;
                  const availableSeats = totalSeats - bookedSeats;

                  return (
                    <tr key={ticket.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          ticket.type === 'flight' 
                            ? 'bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30' 
                            : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                        }`}>
                          {ticket.type === 'flight' ? <Plane className="h-3 w-3" /> : <Bus className="h-3 w-3" />}
                          <span>{ticket.type === 'flight' ? 'Uçak' : 'Otobüs'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {ticket.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                          <span>{ticket.from}</span>
                          <ArrowRight className="h-3 w-3 text-slate-400 dark:text-slate-550" />
                          <span>{ticket.to}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{ticket.date}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-550 font-semibold">{ticket.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">
                        {ticket.price} TL
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {availableSeats} / {totalSeats} Boş
                        </div>
                        <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full" 
                            style={{ width: `${(availableSeats / totalSeats) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-2">
                        <button
                          onClick={() => handleEditClick(ticket)}
                          className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-950/30 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Düzenle</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(ticket.id)}
                          className="inline-flex items-center space-x-1 text-red-600 hover:text-red-900 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Sil</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD TICKET MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl max-w-md w-full border border-slate-100 dark:border-slate-800 overflow-hidden transform transition-all text-slate-800 dark:text-slate-100">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">Yeni Sefer Oluştur</h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Sefer Türü</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-955 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setType('bus')}
                    className={`flex items-center justify-center py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      type === 'bus' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-450'
                    }`}
                  >
                    <Bus className="h-3.5 w-3.5 mr-1.5" />
                    Otobüs
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('flight')}
                    className={`flex items-center justify-center py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      type === 'flight' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-455'
                    }`}
                  >
                    <Plane className="h-3.5 w-3.5 mr-1.5" />
                    Uçak
                  </button>
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Firma Adı</label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white bg-white dark:bg-slate-800"
                >
                  {COMPANIES[type].map((c) => (
                    <option key={c} value={c} className="dark:bg-slate-800">{c}</option>
                  ))}
                </select>
              </div>

              {/* Rota (From & To) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Nereden</label>
                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white bg-white dark:bg-slate-800"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c} disabled={c === to} className="dark:bg-slate-800">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Nereye</label>
                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white bg-white dark:bg-slate-800"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c} disabled={c === from} className="dark:bg-slate-800">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tarih & Saat */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Tarih</label>
                  <input
                    type="date"
                    required
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Saat</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Fiyat */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Bilet Fiyatı (TL)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="650"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white bg-white dark:bg-slate-800"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
                >
                  Seferi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TICKET MODAL */}
      {editingTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-955/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl max-w-md w-full border border-slate-100 dark:border-slate-800 overflow-hidden transform transition-all text-slate-800 dark:text-slate-100">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">Seferi Düzenle</h3>
              <button 
                onClick={() => setEditingTicket(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {/* Type Display */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Sefer Türü</label>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl flex items-center border border-slate-100 dark:border-slate-850">
                  {editingTicket.type === 'flight' ? <Plane className="h-4 w-4 mr-2 text-sky-600 dark:text-sky-400" /> : <Bus className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />}
                  <span>{editingTicket.type === 'flight' ? 'Uçak Seferi' : 'Otobüs Seferi'}</span>
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Firma Adı</label>
                <select
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white bg-white dark:bg-slate-800"
                >
                  {COMPANIES[editingTicket.type].map((c) => (
                    <option key={c} value={c} className="dark:bg-slate-800">{c}</option>
                  ))}
                </select>
              </div>

              {/* Rota (From & To) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Nereden</label>
                  <select
                    value={editFrom}
                    onChange={(e) => setEditFrom(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white bg-white dark:bg-slate-800"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c} disabled={c === editTo} className="dark:bg-slate-800">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Nereye</label>
                  <select
                    value={editTo}
                    onChange={(e) => setEditTo(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white bg-white dark:bg-slate-800"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c} disabled={c === editFrom} className="dark:bg-slate-800">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tarih & Saat */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Tarih</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Saat</label>
                  <input
                    type="time"
                    required
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Fiyat */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Bilet Fiyatı (TL)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white bg-white dark:bg-slate-800"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingTicket(null)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
