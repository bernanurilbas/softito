# Mini CRM Yazılım Geliştirme Yönergeleri (Developer Skills & Guidelines)

Bu kılavuz, Mini CRM projesinde kod yazarken uyulması gereken standartları, mimari kuralları ve geliştirme ipuçlarını içerir.

---

## 1. TypeScript & Import Standartları

Projenin derleme ayarlarında `verbatimModuleSyntax` etkindir. Bu nedenle:
- **Kural:** Tip/Arayüz importlarında mutlaka `import type` veya `import { type ... }` söz dizimi kullanılmalıdır. Aksi halde derleyici (tsc) hata verecektir.
  - **Doğru:**
    ```typescript
    import type { RootState, AppDispatch } from '../app/store';
    import { type Customer } from './customersSlice';
    ```
  - **Yanlış:**
    ```typescript
    import { RootState, AppDispatch } from '../app/store';
    ```

- **Kural:** Kullanılmayan tüm kütüphane ve ikon importları kod temizliği için temizlenmeli, gereksiz dosya boyutu oluşması engellenmelidir.

---

## 2. Redux State Yönetimi & Veri Akışı

Asenkron işlemler (API istekleri) Redux Toolkit'in `createAsyncThunk` yapısı ile yönetilir.

- **Kural:** Her veritabanı tablosu (`customers`, `deals`, `tasks`, `settings`) için ayrı bir slice oluşturulmalı ve bu slice'lar `src/app/store.ts` dosyasına bağlanmalıdır.
- **Kural:** Ekleme, güncelleme veya silme işlemleri yapıldıktan sonra state güncellenmeli ve arayüze anında yansıtılmalıdır (Optimistic veya full update).
- **Kural:** Arayüz bileşenlerinde `useDispatch<AppDispatch>()` ve `useSelector((state: RootState) => ...)` kancaları ile state'e erişilmelidir.

---

## 3. Tailwind CSS v4 Tasarım Standartları

Tailwind CSS v4 CSS-first yapıda çalışır. Tüm renk temaları, yazı fontları ve animasyonlar `src/index.css` dosyasında `@theme` bloğu altında yönetilir.

- **Renk Kullanımı:** Ad-hoc (rastgele) HSL/HEX kodları yerine `index.css`'te tanımlanmış semantik renk değişkenleri tercih edilmelidir:
  - `bg-crm-bg-light` veya `dark:bg-crm-bg-dark`
  - `text-crm-text-light` veya `dark:text-crm-text-dark`
  - `bg-primary`, `bg-secondary`, `text-crm-success`, `text-crm-error`
- **Cam Efektleri:** Kart ve paneller için hazır `.glassmorphism` veya `.glassmorphism-card` sınıfları kullanılmalıdır.
- **Geçiş Efektleri:** Sayfa veya modal geçişlerinde yumuşaklığı sağlamak adına animasyon sınıfları (`animate-fade-in`, `animate-slide-up`, `animate-scale-up`) uygulanmalıdır.

---

## 4. CRUD ve Arayüz Kuralları

- **Müşteri Ekleme:** E-posta, isim ve şirket alanları doğrulanmalı, profil resmi atanmadığında random gravatar/avatar oluşturulmalıdır.
- **Fırsat (Deal) Yönetimi:** Fırsatlar Kanban tahtasında listelenir. Kartların altında yer alan ileri/geri butonları ile aşama (`stage`) güncellemeleri yapılır.
- **Görev Takibi:** Görevler tamamlandığında checkbox ile işaretlenir. Tamamlanan görevlerin üzeri çizilir ve renkleri soluklaşır.
- **Ayarlar:** Tema geçişi hem sidebar'dan anlık olarak yapılabilir hem de Settings sayfasından kalıcı olarak kaydedilebilir. Ayar kaydı yapıldığında kullanıcıya başarı mesajı gösterilir.

---

## 5. Doğrulama (Verification)

Yaptığınız değişiklikleri test etmek için:
1. TypeScript derlemesini test edin:
   ```bash
   npm run build
   ```
2. Uygulamayı ve mock veri sunucusunu başlatın:
   ```bash
   npm run start
   ```
3. Tarayıcıda [http://localhost:5173/](http://localhost:5173/) adresine giderek özellikleri test edin.
