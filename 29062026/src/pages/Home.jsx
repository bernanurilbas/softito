import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchCriteria } from '../store/ticketSlice';
import { Bus, Plane, Calendar, MapPin, Compass, Shield, Award } from 'lucide-react';

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana'];

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentCriteria = useSelector((state) => state.tickets.searchCriteria);

  const [type, setType] = useState(currentCriteria.type);
  const [from, setFrom] = useState(currentCriteria.from || 'İstanbul');
  const [to, setTo] = useState(currentCriteria.to || 'Ankara');
  const [date, setDate] = useState(currentCriteria.date);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchCriteria({ type, from, to, date }));
    navigate('/filter');
  };

  const handleQuickSearch = (quickType, quickFrom, quickTo, quickDate) => {
    dispatch(setSearchCriteria({ 
      type: quickType, 
      from: quickFrom, 
      to: quickTo, 
      date: quickDate 
    }));
    navigate('/filter');
  };

  return (
    <div className="flex-grow">
      {/* Hero Section with Search Card */}
      <div 
        className="relative min-h-[500px] flex items-center justify-center bg-cover bg-center py-16 px-4"
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.4)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80')` 
        }}
      >
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm font-outfit">
              Seyahatinizi Güvenle Planlayın
            </h1>
            <p className="mt-3 text-lg text-slate-200 drop-shadow-sm">
              En uygun otobüs ve uçak biletleri tek bir çatı altında, en iyi fiyat garantisiyle.
            </p>
          </div>

          {/* Search Card Container */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 backdrop-blur-lg bg-white/95 dark:bg-slate-900/95 transition-all">
            {/* Tabs */}
            <div className="flex space-x-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => setType('bus')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  type === 'bus'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Bus className="h-4 w-4" />
                <span>Otobüs Bileti</span>
              </button>
              <button
                type="button"
                onClick={() => setType('flight')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  type === 'flight'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Plane className="h-4 w-4" />
                <span>Uçak Bileti</span>
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* From */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center space-x-1">
                  <MapPin className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span>Nereden</span>
                </label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 font-medium transition"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city} disabled={city === to} className="dark:bg-slate-800">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* To */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center space-x-1">
                  <MapPin className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span>Nereye</span>
                </label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 font-medium transition"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city} disabled={city === from} className="dark:bg-slate-800">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center space-x-1">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span>Gidiş Tarihi</span>
                </label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 font-medium transition"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all duration-150 h-[46px] md:h-[48px] flex items-center justify-center space-x-2"
                >
                  <span>Biletleri Bul</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Popular Routes Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-outfit">
            Popüler Rotalar
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            En çok tercih edilen seyahat noktalarına özel fiyatlar
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { from: 'İstanbul', to: 'Ankara', type: 'bus', price: '650 TL', company: 'Kamil Koç', img: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=600&q=80' },
            { from: 'İstanbul', to: 'Ankara', type: 'flight', price: '1800 TL', company: 'Türk Hava Yolları', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80' },
            { from: 'Ankara', to: 'İstanbul', type: 'bus', price: '700 TL', company: 'Varan Turizm', img: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=600&q=80' },
            { from: 'İzmir', to: 'İstanbul', type: 'flight', price: '1950 TL', company: 'Türk Hava Yolları', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' }
          ].map((route, idx) => (
            <div 
              key={idx} 
              onClick={() => handleQuickSearch(route.type, route.from, route.to, '2026-06-30')}
              className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url('${route.img}')` }}>
                <div className="absolute inset-0 bg-slate-900/35 transition group-hover:bg-slate-900/25"></div>
                <span className="absolute top-3 left-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-slate-800 dark:text-slate-100 text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                  {route.type === 'bus' ? <Bus className="h-3 w-3" /> : <Plane className="h-3 w-3" />}
                  <span>{route.type === 'bus' ? 'Otobüs' : 'Uçak'}</span>
                </span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {route.from} - {route.to}
                  </h3>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-lg">{route.price}</span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{route.company} kalitesiyle</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vision & Mission Cards */}
      <div className="bg-slate-50 dark:bg-slate-900/30 py-16 border-t border-b border-slate-100 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl mb-4">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">Geniş Arama Ağı</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Yüzlerce otobüs firmasını ve uçuş rotasını tek platformda toplayarak size en uygun alternatifleri anında sunuyoruz.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">Güvenli Ödeme</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Kart bilgileriniz 3D Secure ve SSL şifreleme güvencesiyle korunur. Bilet alma işlemlerinizi güvenle tamamlayabilirsiniz.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
              <div className="p-3 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-xl mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">Kesintisiz Destek</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Müşteri deneyimini en üstte tutmak adına satış öncesi ve sonrasında 7/24 yanınızda olan bir destek ağı sunuyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
