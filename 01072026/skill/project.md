# Proje Başlatma Rehberi (React + Vite + Tailwind CSS v4 + JSON Server + Redux Toolkit)

Bu doküman, Mini CRM (Müşteri İlişkileri Yönetim Sistemi) projesinin teknik mimarisini, tasarım sistemini, veri modellerini ve state yönetim yapısını tanımlar.

---

## 1. Genel Proje Bilgileri
- **Proje Adı:** `Mini CRM`
- **Açıklama:** Küçük ve orta ölçekli işletmelerin müşteri bilgilerini, satış süreçlerini ve günlük yapılacak işlerini (görevlerini) tek bir merkezden yönetmelerini sağlayan, modern, hızlı ve duyarlı (responsive) bir web uygulamasıdır.
- **Hedef Kitle:** Küçük İşletmeler, Freelancerlar, Satış ve Müşteri Temsilcileri.

---

## 2. Tasarım Sistemi ve Görsel Kimlik (Design System)

Uygulamada modern bir kurumsal görünüm elde etmek için Tailwind CSS v4'ün CSS-first tema yapısı kullanılmış ve `src/index.css` dosyasında özelleştirilmiştir.

### Renk Paleti (Harmonious Palette)
- **Primary (Ana Renk - Marka Kimliği):** `hsla(224, 64%, 9%, 1.00)` (Koyu Gece Mavisi / Lacivert)
  - CSS Değişkeni: `--color-primary`
- **Secondary / Accent (Vurgu Rengi):** `hsla(263, 90%, 51%, 1.00)` (Canlı Mor / Violet)
  - CSS Değişkeni: `--color-secondary` / `--color-accent`
- **Neutral Background (Arka Planlar):**
  - Açık Tema: `hsla(210, 40%, 98%, 1.00)` (`--color-crm-bg-light`)
  - Koyu Tema: `hsla(224, 64%, 5%, 1.00)` (`--color-crm-bg-dark`)
- **Neutral Text (Yazı Renkleri):**
  - Açık Tema: `hsla(215, 28%, 17%, 1.00)` (`--color-crm-text-light`)
  - Koyu Tema: `hsla(210, 40%, 98%, 1.00)` (`--color-crm-text-dark`)
- **Durum Renkleri (Semantic Colors):**
  - Başarı: `hsla(150, 80%, 38%, 1.00)` (`--color-crm-success`)
  - Uyarı: `hsla(38, 92%, 50%, 1.00)` (`--color-crm-warning`)
  - Hata: `hsla(354, 75%, 52%, 1.00)` (`--color-crm-error`)

### Tipografi ve Fontlar
- **Birincil Yazı Tipi:** `Outfit` (Google Fonts üzerinden dinamik olarak yüklenir)
- **CSS Tanımı:** `font-sans`

### UI Özellikleri ve Efektler
- **Glassmorphism:** Blur efekti içeren yarı saydam kart ve paneller (`.glassmorphism`, `.glassmorphism-card`).
- **Mikro Etkileşimler:** `transition-all duration-300` ile butonlarda ve kartlarda yumuşak hover efektleri.
- **Koyu Tema (Dark Mode):** `dark:` seçicisi aracılığıyla HTML tag'ine eklenen `.dark` sınıfı ile yönetilir.

---

## 3. Sayfa Yapısı ve Yönlendirmeler (Page Routes)

Uygulamada yer alan sayfalar ve adresleri:

- **`/login` (Giriş Sayfası):** Şık, cam morfolojili giriş arayüzü. Kimlik doğrulama işlemi mock kullanıcı tablosu üzerinden yapılır.
- **`/` (Dashboard / Panel):** 
  - KPI Kartları: Aktif Müşteriler, Toplam Boru Hattı Değeri, Kazanma Oranı, Bekleyen Görevler.
  - Grafik Raporlama: Aşamalara göre satış hacmi bar grafiği (Recharts) ve pipeline dağılım oranları (Pie Chart).
  - Listeler: Yaklaşan işlerin ve son fırsatların listelendiği paneller.
