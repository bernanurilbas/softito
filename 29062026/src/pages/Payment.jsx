import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Calendar, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Payment() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
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

  // Form Fields
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!pendingBooking) {
      navigate('/');
      return;
    }

    const fetchTicket = async () => {
      try {
        const response = await fetch(`http://localhost:5001/tickets/${pendingBooking.ticketId}`);
        if (response.ok) {
          const data = await response.json();
          setTicket(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [isAuthenticated, navigate, pendingBooking]);

  const handleCardNumberChange = (e) => {
    // Basic format: 1234 5678 1234 5678
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = value.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || '';
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e) => {
    // Format: MM/YY
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    } else {
      setExpiry(value);
    }
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(value);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      alert('Lütfen geçerli bir 16 haneli kart numarası giriniz.');
      return;
    }
    if (expiry.length !== 5) {
      alert('Lütfen son kullanma tarihini ay/yıl (AA/YY) formatında giriniz.');
      return;
    }
    if (cvv.length !== 3) {
      alert('Lütfen 3 haneli CVV kodunu giriniz.');
      return;
    }

    setIsProcessing(true);

    // Simulate payment transaction
    setTimeout(() => {
      setIsProcessing(false);
      
      // Control mechanism: if last digit of card number is 0, payment fails. Otherwise, it succeeds.
      const rawCard = cardNumber.replace(/\s/g, '');
      const lastDigit = rawCard[rawCard.length - 1];

      if (lastDigit === '0') {
        navigate('/payment-result?status=failed');
      } else {
        navigate('/payment-result?status=success');
      }
    }, 2000);
  };

  if (loading || !ticket) {
    return (
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-950 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Card Details Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6 transition-all">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg font-outfit">Ödeme Bilgileri</h3>
              <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
                <ShieldCheck className="h-4 w-4" />
                <span>Güvenli 3D Secure</span>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {/* Cardholder Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Kart Üzerindeki İsim
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ahmet Yılmaz"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="block w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 dark:text-white transition"
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Kart Numarası
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="block w-full pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 dark:text-white transition"
                  />
                </div>
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                    Son Kullanma Tarihi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="AA/YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      className="block w-full pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 dark:text-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                    CVV (Güvenlik Kodu)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="•••"
                    value={cvv}
                    onChange={handleCvvChange}
                    className="block w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 dark:text-white transition"
                  />
                </div>
              </div>

              {/* Simulation Note Alert */}
              <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl p-4 flex items-start space-x-2.5 text-xs text-indigo-800 dark:text-indigo-300 font-medium">
                <HelpCircle className="h-5 w-5 shrink-0 text-indigo-500 dark:text-indigo-400" />
                <div>
                  <p className="font-bold mb-0.5">Simülasyon Bilgilendirmesi:</p>
                  <p>
                    • Ödemenin <b>başarılı</b> olmasını görmek için kart numarasının son hanesini <b>1 ile 9 arasında</b> herhangi bir rakam girin. <br />
                    • Ödemenin <b>başarısız</b> olmasını görmek için kart numarasının son hanesini <b>0</b> girin.
                  </p>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Ödeme İşleniyor...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Güvenli Ödeme Yap ({pendingBooking.totalPrice} TL)</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Side: Booking Breakdown */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between h-fit space-y-6 transition-all">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4 font-outfit">Bilet Özeti</h3>
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800/50">
                  <span className="text-slate-455 dark:text-slate-500">Firma</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{ticket.company}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800/50">
                  <span className="text-slate-455 dark:text-slate-500">Güzergah</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{ticket.from} ➔ {ticket.to}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800/50">
                  <span className="text-slate-455 dark:text-slate-500">Tarih</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{ticket.date} - {ticket.time}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800/50">
                  <span className="text-slate-455 dark:text-slate-500">Koltuklar</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {pendingBooking.selectedSeats.sort((a,b)=>a-b).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Ödenecek Tutar</span>
                <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-outfit">
                  {pendingBooking.totalPrice} TL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
