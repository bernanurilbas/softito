# HızlıSepet React + Bootstrap Proje Gündemi

HızlıSepet uygulamasının React, Bootstrap ve json-server kullanılarak geliştirilmesine ait kilometre taşları ve aşamalar.

## Kilometre Taşları

### Aşama 1: Ortam Kurulumu [TAMAMLANDI]
- [x] Gerekli bağımlılıkların yüklenmesi (`bootstrap`, `bootstrap-icons`, `json-server`).
- [x] Mock veritabanı şablonu olan `db.json` dosyasının oluşturulması.
- [x] Vite geliştirme sunucusunun (`npm run dev`) ve json-server'ın paralel başlatılması.

### Aşama 2: Mock Veritabanı Tasarımı [TAMAMLANDI]
- [x] Yemek, Market ve Mahalle portalları için ortak `/restaurants` şemasının hazırlanması.
- [x] İndirim kuponları kuralları için `/coupons` şemasının tasarlanması.
- [x] Kayıtlı adresler `/addresses` ve sipariş geçmişi `/orders` yapısının oluşturulması.

### Aşama 3: Arayüz İskeleti & Navigasyon [TAMAMLANDI]
- [x] Konum takibi, sepet özeti ve üyelik butonlarını barındıran Bootstrap destekli üst menü (Navbar).
- [x] Yemek, Market ve Mahalle bölümleri arasında dinamik geçiş sağlayan ana sekmeler.

### Aşama 4: SVG Harita ile Konum Seçici [TAMAMLANDI]
- [x] `/addresses` endpoint'ine bağlı kayıtlı adres listesi.
- [x] Tıklanan koordinatları adrese çeviren ve SVG harita üzerinde pim bırakan konum seçici modalı.

### Aşama 5: Mağaza Menüsü & Özelleştirme Modalı [TAMAMLANDI]
- [x] Seçilen restoran/market/dükkana ait detaylı ürün ve mutfak listeleme ekranları.
- [x] Boyut, ekstra sos, malzeme seçimi ve sipariş notu eklemeyi sağlayan ürün özelleştirme modalı.

### Aşama 6: Sepet Yönetimi & Ödeme Ekranı [TAMAMLANDI]
- [x] Kupon kodu uygulanabilen, ürün adetleri güncellenebilen açılır sepet çekmecesi (Cart Drawer).
- [x] CVV odaklandığında dönen 3D tasarımlı Kredi Kartı görseli içeren güvenli online ödeme formu.

### Aşama 7: Canlı Kurye Takibi & Admin Paneli [TAMAMLANDI]
- [x] Sipariş adımlarını (Alındı, Hazırlanıyor, Yolda, Teslim Edildi) gösteren durum çubuğu ve kurye hareketli SVG harita takibi.
- [x] Arama, sıralama ve sayfalama (pagination) özellikli işletme listeleme veri tablosu (Data Table).

### Aşama 8: Turuncu Rebranding & Koyu Tema [TAMAMLANDI]
- [x] Arayüzün HızlıSepet kurumsal turuncu rengiyle (`#FF6000`) yeniden şekillendirilmesi.
- [x] LocalStorage kayıtlı, tek tıkla değişebilen tam uyumlu Koyu Tema (Dark Mode) desteği.

### Aşama 9: Sipariş Geçmişi & Hızlı Tekrarlama [TAMAMLANDI]
- [x] Müşterilerin tüm eski siparişlerini detaylı inceleyebileceği "Sipariş Geçmişim" arayüzü.
- [x] Eski bir siparişi tek tıkla sepete kopyalayan "Tekrar Sipariş Et" özelliği.

### Aşama 10: Üye Kaydı & Kapıda Ödeme Seçenekleri [TAMAMLANDI]
- [x] Giriş ekranında "Kayıt Ol" formu ile yeni Müşteri ve İşletme profillerinin oluşturulabilmesi.
- [x] Kapıda Ödeme yönteminde "Kapıda Nakit" ve "Kapıda Kredi Kartı (POS)" alt kırılımlarının seçilebilmesi.

### Aşama 11: Kolay Rol Geçişi & Kanban İş Akışı [TAMAMLANDI]
- [x] Geliştiriciler için navbar üzerinde tek tıkla Müşteri, İşletme ve Admin hesapları arası geçiş sağlayan rol menüsü.
- [x] İşletme sahipleri için sipariş durumunu sürükle-bırak tadında yöneten 4 sütunlu (Onay Bekleyen, Hazırlanıyor, Yolda, Teslim Edildi) sipariş iş akış panosu.

### Aşama 12: Bileşen Arayüzü Refaktörü [TAMAMLANDI]
- [x] Monolitik `App.jsx` dosyasının modüler alt bileşenlere (`src/components/` klasörüne) parçalanması.
