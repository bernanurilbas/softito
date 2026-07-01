export const productsData = [
  { 
    id: '1', 
    name: 'Doğal Keten Alışveriş Çantası', 
    price: 450.00, 
    img: '/assets/img/product_1.png', 
    category: 'ev', 
    rating: 5, 
    reviews: 48, 
    tag: 'Organik',
    desc: 'Tamamen sürdürülebilir, dayanıklı ve şık doğal keten kumaştan üretilen bez çantamız, günlük alışverişleriniz ve plaj kullanımı için mükemmel bir alternatiftir. Doğal lifli yapısı sayesinde sağlam ve çevre dostudur.',
    sizes: ['Standart'],
    colors: ['Doğal Keten', 'Haki', 'Zeytin'],
    colorImages: {
      'Doğal Keten': '/assets/img/product_1_beige.png',
      'Haki': '/assets/img/product_1.png',
      'Zeytin': '/assets/img/product_1.png'
    },
    specs: 'Ölçüler: 45x40 cm | Malzeme: %100 Doğal Keten | Yıkama: 30 derecede hassas program'
  },
  { 
    id: '2', 
    name: 'Toprak Rustik Seramik Demlik Seti', 
    price: 1250.00, 
    img: '/assets/img/product_2.png', 
    category: 'mutfak', 
    rating: 4.5, 
    reviews: 34, 
    tag: 'El Yapımı',
    desc: 'Usta seramik zanaatkarları tarafından elde şekillendirilen ve yüksek fırınlama ile dayanıklılığı artırılan bu çaydanlık seti, soflarınıza rustik ve sıcak bir dokunuş kazandıracak. Sağlığa zararsız gıda dostu sır kullanılmıştır.',
    sizes: ['Standart'],
    colors: ['Karamel Toprak', 'Bej'],
    colorImages: {
      'Karamel Toprak': '/assets/img/product_2.png',
      'Bej': '/assets/img/product_2.png'
    },
    specs: 'Kapasite: Demlik 800ml, Fincanlar 150ml | Paket: 1 Adet Demlik + 2 Adet Fincan | Bulaşık makinesinde yıkanabilir.'
  },
  { 
    id: '3', 
    name: 'Saf Keten Haki Unisex Şal', 
    price: 690.00, 
    img: '/assets/img/product_3.png', 
    category: 'giyim', 
    rating: 4.0, 
    reviews: 19, 
    tag: 'Koleksiyon',
    desc: 'Dört mevsim kullanıma uygun, nefes alabilen yapısıyla saf ketenden dokunan unisex haki şalımız. Hem şıklığı hem de yumuşak dokusuyla cildinizi tahriş etmez, doğal kırışık görünümüyle cool bir stil sunar.',
    sizes: ['Standart'],
    colors: ['Haki', 'Taş Beji', 'Fildişi'],
    colorImages: {
      'Haki': '/assets/img/product_3.png',
      'Taş Beji': '/assets/img/product_3.png',
      'Fildişi': '/assets/img/product_3.png'
    },
    specs: 'Ebatlar: 180x70 cm | Malzeme: %100 Saf Keten | Elde yıkama veya kuru temizleme tavsiye edilir.'
  },
  { 
    id: '4', 
    name: 'Amber Bardak Kokulu Mum', 
    price: 280.00, 
    img: '/assets/img/product_4.png', 
    category: 'ev', 
    rating: 4.8, 
    reviews: 52, 
    tag: 'Popüler',
    desc: 'Sedir ağacı ve kehribar esanslı, soya mumu hammaddesi ile hazırlanan el yapımı kokulu mum. Amber cam kavanozu sayesinde yakıldığında evinizde yumuşak ve loş bir ışık süzülmesi ve huzur verici bir koku yaratır.',
    sizes: ['Küçük (120g)', 'Büyük (240g)'],
    colors: ['Klasik Amber'],
    colorImages: {
      'Klasik Amber': '/assets/img/product_4.png'
    },
    specs: 'Yanma Süresi: Ortalama 45 Saat | Malzeme: %100 Doğal Soya Mumu ve Pamuk Fitil | Esans: Kehribar & Sedir Ağacı'
  },
  { 
    id: '5', 
    name: 'Minimalist Deri Cüzdan', 
    price: 850.00, 
    img: '/assets/img/product_5.png', 
    category: 'aksesuar', 
    rating: 4.7, 
    reviews: 29, 
    tag: 'Deri',
    desc: 'Hakiki deriden, tamamen el dikişiyle hazırlanmış ultra ince ve minimalist cüzdan. Kartlarınızı ve nakit paranızı ceplerinizde potluk yapmadan en şık şekilde taşımanız için tasarlandı.',
    sizes: ['Standart'],
    colors: ['Karamel Kahve', 'Koyu Toprak'],
    colorImages: {
      'Karamel Kahve': '/assets/img/product_5.png',
      'Koyu Toprak': '/assets/img/product_5_black.png'
    },
    specs: 'Kapasite: 6 Adet Kart Gözü, 1 Adet Nakit Para Bölmesi | Malzeme: %100 Hakiki Deri | El dikişi mumlu ip.'
  },
  { 
    id: '6', 
    name: 'Bambu Kapaklı Cam Matara', 
    price: 390.00, 
    img: '/assets/img/product_6.png', 
    category: 'ev', 
    rating: 4.3, 
    reviews: 15, 
    tag: 'Matara',
    desc: 'Isıya dayanıklı borosilikat camdan üretilen, taşıma kolaylığı sağlayan haki silikon kılıflı ve bambu kapaklı şık su matarası. Plastik kullanımını azaltarak sağlıklı yaşam adımlarınıza eşlik eder.',
    sizes: ['550 ml', '750 ml'],
    colors: ['Haki Yeşil', 'Kum Grisi'],
    colorImages: {
      'Haki Yeşil': '/assets/img/product_6.png',
      'Kum Grisi': '/assets/img/product_6_grey.png'
    },
    specs: 'Malzeme: Borosilikat Cam, Doğal Bambu Kapak, Gıda Uyumlu Silikon Kılıf | Sızdırmaz conta halkası.'
  }
];
