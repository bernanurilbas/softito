# HızlıSepet Proje Detayları & Teknik Şartnamesi

Bu proje, modern bir yemek ve market teslimat uygulamasını (HızlıSepet) simüle eden, **React**, **Bootstrap 5**, **Bootstrap Icons** ve **json-server** teknolojileriyle geliştirilmiş zengin özellikli bir Tek Sayfa Uygulamasıdır (SPA).

## Mimari Yapı & Portallar

1. **Ön Yüz (Frontend)**: React (Vite tabanlı)
   - **Tasarım**: Bootstrap 5 + özel CSS değişkenleri (Variables) ile şekillendirilmiş kurumsal turuncu renk şeması (`#FF6000`) ve Koyu Tema (Dark Mode) desteği.
2. **Arka Yüz (Backend)**: REST API isteklerini taklit eden lokal json-server veritabanı (`db.json`).
3. **Kullanıcı Rolleri & Portallar**:
   - **Yemek Portalı**: Restoranların derecelendirme, minimum paket, kurye ücreti ve özelleştirilebilir menü detaylarını içerir.
   - **Market Portalı**: Kategorilere (Süt, Kahvaltı, Meyve/Sebze vb.) göre hızlı sepete ekleme sunan süpermarket alanı.
   - **Mahalle Portalı**: Manav, kasap, fırın gibi yerel esnafların ürün kataloglarını içeren yerel dükkan alanı.
   - **İşletme (Merchant) Paneli**: Siparişleri "Onay Bekleyen", "Hazırlanıyor", "Yolda" ve "Teslim Edildi" olarak ayıran 4 sütunlu Kanban sipariş akış panosu ve ürün yönetim ekranı.
   - **Platform Yöneticisi (Admin) Paneli**: Arama, sıralama ve sayfalama özellikli veri tablosu (Data Table), yeni işletme/kupon ekleme sistemleri ve sipariş kayıt raporları.

## Tasarım Değişkenleri (CSS Variables)

Kullanılan renkler ve görsel şema tokenları:

```css
:root {
  --hz-primary: #FF6000;         /* HızlıSepet Canlı Turuncu */
  --hz-primary-hover: #E05000;   /* Hover Turuncu */
  --hz-primary-light: #FFF0E6;   /* Hafif Turuncu Arka Plan */
  --hz-secondary: #00875A;       /* Kupon ve İndirim Yeşili */
  --hz-secondary-light: #E5F6EE;
  --hz-dark: #1E2022;            /* Koyu Metin / Slate */
  --hz-light: #F8F9FA;           /* Açık Gri / Arka Plan */
  --hz-border-color: #E9ECEF;
  --hz-font-sans: 'Outfit', 'Inter', -apple-system, sans-serif;
  --hz-card-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
}
```

## Modüler Bileşen Ağacı (Components)

Uygulamanın mantıksal yapısı aşağıdaki alt bileşenlere ayrılmıştır:
- `App.jsx`: Genel durum (State) yönetimi ve veritabanı senkronizasyon merkezi.
- `Header.jsx`: Navbar, adres seçici, tema değiştirici ve hızlı rol değiştirme menüsü.
- `Footer.jsx`: Proje telif ve lisans bilgileri alt çubuğu.
- `LoginView.jsx`: Giriş ve yeni üye kayıt (Müşteri/İşletme) ekranları.
- `CustomerView.jsx`: Keşif bannerları, kategori filtreleri, dükkan listesi ve menü detay alanı.
- `CheckoutView.jsx`: Adres seçimi, online kart ödeme (dönen kart animasyonlu), kapıda ödeme kırılımları.
- `TrackingView.jsx`: Canlı kurye koordinatlarını içeren hareketli SVG harita ve sipariş durumu steppleri.
- `OrdersHistoryView.jsx`: Eski siparişlerin dökümü, takip kısayolu ve sepeti dolduran "Tekrarla" butonu.
- `MerchantDashboard.jsx`: Ciro sayaçları, 4'lü Kanban sipariş akışı ve menü ürün yöneticisi.
- `AdminDashboard.jsx`: Restoran veri tablosu, indirim kuponu tanımlayıcı ve sipariş günlükleri tablosu.
- `CartDrawer.jsx`: Açılır sepet çekmecesi, adet butonları ve kupon uygulama motoru.
- `ItemCustomizerModal.jsx`: Ürün boyutu ve sos/malzeme seçme penceresi.
