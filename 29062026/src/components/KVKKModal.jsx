import { X } from 'lucide-react';

export default function KVKKModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden max-w-2xl w-full z-10 border border-slate-100 dark:border-slate-800 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            KVKK Aydınlatma Metni
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
          <h4 className="font-bold text-slate-800 dark:text-slate-200">1. Veri Sorumlusu</h4>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu ("Kanun") uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla SeyahatBilet tarafından aşağıda açıklanan kapsamda işlenebilecektir.
          </p>

          <h4 className="font-bold text-slate-800 dark:text-slate-200">2. Kişisel Verilerin İşlenme Amacı</h4>
          <p>
            Kişisel verileriniz; seyahat rezervasyonlarınızın gerçekleştirilmesi, biletlerinizin düzenlenmesi, kimlik doğrulama işlemlerinin yapılması, satın aldığınız hizmetlere yönelik destek süreçlerinin yürütülmesi ve mevzuattan kaynaklanan yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.
          </p>

          <h4 className="font-bold text-slate-800 dark:text-slate-200">3. İşlenen Kişisel Veriler</h4>
          <p>
            Kayıt ve bilet alma işlemleriniz kapsamında adınız, soyadınız, T.C. kimlik numaranız (gerekli durumlarda), telefon numaranız, e-posta adresiniz ve seyahat tercihleriniz gibi kişisel verileriniz işlenmektedir.
          </p>

          <h4 className="font-bold text-slate-800 dark:text-slate-200">4. Kişisel Verilerin Aktarılması</h4>
          <p>
            Kişisel verileriniz, seyahatinizin gerçekleştirilmesi amacıyla ilgili otobüs veya uçak firmalarıyla, yasal bildirim zorunlulukları kapsamında yetkili kamu kurum ve kuruluşlarıyla paylaşılabilecektir.
          </p>

          <h4 className="font-bold text-slate-800 dark:text-slate-200">5. Kişisel Veri Sahibinin Hakları</h4>
          <p>
            Kanun'un 11. maddesi uyarınca, SeyahatBilet'e başvurarak kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve bunlara uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme, kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme haklarına sahipsiniz.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-xl transition shadow-sm cursor-pointer"
          >
            Okudum, Anladım
          </button>
        </div>
      </div>
    </div>
  );
}
