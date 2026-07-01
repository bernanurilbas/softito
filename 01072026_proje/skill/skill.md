---
name: bootstrap-ecommerce-react-guidelines
description: React, Context API, Benzersiz ID kuralları ve Bootstrap 5 e-ticaret geliştirme standartları.
---

# React + Bootstrap E-Ticaret Geliştirme Standartları & Kuralları

Bu doküman, projede yazılacak tüm React bileşenleri, Context yapıları ve CSS kodlarının sıfır hata ile yazılması ve test edilebilir olması için uyulması gereken kuralları tanımlar.

---

## 🚫 Sıfır Hata (Zero-Error) Politikası

- **Geçerli JSX & HTML:** Tüm sayfalar standartlara uygun, düzgün kapatılmış JSX etiketlerine sahip olmalıdır. `class` yerine `className`, `for` yerine `htmlFor` kullanılmalıdır.
- **Konsol Temizliği:** React ve tarayıcı konsolunda hiçbir hata (Error) veya benzersiz anahtar uyarısı (key prop warning) bulunmamalıdır. Döngülerde her elemana mutlaka benzersiz bir `key` niteliği verilmelidir.
- **CSS Çakışmaları:** Bootstrap sınıfları ezilirken doğrudan kütüphane dosyaları değiştirilmeyecek, tüm özelleştirmeler `src/index.css` dosyasında yapılacaktır. `!important` kullanımı en aza indirilecektir.
- **Dinamik Rota Linkleri:** Tüm sayfa içi yönlendirmeler için `a` etiketi yerine `react-router-dom` içindeki `Link` veya `NavLink` bileşenleri kullanılacaktır.

---

## 🏷️ Zorunlu Benzersiz ID (Unique ID) Kuralları

Otomatik tarayıcı testleri ve test otomasyon araçları için, sayfadaki **tüm etkileşimli elemanlara benzersiz ve anlamlı bir `id` niteliği verilmesi zorunludur**.

### ID Adlandırma Şeması:
ID değerleri küçük harfle, kelimeler tire (`-`) ile ayrılmış ve ne işe yaradığını belirtecek şekilde olmalıdır.

#### 1. Gezinti ve Header Elemanları:
- Logo linki: `id="link-brand-logo"`
- Arama girdisi: `id="input-global-search"`
- Arama butonu: `id="btn-global-search"`
- Sepet ikonu/butonu: `id="btn-nav-cart"`
- Sepet adet rozeti: `id="badge-nav-cart-count"`
- Menü linkleri: `id="link-nav-home"`, `id="link-nav-catalog"`, `id="link-nav-contact"`

#### 2. Ürün ve Katalog Elemanları:
- Kategori Filtreleri: `id="filter-category-electronics"`, `id="filter-category-fashion"`
- Fiyat Aralığı Slider'ı: `id="input-filter-price-min"`, `id="input-filter-price-max"`
- Sıralama Seçimi: `id="select-catalog-sort"`
- Ürün Kartı Butonları: `id="btn-view-detail-{product_id}"`, `id="btn-add-to-cart-{product_id}"`

#### 3. Ürün Detay Elemanları:
- Beden Seçenekleri: `id="btn-size-s"`, `id="btn-size-m"`, `id="btn-size-l"`
- Renk Seçenekleri: `id="btn-color-red"`, `id="btn-color-blue"`
- Adet Artırma/Azaltma: `id="btn-qty-decrement"`, `id="btn-qty-increment"`, `id="input-qty-value"`
- Ana Sepete Ekle Butonu: `id="btn-detail-add-to-cart"`
- Detay Sekmeleri: `id="tab-trigger-description"`, `id="tab-content-description"`

#### 4. Sepet ve Ödeme Formları:
- Sepet Ürün Adet Girişi: `id="input-cart-qty-{product_id}"`
- Sepet Ürün Silme Butonu: `id="btn-cart-remove-{product_id}"`
- Kupon Kodu Girişi: `id="input-coupon-code"`
- Kupon Uygula Butonu: `id="btn-apply-coupon"`
- Ödemeye Geç Butonu: `id="btn-proceed-checkout"`
- Fatura Formu Elemanları: `id="input-checkout-firstname"`, `id="input-checkout-lastname"`, `id="input-checkout-email"`, `id="input-checkout-address"`
- Kargo Seçenekleri: `id="radio-shipping-standard"`, `id="radio-shipping-express"`
- Siparişi Tamamla Butonu: `id="btn-submit-order"`

---

## 🎨 Bootstrap 5.3 Kullanım Kılavuzu

1. **Responsive Tasarım:** Sayfa düzeni her zaman mobil öncelikli (mobile-first) olarak kurgulanmalıdır. `col-12 col-md-6 col-lg-4` gibi kırılma noktası (breakpoints) sınıfları aktif olarak kullanılmalıdır.
2. **Boşluk ve Hizalama:** Satır içi (inline) stiller yerine Bootstrap'in boşluk utilities (`mt-3`, `pb-5`, `g-4`) ve flexbox sınıfları (`d-flex`, `justify-content-between`, `align-items-center`) kullanılmalıdır.
3. **Form Tasarımı:** Form kontrol elemanları her zaman `form-control` ve `form-label` sınıfları ile sarılmalı, hata durumları için `.needs-validation` ve `.invalid-feedback` yapıları kullanılmalıdır.

---

## 🔍 SEO ve Erişebilirlik (a11y) Gereksinimleri

- **Başlık Hiyerarşisi:** Her sayfada yalnızca bir adet `<h1>` bulunmalıdır. Başlıklar sırasıyla `<h2>`, `<h3>` şeklinde hiyerarşik gitmelidir.
- **Resim Alt Nitelikleri:** Eklenen tüm `img` etiketlerinde açıklayıcı ve SEO dostu `alt="..."` niteliği zorunludur.
- **Erişilebilirlik:** Ekran okuyucular için etkileşimli elemanlara `aria-label` eklenmeli, butonlar ve linkler klavye ile odaklanabilir (`tabindex`) olmalıdır.
- **Meta Açıklamaları:** Her sayfa için benzersiz ve optimize edilmiş `<title>` ve `<meta name="description">` etiketleri bulunmalıdır.
