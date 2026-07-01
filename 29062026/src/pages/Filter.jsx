import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchCriteria, setSelectedTicketId, setFilters, fetchTickets } from '../store/ticketSlice';
import { Bus, Plane, SlidersHorizontal, ArrowUpDown, ChevronRight, Compass } from 'lucide-react';

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana'];

export default function Filter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchCriteria, filters, tickets, status, error } = useSelector((state) => state.tickets);

  // Local state mirroring Redux state for form inputs
  const [localFrom, setLocalFrom] = useState(searchCriteria.from || 'İstanbul');
  const [localTo, setLocalTo] = useState(searchCriteria.to || 'Ankara');
  const [localDate, setLocalDate] = useState(searchCriteria.date);
  const [localType, setLocalType] = useState(searchCriteria.type);

  // Fetch tickets
  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  // Handle Search Criteria Update
  const handleUpdateSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchCriteria({
      from: localFrom,
      to: localTo,
      date: localDate,
      type: localType
    }));
  };

  // Get unique companies from matching search parameters to show in checkboxes
  const searchMatchedTickets = tickets.filter(t => 
    t.type === localType &&
    t.from.toLowerCase() === localFrom.toLowerCase() &&
    t.to.toLowerCase() === localTo.toLowerCase() &&
    t.date === localDate
  );

  const availableCompanies = [...new Set(searchMatchedTickets.map(t => t.company))];

  // Apply filters and sorting
  const filteredTickets = searchMatchedTickets.filter((ticket) => {
    // Price Filter
    if (ticket.price > filters.maxPrice) return false;
    // Company Filter
    if (filters.selectedCompanies.length > 0 && !filters.selectedCompanies.includes(ticket.company)) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price') {
      return a.price - b.price;
    } else {
      // Sort by Departure Time (HH:MM)
      return a.time.localeCompare(b.time);
    }
  });

  const handleMaxPriceChange = (e) => {
    dispatch(setFilters({ maxPrice: Number(e.target.value) }));
  };

  const handleCompanyToggle = (company) => {
    const updated = filters.selectedCompanies.includes(company)
      ? filters.selectedCompanies.filter((c) => c !== company)
      : [...filters.selectedCompanies, company];
    dispatch(setFilters({ selectedCompanies: updated }));
  };

  const handleSortChange = (e) => {
    dispatch(setFilters({ sortBy: e.target.value }));
  };

  const handleSelectTicket = (ticketId) => {
    dispatch(setSelectedTicketId(ticketId));
    navigate('/detail');
  };


  return (
    <div className="flex-grow bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Page title / breadcrumb */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-outfit">
            {localType === 'bus' ? 'Otobüs' : 'Uçak'} Seferleri
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {localFrom} ➔ {localTo} • {localDate}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar: Filters & Modify Search */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Search Criteria Form */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4 flex items-center space-x-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Aramayı Güncelle</span>
              </h3>

              <form onSubmit={handleUpdateSearch} className="space-y-4">
                {/* Vehicle Type Tabs */}
                <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setLocalType('bus')}
                    className={`flex-1 flex justify-center items-center py-1.5 rounded-lg text-xs font-semibold transition ${
                      localType === 'bus' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Bus className="h-3.5 w-3.5 mr-1" />
                    Otobüs
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalType('flight')}
                    className={`flex-1 flex justify-center items-center py-1.5 rounded-lg text-xs font-semibold transition ${
                      localType === 'flight' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Plane className="h-3.5 w-3.5 mr-1" />
                    Uçak
                  </button>
                </div>

                {/* From */}
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">Nereden</label>
                  <select
                    value={localFrom}
                    onChange={(e) => setLocalFrom(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-xl p-2.5 font-medium transition focus:ring-2 focus:ring-indigo-500"
                  >
                    {CITIES.map((city) => (
                      <option key={city} value={city} disabled={city === localTo} className="dark:bg-slate-800">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* To */}
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">Nereye</label>
                  <select
                    value={localTo}
                    onChange={(e) => setLocalTo(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-xl p-2.5 font-medium transition focus:ring-2 focus:ring-indigo-500"
                  >
                    {CITIES.map((city) => (
                      <option key={city} value={city} disabled={city === localFrom} className="dark:bg-slate-800">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">Tarih</label>
                  <input
                    type="date"
                    value={localDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setLocalDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-xl p-2.5 font-medium transition focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-xs py-2.5 rounded-xl transition shadow-sm"
                >
                  Uygula
                </button>
              </form>
            </div>

            {/* Price Filter & Sorting & Company Selection */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 transition-all">
              
              {/* Sorting */}
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-3 flex items-center space-x-2">
                  <ArrowUpDown className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Sırala</span>
                </h3>
                <select
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-xl p-2.5 font-medium transition focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="time" className="dark:bg-slate-800">Kalkış Saatine Göre</option>
                  <option value="price" className="dark:bg-slate-800">En Düşük Fiyata Göre</option>
                </select>
              </div>

              {/* Price range */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">Maksimum Fiyat</h3>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs">{filters.maxPrice} TL</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="3000"
                  step="50"
                  value={filters.maxPrice}
                  onChange={handleMaxPriceChange}
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Companies list */}
              {availableCompanies.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-3">Firmalar</h3>
                  <div className="space-y-2">
                    {availableCompanies.map((company) => (
                      <label key={company} className="flex items-center space-x-2 text-xs text-slate-650 dark:text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.selectedCompanies.includes(company)}
                          onChange={() => handleCompanyToggle(company)}
                          className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded transition"
                        />
                        <span>{company}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Content: Tickets List */}
          <div className="lg:col-span-3">
            {status === 'loading' ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-650 p-6 rounded-2xl text-center">
                {error}
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm transition-all">
                <Compass className="h-12 w-12 text-slate-300 dark:text-slate-650 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Aramanıza Uygun Sefer Bulunamadı</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Farklı bir tarih veya şehir çifti seçmeyi deneyebilirsiniz ya da fiyat limitini yükseltebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => {
                  const availableSeatsCount = ticket.seats.filter(s => s.status === 'available').length;

                  return (
                    <div
                      key={ticket.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 hover:shadow-md transition-all duration-205 flex flex-col md:flex-row justify-between items-center gap-4"
                    >
                      {/* Logo and times */}
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-8 w-full md:w-auto">
                        <div className="font-extrabold text-slate-800 dark:text-white text-lg border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-2 md:pb-0 md:pr-8 min-w-[120px]">
                          {ticket.company}
                        </div>
                        <div className="flex items-center space-x-6">
                          <div>
                            <span className="block text-2xl font-extrabold text-slate-900 dark:text-white font-outfit">{ticket.time}</span>
                            <span className="text-xs text-slate-400 dark:text-slate-550 font-semibold">{ticket.from}</span>
                          </div>
                          <div className="flex flex-col items-center px-4">
                            <span className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider">Sefer Süresi</span>
                            <div className="h-0.5 w-16 bg-slate-200 dark:bg-slate-700 my-1 relative">
                              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                            </div>
                            <span className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold">Direkt Sefer</span>
                          </div>
                          <div>
                            <span className="block text-2xl font-extrabold text-slate-900 dark:text-white font-outfit">
                              {/* Estimate arrival */}
                              {(() => {
                                const [h, m] = ticket.time.split(':').map(Number);
                                const destH = (h + (ticket.type === 'bus' ? 6 : 1.5)) % 24;
                                const destStr = String(Math.floor(destH)).padStart(2, '0') + ':' + String(m).padStart(2, '0');
                                return destStr;
                              })()}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-550 font-semibold">{ticket.to}</span>
                          </div>
                        </div>
                      </div>

                      {/* Seat occupancy info */}
                      <div className="text-xs text-slate-500 text-center font-medium">
                        {ticket.type === 'bus' ? (
                          <span className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-350 px-3 py-1.5 rounded-full font-semibold border border-slate-100 dark:border-slate-850 block transition-all">
                            {availableSeatsCount} Boş Koltuk
                          </span>
                        ) : (
                          <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-750 dark:text-indigo-450 px-3 py-1.5 rounded-full font-semibold border border-indigo-100 dark:border-indigo-900/40 block transition-all">
                            Son {availableSeatsCount} Koltuk!
                          </span>
                        )}
                      </div>

                      {/* Pricing and Action */}
                      <div className="flex justify-between md:justify-end items-center space-x-6 w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                        <div className="text-left md:text-right">
                          <span className="block text-xs text-slate-400 dark:text-slate-550 font-bold">Bilet Fiyatı</span>
                          <span className="text-2xl font-extrabold text-indigo-650 dark:text-indigo-450 font-outfit">{ticket.price} TL</span>
                        </div>
                        <button
                          onClick={() => handleSelectTicket(ticket.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-sm hover:shadow-indigo-500/10 active:scale-95 transition-all flex items-center space-x-1"
                        >
                          <span>Koltuk Seç</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
