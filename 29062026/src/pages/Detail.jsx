import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Bus, Plane, Calendar, MapPin, Armchair, ChevronRight, LogIn } from 'lucide-react';

export default function Detail() {
  const navigate = useNavigate();
  const selectedTicketId = useSelector((state) => state.tickets.selectedTicketId);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [ticket, setTicket] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ticket details
  useEffect(() => {
    if (!selectedTicketId) {
      navigate('/');
      return;
    }

    const fetchTicket = async () => {
      try {
        const response = await fetch(`http://localhost:5001/tickets/${selectedTicketId}`);
        if (!response.ok) {
          throw new Error('Sefer bilgileri alınamadı.');
        }
        const data = await response.json();
        setTicket(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [selectedTicketId, navigate]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex-grow max-w-xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center">
          {error || 'Bir hata oluştu.'}
        </div>
        <div className="text-center mt-4">
          <Link to="/" className="text-indigo-600 font-semibold hover:underline">Anasayfa'ya Dön</Link>
        </div>
      </div>
    );
  }

  const handleSeatClick = (seatNumber, status) => {
    if (status === 'booked') return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(num => num !== seatNumber));
    } else {
      // Limit to max 4 seats per booking
      if (selectedSeats.length >= 4) {
        alert('Tek seferde en fazla 4 koltuk seçebilirsiniz.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Lütfen en az bir koltuk seçiniz.');
      return;
    }

    // Save current selection to session storage to pass to Payment page
    sessionStorage.setItem('pendingBooking', JSON.stringify({
      ticketId: ticket.id,
      selectedSeats,
      totalPrice: ticket.price * selectedSeats.length
    }));

    navigate('/payment');
  };

  const isBus = ticket.type === 'bus';

  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-950 py-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Ticket Brief Details */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 transition-all">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              {isBus ? <Bus className="h-8 w-8" /> : <Plane className="h-8 w-8" />}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white font-outfit">
                {ticket.company} - {isBus ? 'Otobüs' : 'Uçak'} Seferi
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center space-x-3 mt-1">
                <span className="flex items-center"><MapPin className="h-4 w-4 mr-1 text-slate-405 dark:text-slate-500" /> {ticket.from} ➔ {ticket.to}</span>
                <span>•</span>
                <span className="flex items-center"><Calendar className="h-4 w-4 mr-1 text-slate-405 dark:text-slate-500" /> {ticket.date}</span>
                <span>•</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{ticket.time}</span>
              </p>
            </div>
          </div>
          <div className="text-right border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0 w-full md:w-auto">
            <span className="block text-xs text-slate-405 dark:text-slate-500 font-bold uppercase">Koltuk Başı Fiyat</span>
            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-outfit">{ticket.price} TL</span>
          </div>
        </div>

        {/* Layout Grid: Seat Picker vs Booking summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Seat Picker Layout */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center transition-all">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-6 self-start font-outfit">
              Koltuk Seçimi
            </h3>

            {/* Seat legend */}
            <div className="flex space-x-6 mb-8 text-xs font-semibold">
              <div className="flex items-center space-x-1.5">
                <div className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"></div>
                <span className="text-slate-500 dark:text-slate-400">Boş</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-5 h-5 rounded bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40"></div>
                <span className="text-slate-500 dark:text-slate-400">Dolu</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-5 h-5 rounded bg-indigo-600 border border-indigo-700"></div>
                <span className="text-slate-500 dark:text-slate-400">Seçili</span>
              </div>
            </div>

            {/* Bus layout */}
            {isBus ? (
              <div className="w-full max-w-[320px] bg-slate-100 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-850 rounded-[30px] p-6 relative transition-all">
                {/* Steering wheel */}
                <div className="flex justify-between items-center mb-8 border-b-2 border-slate-200 dark:border-slate-850 pb-4">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-650">Şoför</div>
                  <div className="w-8 h-8 rounded-full border-4 border-slate-400 dark:border-slate-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600"></div>
                  </div>
                </div>

                {/* Seat Map */}
                <div className="grid grid-cols-4 gap-y-3 gap-x-2 justify-items-center">
                  {ticket.seats.map((seat, index) => {
                    const isSelected = selectedSeats.includes(seat.number);
                    const isBooked = seat.status === 'booked';
                    
                    // Determine styling
                    let seatClass = "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border transition-all duration-150 ";
                    if (isBooked) {
                      seatClass += "bg-red-50 dark:bg-red-950/20 text-red-400 dark:text-red-500/80 border-red-200 dark:border-red-900/30 cursor-not-allowed";
                    } else if (isSelected) {
                      seatClass += "bg-indigo-600 text-white border-indigo-700 shadow-sm shadow-indigo-500/20";
                    } else {
                      seatClass += "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-300";
                    }

                    // For the 2+2 layout, insert a gap (corridor) in the second column index
                    const showGap = (index % 4 === 2);

                    return (
                      <React.Fragment key={seat.number}>
                        {showGap && <div className="w-4 h-10"></div>}
                        <button
                          onClick={() => handleSeatClick(seat.number, seat.status)}
                          className={seatClass}
                          disabled={isBooked}
                          title={`Koltuk ${seat.number}`}
                        >
                          <Armchair className="h-4 w-4" />
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Flight layout (3+3 layout) */
              <div className="w-full max-w-[360px] bg-slate-100 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-850 rounded-[40px] p-6 relative transition-all">
                <div className="text-center py-3 border-b-2 border-slate-200 dark:border-slate-800 mb-6">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">Kokpit / Ön Kısım</span>
                </div>

                {/* Seats (A B C [corridor] D E F) */}
                <div className="grid grid-cols-7 gap-y-3 gap-x-1.5 justify-items-center">
                  {/* Headers */}
                  {['A', 'B', 'C', '', 'D', 'E', 'F'].map((head, idx) => (
                    <div key={idx} className="text-[10px] font-bold text-slate-400 dark:text-slate-550 h-4">
                      {head}
                    </div>
                  ))}

                  {/* Seat Map */}
                  {ticket.seats.map((seat, index) => {
                    const isSelected = selectedSeats.includes(seat.number);
                    const isBooked = seat.status === 'booked';
                    
                    let seatClass = "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border transition-all duration-150 ";
                    if (isBooked) {
                      seatClass += "bg-red-50 dark:bg-red-950/20 text-red-400 dark:text-red-500/80 border-red-200 dark:border-red-900/30 cursor-not-allowed";
                    } else if (isSelected) {
                      seatClass += "bg-indigo-600 text-white border-indigo-700 shadow-sm";
                    } else {
                      seatClass += "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-300";
                    }

                    const showCorridor = (index % 6 === 3);

                    return (
                      <React.Fragment key={seat.number}>
                        {showCorridor && <div className="w-4 h-9 flex items-center justify-center text-[10px] font-extrabold text-slate-300 dark:text-slate-700">|</div>}
                        <button
                          onClick={() => handleSeatClick(seat.number, seat.status)}
                          className={seatClass}
                          disabled={isBooked}
                        >
                          <Armchair className="h-3.5 w-3.5" />
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Block */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between h-fit space-y-6 transition-all">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4 font-outfit">Seyahat Özeti</h3>
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800/50">
                  <span className="text-slate-455 dark:text-slate-400">Nereden</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{ticket.from}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800/50">
                  <span className="text-slate-455 dark:text-slate-400">Nereye</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{ticket.to}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800/50">
                  <span className="text-slate-455 dark:text-slate-400">Tarih / Saat</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{ticket.date} - {ticket.time}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800/50">
                  <span className="text-slate-455 dark:text-slate-400">Seçilen Koltuklar</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                    {selectedSeats.length > 0 ? selectedSeats.sort((a,b)=>a-b).join(', ') : 'Seçilmedi'}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Toplam Tutar</span>
                <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-outfit">
                  {ticket.price * selectedSeats.length} TL
                </span>
              </div>

              {isAuthenticated ? (
                <button
                  onClick={handleProceedToPayment}
                  disabled={selectedSeats.length === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <span>Ödeme Yap</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs p-3.5 rounded-xl font-medium leading-relaxed text-center">
                    Satın alma işlemine devam etmek için lütfen giriş yapın.
                  </div>
                  <Link
                    to="/login"
                    className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-650 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Giriş Yap / Üye Ol</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
