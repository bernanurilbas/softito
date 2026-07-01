# E-Ticaret ve Pazarlama Sitesi (React) Proje Gündemi (Agenda)

Bu doküman, React (Vite) ve Bootstrap kütüphanesi kullanılarak geliştirilen E-Ticaret ve Pazarlama Sitesi projesinin adım adım geliştirme planını ve görev takibini içerir.

---

## 📌 Yol Haritası ve Görev Listesi

### ✅ Faz 1: Proje Kurulumu ve Altyapı
- [x] **Görev 1.1:** React + Vite proje yapısının kurulması ve alt klasörlerin (`src/components`, `src/pages`, `src/context`, `src/data`) oluşturulması.
- [x] **Görev 1.2:** Bootstrap 5, Bootstrap Icons ve React Router DOM paketlerinin kurulması ve `main.jsx` içinde içe aktarılması.
- [x] **Görev 1.3:** `src/index.css` dosyasının özelleştirilmiş soft toprak tonları (haki yeşil, bej, kahve) için CSS Değişkenleri ve stilleriyle yapılandırılması.
- [x] **Görev 1.4:** Kök `index.html` dosyasında global SEO etiketlerinin kurulması.

### ✅ Faz 2: Durum Yönetimi (State Management) ve Veriler
- [x] **Görev 2.1:** **Ürün Veritabanı:** `src/data/products.js` dosyasının oluşturulması ve 6 adet premium ürün verisinin eklenmesi.
- [x] **Görev 2.2:** **Cart Context:** `src/context/CartContext.jsx` dosyası ile sepet ekleme, silme, adet güncelleme, kupon kodu indirim hesaplaması ve localStorage senkronizasyonunun yazılması.
- [x] **Görev 2.3:** **Görsel Varlıklar:** `generate_image` ile üretilen görsellerin `public/assets/img/` klasörüne kopyalanması.

### ✅ Faz 3: Ortak Bileşenler ve Rota Yapılandırması
- [x] **Görev 3.1:** **Navigasyon Çubuğu (Navbar.jsx):** Dinamik sepet sayacı, arama formu ve kullanıcı girişi yönlendirmesi içeren Bootstrap navbarı (Benzersiz ID'ler ile).
- [x] **Görev 3.2:** **Sayfa Sonu (Footer.jsx):** Kurumsal bilgiler, hızlı linkler ve sosyal medya düğmeleri.
- [x] **Görev 3.3:** **Toast Bildirimi (Toast.jsx):** Sepete ürün eklendiğinde sağ altta beliren ve anlık kaybolan uyarı penceresi.
- [x] **Görev 3.4:** **App.jsx & Rotalar:** React Router kullanılarak `/`, `/catalog`, `/detail/:id`, `/cart`, `/checkout`, `/login` ve `/register` rotalarının kurgulanması.

### ✅ Faz 4: Sayfaların Kodlanması
- [x] **Görev 4.1:** **Ana Sayfa (Home.jsx):** Slider (Bootstrap Carousel yapısı), marka değerleri kartları, popüler kategoriler ve öne çıkan 3 ürün kartı.
- [x] **Görev 4.2:** **Katalog Sayfası (Catalog.jsx):** Filtreleme paneli (kategori filtreleme, fiyat aralığı slider'ı, sıralama seçimi) ve arama state kontrolleri ile anlık süzülen ürün listesi.
- [x] **Görev 4.3:** **Ürün Detay Sayfası (ProductDetail.jsx):** Ürün görseli, varyasyon seçicileri (renk/beden), adet seçici ve sekmeli detay paneli (Açıklama, Özellikler, Yorumlar).
- [x] **Görev 4.4:** **Sepet Sayfası (Cart.jsx):** Sepet ürün tablosu, adet güncellemeleri, kupon kodu girişi ve sipariş özeti kartı.
- [x] **Görev 4.5:** **Ödeme Sayfası (Checkout.jsx):** Kargo/Fatura adresi giriş formu, kargo yöntemi seçimi, Kredi kartı/Havale ödeme menüleri ve sipariş tamamlandığında beliren başarı modalı.
- [x] **Görev 4.6:** **Giriş (Login.jsx) & Kayıt (Register.jsx) Sayfaları:** Tam ekran arka planlı, cam kart tasarımlı ve validation kontrollü kullanıcı giriş ve üyelik sayfaları.

### ✅ Faz 5: Derleme, Test ve Temizlik
- [x] **Görev 5.1:** Sayfalardaki tüm etkileşimli bileşenlerin benzersiz ID'lerinin doğrulanması.
- [x] **Görev 5.2:** Eski düz HTML dosyalarının projeden temizlenmesi.
- [x] **Görev 5.3:** `npm run build` komutunun hatasız çalıştırılıp projenin başarıyla derlendiğinin test edilmesi.
