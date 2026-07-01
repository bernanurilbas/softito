import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Vision/Mission */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <Compass className="h-8 w-8 text-indigo-500" />
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                SeyahatBilet
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Vizyonumuz, seyahat etmeyi herkes için en kolay, en hızlı ve en güvenli deneyim haline getirmektir.
              Misyonumuz ise en ucuz otobüs ve uçak biletlerini tek bir noktada karşılaştırarak en iyi müşteri deneyimi ile sunmaktır.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition">Anasayfa</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition">Giriş Yap</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition">Kayıt Ol</Link>
              </li>
              <li>
                <Link to="/filter" className="hover:text-indigo-400 transition">Bilet Ara</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">İletişim</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-indigo-400" />
                <span>0850 123 45 67</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-indigo-400" />
                <span>destek@seyahatbilet.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-indigo-400 mt-0.5" />
                <span>Ataşehir, İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SeyahatBilet. Tüm hakları saklıdır. Bu bir ödeme simülasyonu projesidir.</p>
        </div>
      </div>
    </footer>
  );
}
