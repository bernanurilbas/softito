# HızlıSepet React Geliştirici Kılavuzu & Yardımcı Yetenekler

Bu kılavuz, HızlıSepet projesindeki React yeteneklerini, REST API haberleşmesini, dinamik sekmeleri ve özel durum yönetim metodolojilerini açıklar.

## 1. Merkezi REST API Haberleşmesi
Uygulama, yerel json-server (`http://localhost:3001`) ile `fetch` API kullanarak haberleşir. Sunucu kapalıyken uygulamanın çökmemesi için `App.jsx` içinde zengin bir **Local Fallback (Yerel Yedek)** veri seti bulunur:

```javascript
const API_URL = "http://localhost:3001";

// Verileri sunucudan çeker, hata durumunda yerel yedekleri devreye sokar
const syncAllData = async () => {
  try {
    const res = await fetch(`${API_URL}/restaurants`);
    if (res.ok) setRestaurants(await res.json());
  } catch (err) {
    fetchFallbackData(); // Yedek verileri yükler
  }
};
```

## 2. Dinamik Portal Kategorileri
Farklı portallar (Yemek, Market, Mahalle) seçildiğinde, ilgili dükkan tiplerine göre dinamik alt filtreler oluşturulur:
- **Yemek**: `['Hepsi', 'Burger', 'Pizza', 'Kebap', 'Tatlı', 'Sushi / Uzak Doğu', 'Ev Yemeği']`
- **Market**: `['Hepsi', 'Süpermarket', 'Organik Ürünler']`
- **Mahalle**: `['Hepsi', 'Manav', 'Fırın & Unlu Mamüller', 'Kasap & Şarküteri']`

## 3. Akıllı Rol Geçiş Yeteneği (Geliştirici Kısayolu)
Müşteri sipariş verdiğinde, siparişin durumunu hızlıca ilerletmek için geliştirilen hızlı geçiş aracı (`quickSwitchRole`):
- **Müşteri Modu**: Aktif bir siparişi varsa doğrudan `tracking` (takip) ekranını açar, yoksa anasayfaya yönlendirir.
- **İşletme Modu**: Burger Hub işletme arayüzünü ve 4 sütunlu Kanban sipariş onay listesini açar.
- **Admin Modu**: Platform yönetici paneli, kupon üretici ve restoran veri tablosunu açar.

## 4. Sipariş Tekrarlama Mantığı
Önceki bir siparişi sepeti silmeden tekrarlatmak için sepet içeriğini benzersiz anahtarlar (`uniqueId`) ile klonlayarak günceller:
```javascript
const handleReorder = (pastOrder) => {
  const duplicatedItems = pastOrder.items.map(item => ({
    ...item,
    uniqueId: `${item.id}-${Date.now() + Math.random()}`
  }));
  setCart({
    restaurantId: pastOrder.restaurantId,
    items: duplicatedItems
  });
  setShowCartDrawer(true);
};
```
