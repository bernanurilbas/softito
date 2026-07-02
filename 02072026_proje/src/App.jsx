import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Import subcomponents
import Header from './components/Header';
import Footer from './components/Footer';
import LoginView from './components/LoginView';
import CustomerView from './components/CustomerView';
import CheckoutView from './components/CheckoutView';
import TrackingView from './components/TrackingView';
import OrdersHistoryView from './components/OrdersHistoryView';
import MerchantDashboard from './components/MerchantDashboard';
import AdminDashboard from './components/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import ItemCustomizerModal from './components/ItemCustomizerModal';

const API_URL = 'http://localhost:3001';

export default function App() {
  // --- AUTHENTICATION STATE ---
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // --- REGISTRATION FORM STATE ---
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('customer'); // 'customer' | 'merchant'
  const [regRestName, setRegRestName] = useState('');
  const [regRestCuisine, setRegRestCuisine] = useState('Burger');

  // --- CORE DATA STATE (with preloaded fallbacks if JSON-server offline) ---
  const [restaurants, setRestaurants] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  // --- PORTAL PORTFOLIO SWITCHER ---
  const [activePortal, setActivePortal] = useState('yemek'); // 'yemek' | 'market' | 'mahalle'

  // --- CUSTOMER NAVIGATION & FLOW STATE ---
  const [activeView, setActiveView] = useState('home'); // 'home' | 'menu' | 'checkout' | 'tracking' | 'orders'
  const [selectedCategoryTag, setSelectedCategoryTag] = useState('Hepsi');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'duration' | 'minBasket'
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);

  // --- DARK MODE STATE ---
  const [darkMode, setDarkMode] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // --- CUSTOMIZE ITEM MODAL STATE ---
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [customSize, setCustomSize] = useState('');
  const [customExtras, setCustomExtras] = useState([]);
  const [customSauces, setCustomSauces] = useState([]);
  const [customInstructions, setCustomInstructions] = useState('');
  const [customQty, setCustomQty] = useState(1);

  // --- ADDRESS MODAL STATE ---
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressTitle, setAddressTitle] = useState('Ev');
  const [addressText, setAddressText] = useState('');
  const [mapPin, setMapPin] = useState({ x: 50, y: 50 }); // coordinates in %

  // --- CART DRAWER STATE ---
  const [cart, setCart] = useState({ restaurantId: null, items: [] });
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // --- CHECKOUT FORM STATE ---
  const [paymentMethod, setPaymentMethod] = useState('cash_door'); // 'cash_door' | 'card_door' | 'card_online'
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [checkoutNote, setCheckoutNote] = useState('');

  // --- ADMIN PORTAL STATE ---
  const [adminSearch, setAdminSearch] = useState('');
  const [adminSortHeader, setAdminSortHeader] = useState('name');
  const [adminSortDir, setAdminSortDir] = useState('asc');
  const [adminPage, setAdminPage] = useState(1);
  const adminPageSize = 3;
  
  // Admin Add Restaurant Form
  const [showAddRestModal, setShowAddRestModal] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestImage, setNewRestImage] = useState('');
  const [newRestCuisine, setNewRestCuisine] = useState('Burger');
  const [newRestMinBasket, setNewRestMinBasket] = useState(150);
  const [newRestFee, setNewRestFee] = useState(0);
  const [newRestType, setNewRestType] = useState('yemek');

  // Admin Add Coupon Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState('percent');
  const [newCouponValue, setNewCouponValue] = useState(25);
  const [newCouponMin, setNewCouponMin] = useState(150);

  // --- MERCHANT PORTAL STATE ---
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(150);
  const [newItemCategory, setNewItemCategory] = useState('Ana Yemekler');

  // --- DIALOG MODAL REFS ---
  const customizeDialogRef = useRef(null);
  const addressDialogRef = useRef(null);
  const addRestDialogRef = useRef(null);

  // --- INITIAL DATA FETCH & SYNC ---
  useEffect(() => {
    syncAllData();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Reset selected tag when active portal changes
  useEffect(() => {
    setSelectedCategoryTag('Hepsi');
  }, [activePortal]);

  // Sync state with JSON-Server or Fallbacks
  const syncAllData = async () => {
    try {
      const restRes = await fetch(`${API_URL}/restaurants`);
      if (restRes.ok) {
        const data = await restRes.json();
        setRestaurants(data);
      }
      
      const couponRes = await fetch(`${API_URL}/coupons`);
      if (couponRes.ok) {
        const data = await couponRes.json();
        setCoupons(data);
      }

      const addressRes = await fetch(`${API_URL}/addresses`);
      if (addressRes.ok) {
        const data = await addressRes.json();
        setAddresses(data);
      }

      const orderRes = await fetch(`${API_URL}/orders`);
      if (orderRes.ok) {
        const data = await orderRes.json();
        setOrders(data);
      }
    } catch (err) {
      console.warn('json-server connection failed, utilizing local fallback databases.', err);
      fetchFallbackData();
    }
  };

  const fetchFallbackData = () => {
    setRestaurants([
      {
        id: "1",
        name: "Burger Hub",
        type: "yemek",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60",
        cuisine: "Burger",
        rating: 4.8,
        duration: 25,
        fee: 20,
        minBasket: 150,
        menuItems: [
          {
            id: "item-101",
            name: "Classic Burger Menü",
            description: "El yapımı burger köftesi, marul, domates, turşu ve özel burger sosu. Patates kızartması ve içecek ile.",
            price: 180,
            category: "Menüler",
            options: {
              sizes: [{ name: "Küçük Boy", price: 0 }, { name: "Orta Boy (+20 TL)", price: 20 }, { name: "Büyük Boy (+40 TL)", price: 40 }],
              extras: [{ name: "Ekstra Peynir (+15 TL)", price: 15 }, { name: "Ekstra Dana Füme Et (+25 TL)", price: 25 }],
              sauces: ["Ketçap", "Mayonez", "Barbekü Sos"]
            }
          },
          {
            id: "item-102",
            name: "Cheese Burger",
            description: "Ergimiş cheddar peyniri, turşu, karamelize soğan ve özel peynir soslu enfes burger.",
            price: 160,
            category: "Tek Burgerler",
            options: {
              sizes: [{ name: "Tek Köfte", price: 0 }, { name: "Çift Köfte (+60 TL)", price: 60 }],
              extras: [{ name: "Ekstra Cheddar (+15 TL)", price: 15 }],
              sauces: ["Ketçap", "Mayonez"]
            }
          }
        ]
      },
      {
        id: "2",
        name: "Pizzamania",
        type: "yemek",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60",
        cuisine: "Pizza",
        rating: 4.6,
        duration: 30,
        fee: 0,
        minBasket: 200,
        menuItems: [
          {
            id: "item-201",
            name: "Pizza Margherita",
            description: "Özel domates sosu, mozzarella peyniri, taze fesleğen ve zeytinyağı.",
            price: 190,
            category: "Klasik Pizzalar",
            options: {
              sizes: [{ name: "Küçük Boy", price: 0 }, { name: "Orta Boy (+35 TL)", price: 35 }, { name: "Büyük Boy (+60 TL)", price: 60 }],
              extras: [{ name: "Kenar Peyniri (+25 TL)", price: 25 }],
              sauces: ["Ketçap", "Mayonez"]
            }
          }
        ]
      },
      {
        id: "3",
        name: "Kebapçı Celal",
        type: "yemek",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60",
        cuisine: "Kebap",
        rating: 4.9,
        duration: 20,
        fee: 25,
        minBasket: 180,
        menuItems: [
          {
            id: "item-301",
            name: "Adana Kebap Dürüm",
            description: "Zırh kıyması, sumaklı soğan, maydanoz, domates, közlenmiş biber ile dürüm lavaşında.",
            price: 170,
            category: "Dürümler",
            options: {
              sizes: [{ name: "Tek Dürüm", price: 0 }, { name: "Duble Dürüm (+80 TL)", price: 80 }],
              extras: [{ name: "Ekstra Kaşar (+20 TL)", price: 20 }],
              sauces: ["Ezme"]
            }
          }
        ]
      },
      {
        id: "5",
        name: "Sushi House",
        type: "yemek",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60",
        cuisine: "Sushi / Uzak Doğu",
        rating: 4.7,
        duration: 35,
        fee: 35,
        minBasket: 300,
        menuItems: [
          { id: "item-501", name: "Philadelphia Roll (8 Adet)", description: "Yengeç eti, krem peynir, somon kaplı roll.", price: 220, category: "Rolls" },
          { id: "item-502", name: "California Roll (8 Adet)", description: "Yengeç eti, avokado, tobiko kaplı roll.", price: 200, category: "Rolls" },
          { id: "item-503", name: "Sebzeli Noodle", description: "Taze sebzeler ve özel soslu noodle.", price: 150, category: "Sıcak Yemekler" }
        ]
      },
      {
        id: "6",
        name: "Ev Yemeği Abla",
        type: "yemek",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=60",
        cuisine: "Ev Yemeği",
        rating: 4.8,
        duration: 20,
        fee: 15,
        minBasket: 120,
        menuItems: [
          { id: "item-601", name: "Kayseri Mantısı", description: "El yapımı kıymalı Kayseri mantısı.", price: 140, category: "Ana Yemekler" },
          { id: "item-602", name: "Süzme Mercimek Çorbası", description: "Geleneksel süzme mercimek çorbası.", price: 60, category: "Çorbalar" }
        ]
      },
      {
        id: "7",
        name: "Dönerci Dayı",
        type: "yemek",
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=60",
        cuisine: "Kebap",
        rating: 4.9,
        duration: 15,
        fee: 10,
        minBasket: 100,
        menuItems: [
          { id: "item-701", name: "Tombik Et Döner", description: "100g yaprak et döner sandviç.", price: 150, category: "Dönerler" },
          { id: "item-702", name: "İskender Döner", description: "Pide üzerine yaprak et döner, tereyağı ve domates soslu.", price: 260, category: "Porsiyonlar" }
        ]
      },
      {
        id: "market-1",
        name: "HızlıSepet Market",
        type: "market",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60",
        cuisine: "Süpermarket",
        rating: 4.7,
        duration: 15,
        fee: 15,
        minBasket: 100,
        menuItems: [
          { id: "item-m1", name: "Tam Yağlı Süt (1 L)", description: "Doğal pastorize günlük tam yağlı inek sütü.", price: 35, category: "Süt & Kahvaltı" },
          { id: "item-m2", name: "Taze Yumurta (10'lu)", description: "A Sınıfı orta boy taze kümes yumurtası.", price: 55, category: "Süt & Kahvaltı" },
          { id: "item-m3", name: "Domates (1 Kg)", description: "Taze tarla domatesi.", price: 40, category: "Meyve & Sebze" },
          { id: "item-m4", name: "Yerli Muz (1 Kg)", description: "Anamur taze yerli muz.", price: 75, category: "Meyve & Sebze" },
          { id: "item-m5", name: "Patates Cipsi (Aile Boyu)", description: "Tuzlu klasik cips.", price: 45, category: "Atıştırmalık" }
        ]
      },
      {
        id: "mahalle-1",
        name: "Manav Osman",
        type: "mahalle",
        image: "https://images.unsplash.com/photo-1610397613000-f0de98a3f99c?w=600&auto=format&fit=crop&q=60",
        cuisine: "Manav",
        rating: 4.8,
        duration: 15,
        fee: 10,
        minBasket: 80,
        menuItems: [
          { id: "item-v1", name: "Taze Çilek (500g)", description: "Kokulu tatlı bahçe çileği.", price: 80, category: "Meyve" },
          { id: "item-v2", name: "Karpuz (Adet)", description: "Adana sulu tatlı karpuz.", price: 120, category: "Meyve" }
        ]
      },
      {
        id: "mahalle-2",
        name: "Kasap Emin",
        type: "mahalle",
        image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=60",
        cuisine: "Kasap & Şarküteri",
        rating: 4.9,
        duration: 25,
        fee: 30,
        minBasket: 250,
        menuItems: [
          { id: "item-k1", name: "Dana Kıyma (1 Kg)", description: "%20 yağlı yemeklik dana kıyma.", price: 480, category: "Kırmızı Et" },
          { id: "item-k2", name: "Dana Kuşbaşı (1 Kg)", description: "Tavalık az yağlı dana kuşbaşı et.", price: 520, category: "Kırmızı Et" }
        ]
      }
    ]);
    setCoupons([
      { id: "1", code: "YEMEK25", type: "percent", value: 25, minAmount: 150 },
      { id: "2", code: "NEFIS50", type: "flat", value: 50, minAmount: 200 },
      { id: "3", code: "BINA100", type: "flat", value: 100, minAmount: 350 },
      { id: "4", code: "KURYEBEDAVA", type: "free-delivery", value: 0, minAmount: 100 }
    ]);
    setAddresses([
      { id: "1", userId: "1", title: "Ev", addressText: "Moda Cd. No: 12, Caferağa, Kadıköy, İstanbul", x: 25, y: 35 },
      { id: "2", userId: "1", title: "İş", addressText: "Fahrettin Kerim Gökay Cd. No: 41, Feneryolu, Kadıköy, İstanbul", x: 75, y: 80 }
    ]);
  };

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses]);

  // Simulating Live Order Tracking Polling
  useEffect(() => {
    let trackingInterval;
    if (activeOrder && (activeOrder.status === 'Sipariş Alındı' || activeOrder.status === 'Hazırlanıyor' || activeOrder.status === 'Kurye Yolda')) {
      trackingInterval = setInterval(async () => {
        try {
          const res = await fetch(`${API_URL}/orders/${activeOrder.id}`);
          if (res.ok) {
            const updatedOrder = await res.json();
            setActiveOrder(updatedOrder);
            setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
          }
        } catch (err) {
          simulateOrderProgress();
        }
      }, 5000);
    }
    return () => clearInterval(trackingInterval);
  }, [activeOrder]);

  const simulateOrderProgress = () => {
    if (!activeOrder) return;
    const statuses = ['Sipariş Alındı', 'Hazırlanıyor', 'Kurye Yolda', 'Teslim Edildi'];
    const currIndex = statuses.indexOf(activeOrder.status);
    if (currIndex < statuses.length - 1) {
      const nextStatus = statuses[currIndex + 1];
      const updated = { ...activeOrder, status: nextStatus };
      setActiveOrder(updated);
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    }
  };

  // --- DARK MODE TOGGLE ACTION ---
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  // --- REVERSE GEOLOCATOR ---
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setMapPin({ x, y });

    if (x < 50 && y < 50) {
      setAddressText('Moda Cd. No: 12, Caferağa, Kadıköy, İstanbul');
    } else if (x >= 50 && y < 50) {
      setAddressText('Bağdat Cd. No: 232, Caddebostan, Kadıköy, İstanbul');
    } else if (x < 50 && y >= 50) {
      setAddressText('Halitağa Cd. No: 5, Hasanpaşa, Kadıköy, İstanbul');
    } else {
      setAddressText('Fahrettin Kerim Gökay Cd. No: 41, Feneryolu, Kadıköy, İstanbul');
    }
  };

  // --- AUTH ACTIONS ---
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    const mockUsers = [
      { email: 'musteri@hizlisepet.com', password: '123', name: 'Ahmet Yılmaz', role: 'customer' },
      { email: 'isletme@hizlisepet.com', password: '123', name: 'Burger Hub İşletmecisi', role: 'merchant', restaurantId: '1' },
      { email: 'admin@hizlisepet.com', password: '123', name: 'System Administrator', role: 'admin' }
    ];

    const match = mockUsers.find(u => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword);
    if (match) {
      setCurrentUser(match);
      if (match.role === 'customer') {
        setActiveView('home');
      } else {
        setActiveView('dashboard');
      }
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setAuthError('Geçersiz e-posta adresi veya şifre.');
    }
  };

  const quickSwitchRole = (role) => {
    if (role === 'customer') {
      const customerUser = { email: 'musteri@hizlisepet.com', password: '123', name: 'Ahmet Yılmaz', role: 'customer' };
      setCurrentUser(customerUser);
      if (activeOrder) {
        setActiveView('tracking');
      } else {
        setActiveView('home');
      }
    } else if (role === 'merchant') {
      const merchantUser = { email: 'isletme@hizlisepet.com', password: '123', name: 'Burger Hub İşletmecisi', role: 'merchant', restaurantId: '1' };
      setCurrentUser(merchantUser);
      setActiveView('dashboard');
    } else if (role === 'admin') {
      const adminUser = { email: 'admin@hizlisepet.com', password: '123', name: 'System Administrator', role: 'admin' };
      setCurrentUser(adminUser);
      setActiveView('dashboard');
    }
  };

  // --- REGISTRATION ACTION ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setAuthError('Lütfen tüm alanları doldurunuz.');
      return;
    }

    const userId = String(Date.now());
    let restaurantId = '';

    // If registering as a Merchant/Business, create their restaurant first
    if (regRole === 'merchant') {
      if (!regRestName.trim()) {
        setAuthError('Lütfen restoran/mağaza adını belirtiniz.');
        return;
      }
      restaurantId = `rest-${Date.now()}`;
      const newRest = {
        id: restaurantId,
        name: regRestName,
        type: 'yemek',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60',
        cuisine: regRestCuisine,
        rating: 5.0,
        duration: 25,
        fee: 0,
        minBasket: 100,
        menuItems: []
      };

      try {
        await fetch(`${API_URL}/restaurants`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRest)
        });
        setRestaurants(prev => [...prev, newRest]);
      } catch (err) {
        setRestaurants(prev => [...prev, newRest]);
      }
    }

    const newUser = {
      id: userId,
      email: regEmail,
      password: regPassword,
      role: regRole,
      name: regName,
      ...(regRole === 'merchant' && { restaurantId })
    };

    try {
      await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      setCurrentUser(newUser);
      setActiveView(regRole === 'customer' ? 'home' : 'dashboard');
    } catch (err) {
      setCurrentUser(newUser);
      setActiveView(regRole === 'customer' ? 'home' : 'dashboard');
    }

    // Reset Form
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setRegRole('customer');
    setRegRestName('');
    setIsRegisterMode(false);
  };

  const quickFill = (role) => {
    setIsRegisterMode(false);
    if (role === 'customer') {
      setLoginEmail('musteri@hizlisepet.com');
      setLoginPassword('123');
    } else if (role === 'merchant') {
      setLoginEmail('isletme@hizlisepet.com');
      setLoginPassword('123');
    } else if (role === 'admin') {
      setLoginEmail('admin@hizlisepet.com');
      setLoginPassword('123');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart({ restaurantId: null, items: [] });
    setAppliedCoupon(null);
    setActiveOrder(null);
    setActiveView('home');
  };

  // --- ADDRESS ACTIONS ---
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressText.trim()) return;

    const newAddr = {
      id: String(Date.now()),
      userId: currentUser?.id || '1',
      title: addressTitle,
      addressText: addressText,
      x: mapPin.x,
      y: mapPin.y
    };

    try {
      const res = await fetch(`${API_URL}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddr)
      });
      if (res.ok) {
        const saved = await res.json();
        setAddresses(prev => [...prev, saved]);
        setSelectedAddress(saved);
      } else {
        setAddresses(prev => [...prev, newAddr]);
        setSelectedAddress(newAddr);
      }
    } catch (err) {
      setAddresses(prev => [...prev, newAddr]);
      setSelectedAddress(newAddr);
    }
    
    setShowAddressModal(false);
    addressDialogRef.current?.close();
  };

  // --- CUSTOMIZER ACTIONS ---
  const openCustomizer = (item) => {
    if (!item.options || (!item.options.sizes?.length && !item.options.extras?.length)) {
      addDirectToCart(item);
      return;
    }

    setSelectedMenuItem(item);
    setCustomSize(item.options?.sizes?.[0]?.name || '');
    setCustomExtras([]);
    setCustomSauces([]);
    setCustomInstructions('');
    setCustomQty(1);
    
    customizeDialogRef.current?.showModal();
  };

  const addDirectToCart = (item) => {
    const cartItem = {
      uniqueId: `${item.id}-${Date.now()}`,
      id: item.id,
      name: item.name,
      basePrice: item.price,
      finalSinglePrice: item.price,
      qty: 1,
      customizations: { size: 'Standart', extras: [], sauces: [], instructions: '' }
    };

    if (cart.restaurantId && cart.restaurantId !== currentRestaurant.id) {
      setCart({ restaurantId: currentRestaurant.id, items: [cartItem] });
      setAppliedCoupon(null);
    } else {
      setCart(prev => ({ restaurantId: currentRestaurant.id, items: [...prev.items, cartItem] }));
    }
    setShowCartDrawer(true);
  };

  const handleAddCustomToCart = () => {
    if (!selectedMenuItem) return;

    const sizeObj = selectedMenuItem.options?.sizes?.find(s => s.name === customSize);
    const sizePrice = sizeObj ? sizeObj.price : 0;
    
    const extrasPrice = customExtras.reduce((sum, extName) => {
      const extObj = selectedMenuItem.options?.extras?.find(e => e.name === extName);
      return sum + (extObj ? extObj.price : 0);
    }, 0);

    const singleItemPrice = selectedMenuItem.price + sizePrice + extrasPrice;

    const cartItem = {
      uniqueId: `${selectedMenuItem.id}-${Date.now()}`,
      id: selectedMenuItem.id,
      name: selectedMenuItem.name,
      basePrice: selectedMenuItem.price,
      finalSinglePrice: singleItemPrice,
      qty: customQty,
      customizations: {
        size: customSize || 'Standart',
        extras: [...customExtras],
        sauces: [...customSauces],
        instructions: customInstructions
      }
    };

    if (cart.restaurantId && cart.restaurantId !== currentRestaurant.id) {
      setCart({ restaurantId: currentRestaurant.id, items: [cartItem] });
      setAppliedCoupon(null);
    } else {
      setCart(prev => ({ restaurantId: currentRestaurant.id, items: [...prev.items, cartItem] }));
    }

    customizeDialogRef.current?.close();
    setSelectedMenuItem(null);
    setShowCartDrawer(true);
  };

  // --- CART ACTIONS ---
  const updateCartQty = (uniqueId, amount) => {
    setCart(prev => {
      const updated = prev.items.map(item => {
        if (item.uniqueId === uniqueId) {
          const newQty = item.qty + amount;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);

      return {
        ...prev,
        items: updated,
        restaurantId: updated.length === 0 ? null : prev.restaurantId
      };
    });
  };

  const applyPromoCoupon = () => {
    setCouponError('');
    setCouponSuccess('');

    if (!couponInput.trim()) return;

    const coupon = coupons.find(c => c.code.toUpperCase() === couponInput.toUpperCase());
    if (!coupon) {
      setCouponError('Geçersiz Kupon Kodu!');
      return;
    }

    const subtotal = getCartSubtotal();
    if (subtotal < coupon.minAmount) {
      setCouponError(`Bu kupon en az ${coupon.minAmount} TL sepet tutarında geçerlidir.`);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponSuccess(`"${coupon.code}" başarıyla uygulandı!`);
  };

  const getCartSubtotal = () => {
    return cart.items.reduce((sum, item) => sum + (item.finalSinglePrice * item.qty), 0);
  };

  const getCartDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getCartSubtotal();
    
    if (appliedCoupon.type === 'percent') {
      return Math.round(subtotal * (appliedCoupon.value / 100));
    } else if (appliedCoupon.type === 'flat') {
      return appliedCoupon.value;
    }
    return 0;
  };

  const getCartDeliveryFee = () => {
    const restaurant = restaurants.find(r => r.id === cart.restaurantId);
    if (!restaurant) return 0;
    
    if (appliedCoupon?.type === 'free-delivery') {
      return 0;
    }
    return restaurant.fee;
  };

  const getCartTotal = () => {
    const sub = getCartSubtotal();
    const disc = getCartDiscount();
    const fee = getCartDeliveryFee();
    return Math.max(0, sub - disc + fee);
  };

  // --- CHECKOUT & CREDIT CARD ---
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formattedValue += ' ';
      formattedValue += value[i];
    }
    setCardNumber(formattedValue);
  };

  const handleCardExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    if (value.length > 0) {
      formattedValue = value.substring(0, 2);
      if (value.length > 2) {
        formattedValue += '/' + value.substring(2, 4);
      }
    }
    setCardExpiry(formattedValue);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'card_online' && (!cardNumber || !cardExpiry || !cardCvv || !cardHolder)) {
      alert('Lütfen kart bilgilerini eksiksiz doldurunuz.');
      return;
    }

    const restaurant = restaurants.find(r => r.id === cart.restaurantId);
    const newOrder = {
      id: String(Date.now()).substring(6),
      userId: currentUser?.id || '1',
      restaurantId: cart.restaurantId,
      restaurantName: restaurant?.name || 'Mağaza',
      items: cart.items,
      subtotal: getCartSubtotal(),
      deliveryFee: getCartDeliveryFee(),
      discount: getCartDiscount(),
      total: getCartTotal(),
      address: selectedAddress?.addressText || 'Adres seçilmedi',
      paymentMethod: paymentMethod, // 'cash_door' | 'card_door' | 'card_online'
      status: 'Sipariş Alındı',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      courierX: 10,
      courierY: 10
    };

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (res.ok) {
        const savedOrder = await res.json();
        setOrders(prev => [...prev, savedOrder]);
        setActiveOrder(savedOrder);
      } else {
        setOrders(prev => [...prev, newOrder]);
        setActiveOrder(newOrder);
      }
    } catch (err) {
      setOrders(prev => [...prev, newOrder]);
      setActiveOrder(newOrder);
    }

    setCart({ restaurantId: null, items: [] });
    setAppliedCoupon(null);
    setCouponInput('');
    setCardNumber('');
    setCardHolder('');
    setCardExpiry('');
    setCardCvv('');
    setCheckoutNote('');
    setActiveView('tracking');
  };

  // --- REORDER PAST PURCHASE ACTION ---
  const handleReorder = (pastOrder) => {
    const targetShop = restaurants.find(r => r.id === pastOrder.restaurantId);
    if (!targetShop) {
      alert('Bu dükkan/restoran artık sistemde aktif değil.');
      return;
    }

    const duplicatedItems = pastOrder.items.map(item => ({
      ...item,
      uniqueId: `${item.id}-${Date.now() + Math.random()}`
    }));

    setCart({
      restaurantId: pastOrder.restaurantId,
      items: duplicatedItems
    });
    setAppliedCoupon(null);
    setShowCartDrawer(true);
  };

  // --- ADMIN PORTAL ACTIONS (CRUD & Data Table) ---
  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    if (!newRestName.trim()) return;

    const newRest = {
      id: String(restaurants.length + 1),
      name: newRestName,
      type: newRestType,
      image: newRestImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60',
      cuisine: newRestCuisine,
      rating: 5.0,
      duration: 30,
      fee: Number(newRestFee),
      minBasket: Number(newRestMinBasket),
      menuItems: []
    };

    try {
      const res = await fetch(`${API_URL}/restaurants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRest)
      });
      if (res.ok) {
        const saved = await res.json();
        setRestaurants(prev => [...prev, saved]);
      } else {
        setRestaurants(prev => [...prev, newRest]);
      }
    } catch (err) {
      setRestaurants(prev => [...prev, newRest]);
    }

    setShowAddRestModal(false);
    addRestDialogRef.current?.close();
    setNewRestName('');
    setNewRestImage('');
    setNewRestFee(0);
    setNewRestMinBasket(150);
  };

  const handleDeleteRestaurant = async (id) => {
    if (!confirm('Bu mağazayı/restoranı silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`${API_URL}/restaurants/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRestaurants(prev => prev.filter(r => r.id !== id));
      } else {
        setRestaurants(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      setRestaurants(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newC = {
      id: String(coupons.length + 1),
      code: newCouponCode.toUpperCase(),
      type: newCouponType,
      value: Number(newCouponValue),
      minAmount: Number(newCouponMin)
    };

    try {
      const res = await fetch(`${API_URL}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newC)
      });
      if (res.ok) {
        const saved = await res.json();
        setCoupons(prev => [...prev, saved]);
      } else {
        setCoupons(prev => [...prev, newC]);
      }
    } catch (err) {
      setCoupons(prev => [...prev, newC]);
    }

    setNewCouponCode('');
    setNewCouponValue(25);
    setNewCouponMin(150);
  };

  const handleDeleteCoupon = async (id) => {
    try {
      const res = await fetch(`${API_URL}/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCoupons(prev => prev.filter(c => c.id !== id));
      } else {
        setCoupons(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      setCoupons(prev => prev.filter(c => c.id !== id));
    }
  };

  // --- MERCHANT PORTAL ACTIONS ---
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const restaurant = restaurants.find(r => r.id === currentUser.restaurantId);
    if (!restaurant) return;

    const newItem = {
      id: `item-${Date.now()}`,
      name: newItemName,
      description: newItemDesc,
      price: Number(newItemPrice),
      category: newItemCategory,
      options: {}
    };

    const updatedMenuItems = [...(restaurant.menuItems || []), newItem];
    const updatedRest = { ...restaurant, menuItems: updatedMenuItems };

    try {
      const res = await fetch(`${API_URL}/restaurants/${restaurant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRest)
      });
      if (res.ok) {
        setRestaurants(prev => prev.map(r => r.id === restaurant.id ? updatedRest : r));
      } else {
        setRestaurants(prev => prev.map(r => r.id === restaurant.id ? updatedRest : r));
      }
    } catch (err) {
      setRestaurants(prev => prev.map(r => r.id === restaurant.id ? updatedRest : r));
    }

    setShowAddItemModal(false);
    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice(150);
  };

  const handleDeleteMenuItem = async (itemId) => {
    const restaurant = restaurants.find(r => r.id === currentUser.restaurantId);
    if (!restaurant) return;

    const updatedMenuItems = restaurant.menuItems.filter(item => item.id !== itemId);
    const updatedRest = { ...restaurant, menuItems: updatedMenuItems };

    try {
      const res = await fetch(`${API_URL}/restaurants/${restaurant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRest)
      });
      if (res.ok) {
        setRestaurants(prev => prev.map(r => r.id === restaurant.id ? updatedRest : r));
      } else {
        setRestaurants(prev => prev.map(r => r.id === restaurant.id ? updatedRest : r));
      }
    } catch (err) {
      setRestaurants(prev => prev.map(r => r.id === restaurant.id ? updatedRest : r));
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    let cX = order.courierX;
    let cY = order.courierY;
    if (newStatus === 'Kurye Yolda') {
      cX = 45;
      cY = 45;
    } else if (newStatus === 'Teslim Edildi') {
      cX = 100;
      cY = 100;
    }

    const updatedOrder = { ...order, status: newStatus, courierX: cX, courierY: cY };

    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder)
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
        if (activeOrder?.id === orderId) {
          setActiveOrder(updatedOrder);
        }
      } else {
        setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
        if (activeOrder?.id === orderId) {
          setActiveOrder(updatedOrder);
        }
      }
    } catch (err) {
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      if (activeOrder?.id === orderId) {
        setActiveOrder(updatedOrder);
      }
    }
  };

  // --- FILTERS & DYNAMIC LISTING ---
  const getFilteredRestaurants = () => {
    return restaurants
      .filter(r => {
        const matchesPortal = r.type === activePortal;
        const matchesCategory = selectedCategoryTag === 'Hepsi' || r.cuisine === selectedCategoryTag;
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesPortal && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'duration') return a.duration - b.duration;
        if (sortBy === 'minBasket') return a.minBasket - b.minBasket;
        return 0;
      });
  };

  const getPortalCategoryTags = () => {
    switch (activePortal) {
      case 'yemek':
        return ['Hepsi', 'Burger', 'Pizza', 'Kebap', 'Tatlı', 'Sushi / Uzak Doğu', 'Ev Yemeği'];
      case 'market':
        return ['Hepsi', 'Süpermarket', 'Organik Ürünler'];
      case 'mahalle':
        return ['Hepsi', 'Manav', 'Fırın & Unlu Mamüller', 'Kasap & Şarküteri'];
      default:
        return ['Hepsi'];
    }
  };

  // --- ADMIN PORTAL DATA TABLE CONTROLS ---
  const handleAdminSort = (header) => {
    if (adminSortHeader === header) {
      setAdminSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setAdminSortHeader(header);
      setAdminSortDir('asc');
    }
  };

  const getSortedRestaurantsAdmin = () => {
    const filtered = restaurants.filter(r => 
      r.name.toLowerCase().includes(adminSearch.toLowerCase()) || 
      r.cuisine.toLowerCase().includes(adminSearch.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let valA = a[adminSortHeader];
      let valB = b[adminSortHeader];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return adminSortDir === 'asc' ? -1 : 1;
      if (valA > valB) return adminSortDir === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getPaginatedRestaurantsAdmin = () => {
    const sorted = getSortedRestaurantsAdmin();
    const startIndex = (adminPage - 1) * adminPageSize;
    return sorted.slice(startIndex, startIndex + adminPageSize);
  };

  // UI RENDERING UTILS
  const renderCuisineIcon = (cuisine) => {
    switch (cuisine) {
      case 'Burger': return '🍔';
      case 'Pizza': return '🍕';
      case 'Kebap': return '🍢';
      case 'Tatlı': return '🍰';
      case 'Sushi / Uzak Doğu': return '🍣';
      case 'Ev Yemeği': return '🍲';
      case 'Süpermarket': return '🛒';
      case 'Organik Ürünler': return '🍎';
      case 'Manav': return '🥦';
      case 'Fırın & Unlu Mamüller': return '🥖';
      case 'Kasap & Şarküteri': return '🥩';
      default: return '🏪';
    }
  };

  const renderPaymentMethodText = (method) => {
    switch (method) {
      case 'cash_door': return 'Kapıda Nakit';
      case 'card_door': return 'Kapıda Kredi Kartı (POS)';
      case 'card_online': return 'Online Kredi Kartı';
      default: return 'Ödeme Yöntemi';
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      
      {/* 1. Header component */}
      <Header
        currentUser={currentUser}
        activeView={activeView}
        setActiveView={setActiveView}
        selectedAddress={selectedAddress}
        addressDialogRef={addressDialogRef}
        setShowAddressModal={setShowAddressModal}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        showRoleDropdown={showRoleDropdown}
        setShowRoleDropdown={setShowRoleDropdown}
        quickSwitchRole={quickSwitchRole}
        cart={cart}
        setShowCartDrawer={setShowCartDrawer}
        handleLogout={handleLogout}
        setIsRegisterMode={setIsRegisterMode}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-grow-1 container-fluid py-4 px-md-5 px-3">
        
        {/* VIEW 1: AUTHENTICATION (Login / Sign Up) */}
        {activeView === 'login' && (
          <LoginView
            isRegisterMode={isRegisterMode}
            setIsRegisterMode={setIsRegisterMode}
            loginEmail={loginEmail}
            setLoginEmail={setLoginEmail}
            loginPassword={loginPassword}
            setLoginPassword={setLoginPassword}
            authError={authError}
            setAuthError={setAuthError}
            handleLogin={handleLogin}
            handleRegister={handleRegister}
            regName={regName}
            setRegName={setRegName}
            regEmail={regEmail}
            setRegEmail={setRegEmail}
            regPassword={regPassword}
            setRegPassword={setRegPassword}
            regRole={regRole}
            setRegRole={setRegRole}
            regRestName={regRestName}
            setRegRestName={setRegRestName}
            regRestCuisine={regRestCuisine}
            setRegRestCuisine={setRegRestCuisine}
            quickFill={quickFill}
          />
        )}

        {/* VIEW 2: CUSTOMER VIEW (Home / Menu) */}
        {((!currentUser || currentUser.role === 'customer') && (activeView === 'home' || activeView === 'menu')) && (
          <CustomerView
            activeView={activeView}
            setActiveView={setActiveView}
            activePortal={activePortal}
            setActivePortal={setActivePortal}
            selectedCategoryTag={selectedCategoryTag}
            setSelectedCategoryTag={setSelectedCategoryTag}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            currentRestaurant={currentRestaurant}
            setCurrentRestaurant={setCurrentRestaurant}
            getFilteredRestaurants={getFilteredRestaurants}
            getPortalCategoryTags={getPortalCategoryTags}
            renderCuisineIcon={renderCuisineIcon}
            openCustomizer={openCustomizer}
            setCouponInput={setCouponInput}
            applyPromoCoupon={applyPromoCoupon}
            setShowCartDrawer={setShowCartDrawer}
          />
        )}

        {/* VIEW 3: CHECKOUT */}
        {(activeView === 'checkout') && (
          <CheckoutView
            setActiveView={setActiveView}
            setShowCartDrawer={setShowCartDrawer}
            addresses={addresses}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            addressDialogRef={addressDialogRef}
            setShowAddressModal={setShowAddressModal}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            isCardFlipped={isCardFlipped}
            setIsCardFlipped={setIsCardFlipped}
            cardNumber={cardNumber}
            handleCardNumberChange={handleCardNumberChange}
            cardHolder={cardHolder}
            setCardHolder={setCardHolder}
            cardExpiry={cardExpiry}
            handleCardExpiryChange={handleCardExpiryChange}
            cardCvv={cardCvv}
            setCardCvv={setCardCvv}
            checkoutNote={checkoutNote}
            setCheckoutNote={setCheckoutNote}
            handleCheckoutSubmit={handleCheckoutSubmit}
            cart={cart}
            getCartSubtotal={getCartSubtotal}
            appliedCoupon={appliedCoupon}
            getCartDiscount={getCartDiscount}
            getCartDeliveryFee={getCartDeliveryFee}
            getCartTotal={getCartTotal}
          />
        )}

        {/* VIEW 4: ACTIVE TRACKING MAP */}
        {(activeView === 'tracking') && (
          <TrackingView
            setActiveView={setActiveView}
            activeOrder={activeOrder}
            selectedAddress={selectedAddress}
            renderPaymentMethodText={renderPaymentMethodText}
          />
        )}

        {/* VIEW 5: PAST ORDER HISTORY */}
        {(activeView === 'orders') && (
          <OrdersHistoryView
            setActiveView={setActiveView}
            orders={orders}
            currentUser={currentUser}
            setActiveOrder={setActiveOrder}
            handleReorder={handleReorder}
            renderPaymentMethodText={renderPaymentMethodText}
          />
        )}

        {/* VIEW 6: MERCHANT DASHBOARD */}
        {(currentUser?.role === 'merchant' && activeView === 'dashboard') && (
          <MerchantDashboard
            currentUser={currentUser}
            orders={orders}
            restaurants={restaurants}
            setShowAddItemModal={setShowAddItemModal}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            handleDeleteMenuItem={handleDeleteMenuItem}
            renderPaymentMethodText={renderPaymentMethodText}
          />
        )}

        {/* VIEW 7: ADMIN DASHBOARD */}
        {(currentUser?.role === 'admin' && activeView === 'dashboard') && (
          <AdminDashboard
            orders={orders}
            restaurants={restaurants}
            coupons={coupons}
            adminSearch={adminSearch}
            setAdminSearch={setAdminSearch}
            adminPage={adminPage}
            setAdminPage={setAdminPage}
            adminPageSize={adminPageSize}
            adminSortHeader={adminSortHeader}
            adminSortDir={adminSortDir}
            handleAdminSort={handleAdminSort}
            getPaginatedRestaurantsAdmin={getPaginatedRestaurantsAdmin}
            getSortedRestaurantsAdmin={getSortedRestaurantsAdmin}
            handleDeleteRestaurant={handleDeleteRestaurant}
            setShowAddRestModal={setShowAddRestModal}
            addRestDialogRef={addRestDialogRef}
            newCouponCode={newCouponCode}
            setNewCouponCode={setNewCouponCode}
            newCouponType={newCouponType}
            setNewCouponType={setNewCouponType}
            newCouponValue={newCouponValue}
            setNewCouponValue={setNewCouponValue}
            newCouponMin={newCouponMin}
            setNewCouponMin={setNewCouponMin}
            handleAddCoupon={handleAddCoupon}
            handleDeleteCoupon={handleDeleteCoupon}
            renderPaymentMethodText={renderPaymentMethodText}
          />
        )}

      </div>

      {/* 2. Footer Component */}
      <Footer />

      {/* --- MODAL DIALOGS --- */}

      {/* ITEM CUSTOMIZER DIALOG */}
      <ItemCustomizerModal
        customizeDialogRef={customizeDialogRef}
        selectedMenuItem={selectedMenuItem}
        customSize={customSize}
        setCustomSize={setCustomSize}
        customExtras={customExtras}
        setCustomExtras={setCustomExtras}
        customSauces={customSauces}
        setCustomSauces={setCustomSauces}
        customInstructions={customInstructions}
        setCustomInstructions={setCustomInstructions}
        customQty={customQty}
        setCustomQty={setCustomQty}
        handleAddCustomToCart={handleAddCustomToCart}
      />

      {/* SAVED ADDRESS & MAP SELECTOR MODAL */}
      <dialog ref={addressDialogRef} className="col-lg-5 col-md-7 col-11" style={{ background: '#FFF', borderRadius: '16px', border: '0', boxShadow: '0 10px 50px rgba(0,0,0,0.15)' }} closedby="any">
        {showAddressModal && (
          <div>
            <div className="modal-header p-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="modal-title fw-bold text-dark"><i className="bi bi-geo-alt-fill text-hz-primary"></i> Adres / Konum Belirle</h5>
              <button type="button" className="btn-close" onClick={() => addressDialogRef.current?.close()}></button>
            </div>
            <div className="modal-body p-3 text-dark">
              <p className="text-secondary small mb-3">Harita üzerinde teslimat konumunuzu tıklayarak işaretleyin:</p>
              
              <div className="svg-map-container mb-3" onClick={handleMapClick} style={{ cursor: 'crosshair' }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="0" y1="20" x2="100" y2="20" className="map-road" strokeWidth="3" />
                  <line x1="0" y1="50" x2="100" y2="50" className="map-road" strokeWidth="3" />
                  <line x1="0" y1="80" x2="100" y2="80" className="map-road" strokeWidth="3" />
                  
                  <line x1="25" y1="0" x2="25" y2="100" className="map-road" strokeWidth="3" />
                  <line x1="60" y1="0" x2="60" y2="100" className="map-road" strokeWidth="3" />
                  
                  <rect x="5" y="60" width="15" height="30" className="map-park" />
                  <rect x="70" y="10" width="20" height="20" className="map-park" />
                  
                  <rect x="35" y="30" width="12" height="12" className="map-building" />
                  <rect x="75" y="60" width="15" height="15" className="map-building" />

                  <g>
                    <circle cx={mapPin.x} cy={mapPin.y} r="5" fill="#F0144C" className="pulsating-pin" />
                    <circle cx={mapPin.x} cy={mapPin.y} r="2" fill="#FFFFFF" />
                  </g>
                </svg>
              </div>

              <form onSubmit={handleSaveAddress}>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Konum Koordinatları</label>
                  <input type="text" className="form-control form-control-sm bg-light" value={`X: ${mapPin.x}%, Y: ${mapPin.y}%`} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Adres Açıklaması</label>
                  <textarea className="form-control" rows="2.5" value={addressText} onChange={(e) => setAddressText(e.target.value)} required placeholder="Sokak, Bina No, Daire No belirtiniz..."></textarea>
                </div>
                <div className="mb-4">
                  <label className="form-label text-secondary small fw-bold">Adres Başlığı</label>
                  <div className="d-flex gap-2">
                    {['Ev', 'İş', 'Diğer'].map((t) => (
                      <button key={t} type="button" className={`btn btn-sm ${addressTitle === t ? 'btn-hz-primary text-white' : 'btn-light border'}`} onClick={() => setAddressTitle(t)}>{t}</button>
                    ))}
                  </div>
                </div>
                
                <button type="submit" className="btn btn-hz-primary w-100 py-2 rounded-3 fw-bold text-white">Adresi Kaydet</button>
              </form>
            </div>
          </div>
        )}
      </dialog>

      {/* ADMIN ADD NEW RESTAURANT MODAL */}
      <dialog ref={addRestDialogRef} className="col-lg-4 col-md-6 col-10" style={{ background: '#FFF', borderRadius: '16px', border: '0', boxShadow: '0 10px 50px rgba(0,0,0,0.15)' }} closedby="any">
        {showAddRestModal && (
          <div>
            <div className="modal-header p-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="modal-title fw-bold text-dark">Yeni İşletme Ekle</h5>
              <button type="button" className="btn-close" onClick={() => addRestDialogRef.current?.close()}></button>
            </div>
            <div className="modal-body p-3 text-dark">
              <form onSubmit={handleAddRestaurant}>
                <div className="mb-3">
                  <label className="form-label small text-secondary fw-bold">İşletme İsmi</label>
                  <input type="text" className="form-control" value={newRestName} onChange={(e) => setNewRestName(e.target.value)} required placeholder="Örn: Market Express" />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-secondary fw-bold">Resim Görsel Bağlantısı (URL)</label>
                  <input type="url" className="form-control" value={newRestImage} onChange={(e) => setNewRestImage(e.target.value)} placeholder="https://images.unsplash.com/..." />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-secondary fw-bold">Portal Türü</label>
                  <select className="form-select" value={newRestType} onChange={(e) => setNewRestType(e.target.value)}>
                    <option value="yemek">Yemek (Restoran)</option>
                    <option value="market">Market (Süpermarket)</option>
                    <option value="mahalle">Mahalle (Yerel Dükkan)</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-secondary fw-bold">Alt Kategori / Mutfak</label>
                  <input type="text" className="form-control" value={newRestCuisine} onChange={(e) => setNewRestCuisine(e.target.value)} required placeholder="Örn: Burger, Manav, Şarküteri" />
                </div>
                <div className="row mb-4">
                  <div className="col-6">
                    <label className="form-label small text-secondary fw-bold">Min. Sepet Tutarı (TL)</label>
                    <input type="number" className="form-control" value={newRestMinBasket} onChange={(e) => setNewRestMinBasket(e.target.value)} required />
                  </div>
                  <div className="col-6">
                    <label className="form-label small text-secondary fw-bold">Kurye Ücreti (TL)</label>
                    <input type="number" className="form-control" value={newRestFee} onChange={(e) => setNewRestFee(e.target.value)} required />
                  </div>
                </div>
                
                <button type="submit" className="btn btn-hz-primary w-100 py-2.5 rounded-3 fw-bold text-white">İşletme Ekle</button>
              </form>
            </div>
          </div>
        )}
      </dialog>

      {/* MERCHANT ADD MENU ITEM MODAL */}
      {showAddItemModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header p-3 border-bottom">
                <h5 className="modal-title fw-bold text-dark">Yeni Ürün Ekle</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddItemModal(false)}></button>
              </div>
              <div className="modal-body p-3 text-dark">
                <form onSubmit={handleAddMenuItem}>
                  <div className="mb-3">
                    <label className="form-label small text-secondary fw-bold">Ürün İsmi</label>
                    <input type="text" className="form-control" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} required placeholder="Örn: Organik Çilek" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-secondary fw-bold">Ürün Açıklaması</label>
                    <textarea className="form-control" rows="2" value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)} required placeholder="Ürün özelliklerini yazın..." />
                  </div>
                  <div className="row mb-4">
                    <div className="col-6">
                      <label className="form-label small text-secondary fw-bold">Fiyat (TL)</label>
                      <input type="number" className="form-control" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} required />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-secondary fw-bold">Kategori</label>
                      <input type="text" className="form-control" value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)} required placeholder="Meyveler, Atıştırmalıklar vb." />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-hz-primary w-100 py-2.5 rounded-3 fw-bold text-white">Ürünü Ekle</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CART SLIDING DRAWER & BACKDROP */}
      <CartDrawer
        showCartDrawer={showCartDrawer}
        setShowCartDrawer={setShowCartDrawer}
        cart={cart}
        updateCartQty={updateCartQty}
        couponInput={couponInput}
        setCouponInput={setCouponInput}
        applyPromoCoupon={applyPromoCoupon}
        couponError={couponError}
        couponSuccess={couponSuccess}
        getCartSubtotal={getCartSubtotal}
        appliedCoupon={appliedCoupon}
        getCartDiscount={getCartDiscount}
        getCartDeliveryFee={getCartDeliveryFee}
        getCartTotal={getCartTotal}
        restaurants={restaurants}
        setActiveView={setActiveView}
      />

    </div>
  );
}
