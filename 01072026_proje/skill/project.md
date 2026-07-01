# Proje Tanımı: ElegantCart E-Ticaret ve Pazarlama Platformu (React)

Bu doküman, React, React Router, Context API ve Bootstrap kütüphaneleri kullanılarak hayata geçirilen **ElegantCart** e-ticaret ve pazarlama platformunun genel mimarisini, tasarım dilini ve sayfa detaylarını tanımlar.

---

## 💎 Tasarım Vizyonu & Estetik Standartlar

Kullanıcıyı yormayan ve son derece premium, organik ve modern bir estetik yaratmak için aşağıdaki renk paleti ve görsel kurallar kullanılmıştır:
- **Renk Paleti (Soft Earth Tones):**
  - **Haki Yeşil (Primary):** `#4a5d4e` (Koyu yumuşak haki) ve `#6b7f70` (Açık haki yeşil)
  - **Toprak & Kahve Tonları (Secondary):** `#a38a70` (Sıcak bej-kahve), `#5c4d3c` (Koyu toprak kahvesi)
  - **Arka Planlar:** `#fcfbfa` (Kırık fildişi/kum beyazı) ve `#f5f2ee` (Yumuşak açık bej)
- **Glassmorphism (Cam Efekti):** Kartlar ve form alanları, yarı saydam beyaz arka plan, hafif sınır çizgileri ve arka plan bulanıklaştırma (`backdrop-filter: blur(12px)`) efektiyle havada süzülüyormuş hissi uyandırır.
- **Tipografi:** Google Fonts üzerinden **Inter** (gövde metinleri için modern ve temiz) ve **Outfit** (başlıklar için premium ve prestijli) yazı tipleri kullanılmıştır.
- **Giriş Sayfası Arka Planı:** Tüm ekranı kaplayan (`background-size: cover; background-position: center; min-height: 100vh;`) doğal yaşam tarzı görseli (`/assets/img/login_bg.png`) ve üzerinde cam kart giriş formu kullanılmıştır.

---

## 📂 React Dosya Yapısı

Proje, Vite ile yapılandırılmış ve aşağıdaki modüler yapıda kurulmuştur:

```text
/01072026_proje
├── agend/
│   └── agend.md             # Geliştirme Yol Haritası ve Görev Takibi (React)
├── skill/
│   ├── project.md           # [BU DOSYA] Proje Özellikleri ve Tasarım Detayları
│   └── skill.md             # Kod Standartları, ID Kuralları ve Geliştirici Talimatları
├── public/
│   └── assets/
│       └── img/             # login_bg.png, hero_1.png, hero_2.png, product_1.png - product_6.png
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Ortak Gezinti Çubuğu
│   │   ├── Footer.jsx       # Ortak Sayfa Sonu
│   │   └── Toast.jsx        # Sepete ekleme vb. durumlarda gösterilecek Toast bildirimi
│   ├── context/
│   │   └── CartContext.jsx  # Sepet durumunu ve localStorage senkronizasyonunu yöneten Context
│   ├── data/
│   │   └── products.js      # Ürün veritabanı simülasyonu
│   ├── pages/
│   │   ├── Home.jsx         # Ana Sayfa / Pazarlama ve Ürün Vitrini
│   │   ├── Catalog.jsx      # Ürün Filtreleme ve Arama Sayfası
│   │   ├── ProductDetail.jsx# Ürün Detay Sayfası
│   │   ├── Cart.jsx         # Alışveriş Sepeti Sayfası
│   │   ├── Checkout.jsx     # Ödeme Sayfası
│   │   ├── Login.jsx        # Giriş Sayfası (Tüm ekranı kaplayan arka plan resimli)
│   │   └── Register.jsx     # Kayıt Olma Sayfası
│   ├── App.jsx              # Router ve Context sağlayıcılarının yer aldığı ana bileşen
│   ├── index.css            # Global ve premium CSS kuralları
│   └── main.jsx             # Giriş noktası
├── package.json             # Bağımlılıklar ve scriptler
└── vite.config.js           # Vite yapılandırması
```

---

## 📄 Rotalar ve Sayfa İçerikleri

### 1. Ana Sayfa (`/`)
- **Kahraman Bölümü (Hero Carousel):** Yeni sezon ürünleri veya büyük indirim kampanyalarını tanıtan, yüksek kaliteli görseller ve harekete geçirici butonlar içeren, React state kontrollü slider.
- **Öne Çıkan Ürünler:** İlk 3 popüler ürünün kartı, "Sepete Ekle" ve detay sayfasına yönlendirme butonları.
- **Bülten Aboneliği (Newsletter):** Şık bir e-posta giriş alanı ve kayıt butonu içeren pazarlama formu.

### 2. Katalog Sayfası (`/catalog`)
- **Gelişmiş Filtreleme Paneli (Sidebar):** Kategori seçimi, fiyat aralığı (slider) ve müşteri sıralama seçimi.
- **Dinamik Filtreleme:** React state'i sayesinde arama girdisi ve filtre seçimleri anlık olarak ürün listesini süzerek günceller.

### 3. Ürün Detay Sayfası (`/detail/:id`)
- **Seçenekler:** Beden seçimi (S, M, L), renk seçimi (aktif durum belirteçli butonlar), adet belirleme alanı.
- **Tab Paneli:** "Açıklama", "Teknik Özellikler" ve "Müşteri Değerlendirmeleri" sekmeleri arası dinamik React state geçişleri.

### 4. Alışveriş Sepeti (`/cart`)
- **Sepet Ürünleri Tablosu:** Ürün varyasyon bilgileri, adet seçici, birim fiyat, toplam fiyat ve silme butonu.
- **Kupon Kodu Alanı:** `INDIRIM10` kuponu girildiğinde anlık olarak sepete %10 indirim yansıtır.

### 5. Ödeme Sayfası (`/checkout`)
- **Form Doğrulama:** Ad, soyad, e-posta, telefon ve açık adres alanları Bootstrap validation kurallarına göre denetlenir.
- **Ödeme Seçenekleri:** Kredi Kartı veya Havale/EFT seçimi accordion menü ile yönetilir.
- **Başarı Modalı:** Form onaylandığında sepet temizlenir ve kullanıcıya sipariş onay modalı gösterilir.

### 6. Giriş (`/login`) ve Kayıt (`/register`) Sayfaları
- Tam ekran arka planlı, cam kart tasarımlı ve validation kontrollü kullanıcı giriş ve üyelik sayfaları.