- **`/customers` (Müşteri Yönetimi):** Arama çubuğu, aktif/pasif filtreleri, detaylı müşteri tablosu ve yeni müşteri ekleme/düzenleme modalları.
- **`/customers/:id` (Müşteri Detay):** İletişim bilgileri, müşteriye özel açılmış satış fırsatları ile atanmış görevlerin takibi, zaman tüneli ve görüşme notu ekleme alanı.
- **`/deals` (Satış Süreçleri / Kanban):** Aşamalarına (`new`, `contacted`, `proposal_sent`, `won`, `lost`) göre ayrılmış Kanban tahtası. Kartları tek tıkla sağa/sola kaydırabilme özelliği.
- **`/tasks` (Görevler):** Öncelik (Yüksek, Orta, Düşük) ve duruma göre filtrelenebilen, ilişkili müşteri bilgileriyle zenginleştirilmiş görev listesi.
- **`/settings` (Sistem Ayarları):** Dark Mode açma/kapama, varsayılan para birimi değiştirme ve boru hattı aşamalarını özelleştirme paneli.

---

## 4. Veri Modeli ve Veritabanı Şeması (`db.json`)

Uygulamanın `json-server` ile sunduğu veri yapısı:

```json
{
  "users": [
    {
      "id": "1",
      "name": "Burak Yılmaz",
      "email": "admin@crm.com",
      "password": "admin123",
      "role": "Satış Direktörü",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
    }
  ],
  "customers": [
    {
      "id": "101",
      "name": "Ahmet Yılmaz",
      "company": "Kuzey Yazılım",
      "email": "ahmet@kuzeyyazilim.com",
      "phone": "+90 532 123 45 67",
      "status": "active",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    }
  ],
  "deals": [
    {
      "id": "1",
      "customerId": "101",
      "title": "Kurumsal Web Tasarım Paketi",
      "value": 25000,
      "stage": "proposal_sent",
      "expectedCloseDate": "2026-07-25"
    }
  ],
  "tasks": [
    {
      "id": "t1",
      "customerId": "101",
      "text": "Ahmet Bey ile sözleşme detayları için telefon görüşmesi yapılacak.",
      "priority": "high",
      "completed": false,
      "dueDate": "2026-07-10"
    }
  ],
  "settings": {
    "darkMode": false,
    "currency": "TRY",
    "pipelineStages": ["new", "contacted", "proposal_sent", "won", "lost"]
  }
}
```

---

## 5. Global State Yönetimi (Redux Toolkit)

Uygulama genelinde kullanılan slice yapıları ve asenkron eylemler (Async Thunks):

### 1. `authSlice`
- **State:** `user`, `isAuthenticated`, `status`, `error`
- **Actions:** 
  - `loginUser({ email, password })` -> `/users` sorgusu yapar, şifre uyuşuyorsa `localStorage`'a yazar.
  - `logout()` -> Oturumu sonlandırır, verileri temizler.

### 2. `customersSlice`
- **State:** `items`, `status`, `error`
- **Actions:**
  - `fetchCustomers()` -> `GET /customers`
  - `addCustomer(data)` -> `POST /customers`
  - `updateCustomer(data)` -> `PUT /customers/:id`
  - `deleteCustomer(id)` -> `DELETE /customers/:id`

### 3. `dealsSlice`
- **State:** `items`, `status`, `error`
- **Actions:**
  - `fetchDeals()` -> `GET /deals`
  - `addDeal(data)` -> `POST /deals`
  - `updateDeal(data)` -> `PUT /deals/:id`
  - `deleteDeal(id)` -> `DELETE /deals/:id`

### 4. `tasksSlice`
- **State:** `items`, `status`, `error`
- **Actions:**
  - `fetchTasks()` -> `GET /tasks`
  - `addTask(data)` -> `POST /tasks`
  - `toggleTaskCompleted(task)` -> `PUT /tasks/:id` (tamamlandı durumunu tersine çevirir)
  - `deleteTask(id)` -> `DELETE /tasks/:id`

### 5. `settingsSlice`
- **State:** `config` (darkMode, currency, pipelineStages), `status`, `error`
- **Actions:**
  - `fetchSettings()` -> `GET /settings`
  - `updateSettings(config)` -> `PUT /settings`
  - `toggleLocalDarkMode()` -> Arayüzde karanlık/aydınlık modu anında uygular.

---

## 6. Proje Durumu ve Çalıştırma
Uygulama başarıyla kurulmuş, kodların derlenme ve paketlenme testleri yapılmıştır.

- Hem frontend hem backend sunucusunu tek bir komutla başlatmak için:
  ```bash
  npm run start
  ```
  *(Bu komut `concurrently` kullanarak `vite` geliştirme sunucusunu ve `json-server` veritabanı sunucusunu aynı anda çalıştırır.)*
