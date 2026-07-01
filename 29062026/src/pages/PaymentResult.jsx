import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Home, RotateCcw } from 'lucide-react';

export default function PaymentResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status'); // 'success' or 'failed'
  
  const { user } = useSelector((state) => state.auth);
  const [pendingBooking] = useState(() => {
    try {
      const bookingData = sessionStorage.getItem('pendingBooking');
      return bookingData ? JSON.parse(bookingData) : null;
    } catch {
      return null;
    }
  });
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingSaved, setBookingSaved] = useState(false);

  useEffect(() => {
    if (!pendingBooking) {
      navigate('/');
      return;
    }

    const saveBookingToDB = async (bookingInfo, ticketInfo) => {
      try {
        // 1. Post to bookings collection
        const newBooking = {
          userId: user.id,
          userFullName: `${user.name} ${user.surname}`,
          ticketId: ticketInfo.id,
          company: ticketInfo.company,
          type: ticketInfo.type,
          from: ticketInfo.from,
          to: ticketInfo.to,
          date: ticketInfo.date,
          time: ticketInfo.time,
          selectedSeats: bookingInfo.selectedSeats,
          totalPrice: bookingInfo.totalPrice,
          bookingDate: new Date().toISOString()
        };

        const bookingResponse = await fetch('http://localhost:5001/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newBooking)
        });

        if (!bookingResponse.ok) {
          throw new Error('Rezervasyon kaydedilemedi.');
        }

        // 2. Update the ticket's seat statuses in db.json
        const updatedSeats = ticketInfo.seats.map((seat) => {
          if (bookingInfo.selectedSeats.includes(seat.number)) {
            return { ...seat, status: 'booked' };
          }
          return seat;
        });

        const ticketResponse = await fetch(`http://localhost:5001/tickets/${ticketInfo.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ seats: updatedSeats })
        });

        if (!ticketResponse.ok) {
          throw new Error('Koltuk durumları güncellenemedi.');
        }

        // Mark as saved and clear session storage
        setBookingSaved(true);
        sessionStorage.removeItem('pendingBooking');
      } catch (err) {
        console.error('Error saving booking:', err);
        setError('Ödemeniz başarılı oldu fakat rezervasyon veri tabanına işlenirken bir sorun oluştu.');
      }
    };

    const fetchTicket = async () => {
      try {
        const response = await fetch(`http://localhost:5001/tickets/${pendingBooking.ticketId}`);
        if (response.ok) {
          const data = await response.json();
          setTicket(data);
          
          // If payment was successful and booking hasn't been saved yet, save it to the DB
          if (status === 'success' && !bookingSaved && user) {
            await saveBookingToDB(pendingBooking, data);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [status, navigate, user, pendingBooking, bookingSaved]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const isSuccess = status === 'success';

  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-950 py-12 flex items-center justify-center transition-colors duration-300">
      <div className="max-w-md w-full mx-4">
        
        {isSuccess ? (
          /* SUCCESS PAGE */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-8 text-center space-y-6 transition-all">
            <div className="flex justify-center text-emerald-500 dark:text-emerald-400">
              <CheckCircle2 className="h-20 w-20 animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">Ödeme Başarılı!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Biletiniz başarıyla düzenlenmiştir. İyi yolculuklar dileriz!
              </p>
            </div>

            {ticket && pendingBooking && (
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-5 border border-slate-100 dark:border-slate-850 text-left text-xs text-slate-600 dark:text-slate-400 space-y-3 transition-all">
                <div className="flex justify-between font-semibold border-b border-slate-200 dark:border-slate-800 pb-2 mb-2 text-slate-700 dark:text-slate-300">
                  <span>Sefer Bilgisi:</span>
                  <span>{ticket.company} ({ticket.type === 'bus' ? 'Otobüs' : 'Uçak'})</span>
                </div>
                <div className="flex justify-between">
                  <span>Güzergah:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{ticket.from} ➔ {ticket.to}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tarih / Saat:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{ticket.date} - {ticket.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Koltuk No:</span>
                  <span className="font-bold text-indigo-650 dark:text-indigo-400">
                    {pendingBooking.selectedSeats.sort((a,b)=>a-b).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-800 dark:text-slate-200">
                  <span>Ödenen Tutar:</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{pendingBooking.totalPrice} TL</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs p-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/"
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-98 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Home className="h-4 w-4" />
                <span>Anasayfa'ya Dön</span>
              </Link>
            </div>
          </div>
        ) : (
          /* FAILURE PAGE */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-8 text-center space-y-6 transition-all">
            <div className="flex justify-center text-red-500 dark:text-red-400">
              <XCircle className="h-20 w-20 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">Ödeme Başarısız!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Ödeme işlemi bankanız tarafından reddedildi veya simülasyon başarısız sonuçlandı.
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-2xl p-4 text-xs text-red-700 dark:text-red-400 font-medium text-left leading-relaxed">
              Lütfen kart bilgilerinizi kontrol edip tekrar deneyin. Simülasyonu başarılı tamamlamak için kart numaranızın son hanesini sıfır (0) dışında bir rakam girmeyi unutmayın.
            </div>

            <div className="flex space-x-3 pt-2">
              <Link
                to="/payment"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-98 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Tekrar Dene</span>
              </Link>
              <Link
                to="/"
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm py-3 px-4 rounded-xl active:scale-98 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Home className="h-4 w-4" />
                <span>Anasayfa</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
