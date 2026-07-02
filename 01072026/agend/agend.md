# Mini CRM Proje Yol Haritası & Gündemi (Project Agenda & Roadmap)

Bu doküman, Mini CRM projesinin geliştirme süreçlerini, tamamlanan aşamalarını ve geleceğe yönelik planlanan özelliklerini (roadmap) takip etmek amacıyla oluşturulmuştur.

---

## 1. Tamamlanan Aşamalar (Completed Phases)

### Faz 1: Altyapı ve Konfigürasyon (Setup & Config)
- [x] Vite React + TypeScript projesinin oluşturulması.
- [x] Gerekli paketlerin yüklenmesi (`Redux Toolkit`, `React Router DOM`, `Lucide React`, `Recharts`, `json-server`, `concurrently`).
- [x] Proje kökünde mock verileri barındıran `db.json` dosyasının tasarlanması ve test kullanıcı hesabının eklenmesi.
- [x] Tailwind CSS v4 entegrasyonu ve `@theme` renk, gölge, animasyon şablonlarının `src/index.css` üzerinde kurulması.
- [x] Global Redux Store (`store.ts`) ve veri dilimlerinin (`auth`, `customers`, `deals`, `tasks`, `settings`) oluşturulması.

### Faz 2: Arayüz ve Modül Geliştirme (UI & Features)
- [x] **Kimlik Doğrulama:** Giriş ekranı, oturum açma, hata bildirimleri, `localStorage` ile oturum koruma ve Route koruması (`ProtectedRoute`).
- [x] **Genel Panel (Dashboard):** Aktif müşteri, bekleyen görev, kazanma oranı ve boru hattı cirosunu hesaplayan KPI özet kartları. Recharts bar ve pie grafik raporlamaları.
- Müşteriler sayfasında arama, durum filtreleri, ekleme ve düzenleme modalları (CRUD).
- **Müşteri Detay:** İletişim kartı, hızlı teklif/görev ekleme, local not alma kutusu ve etkileşim zaman tüneli (Timeline).
- **Kanban Satış Pipeline:** Aşamalarına göre fırsat kolonları, fırsat ekleme ve tek tıkla aşama güncelleme kontrolleri.
- **Görevler:** Öncelik ve son tarihe göre filtreleme yapılabilen görev kontrol listesi.
- **Ayarlar:** Tema değiştirme, varsayılan para birimi ve Kanban kolonlarını yönetme ekranı.

### Faz 3: Kalite Kontrol ve Derleme (Quality & Build Validation)
- [x] TypeScript derleme hatalarının (`tsc -b`) çözülmesi. Strict `verbatimModuleSyntax` kuralları gereği type importlarının `import type` olarak düzenlenmesi.
- [x] Arayüzdeki kullanılmayan değişken, kütüphane ve ikon importlarının temizlenmesi.
- [x] `npm run build` komutu ile uygulamanın hatasız paketlenmesinin doğrulanması.

---

## 2. Planlanan Gelecek Özellikler (Future Roadmap)

Aşağıdaki özellikler, uygulamanın daha profesyonel ve ölçeklenebilir bir yapıya kavuşması için gelecekte eklenecektir:

### Gelişmiş Raporlama & Dışa Aktarma
- [ ] Dashborad raporlarının ve müşteri listelerinin **PDF** veya **Excel** dosyası olarak indirilmesi.
- [ ] Müşteri bazlı detaylı kar/zarar analiz tabloları.

### Bildirimler ve Entegrasyonlar
- [ ] Teslim tarihi yaklaşan veya geciken görevler için tarayıcı içi anlık bildirim (Web Push Notifications) sistemi.
- [ ] E-posta servis entegrasyonu (SendGrid vb.) ile müşteriye doğrudan sistem üzerinden e-posta gönderebilme.

### Çoklu Dil Desteği
- [ ] `react-i18next` paketi kullanılarak Türkçe, İngilizce ve Almanca dil seçeneklerinin eklenmesi.

### Gerçek Backend Geçişi
- [ ] Mock veritabanı `json-server` yerine gerçek bir backend mimarisine (örn. Node.js Express/NestJS, PostgreSQL veritabanı, Prisma ORM) geçiş.
- [ ] JWT (JSON Web Token) tabanlı güvenli oturum açma ve rol tabanlı yetkilendirme (RBAC) sistemi.
