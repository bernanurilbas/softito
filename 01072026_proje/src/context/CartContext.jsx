import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Sepet State
  const [cart, setCart] = useState(() => {
    const localData = localStorage.getItem('elegant_cart');
    return localData ? JSON.parse(localData) : [];
  });

  // Kupon State
  const [couponCode, setCouponCode] = useState(() => {
    return localStorage.getItem('elegant_coupon_code') || '';
  });

  // Kullanıcı/Giriş State
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem('elegant_current_user');
    return localUser ? JSON.parse(localUser) : null;
  });

  // Bildirim State
  const [toastMessage, setToastMessage] = useState('');

  // LocalStorage Senkronizasyonları
  useEffect(() => {
    localStorage.setItem('elegant_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (couponCode) {
      localStorage.setItem('elegant_coupon_code', couponCode);
    } else {
      localStorage.removeItem('elegant_coupon_code');
    }
  }, [couponCode]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('elegant_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('elegant_current_user');
    }
  }, [user]);

  // Sayfa yüklendiğinde demo kullanıcı ekleme (test kolaylığı için)
  useEffect(() => {
    const registered = localStorage.getItem('elegant_registered_users');
    if (!registered) {
      const defaultUsers = [
        { firstname: 'Demo', lastname: 'Kullanıcı', email: 'demo@demo.com', password: 'password123' }
      ];
      localStorage.setItem('elegant_registered_users', JSON.stringify(defaultUsers));
    }
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
  };

  const clearToast = () => {
    setToastMessage('');
  };

  // Sepet Fonksiyonları
  const addToCart = (product, qty = 1, size = 'Standart', color = 'Standart') => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size && item.color === color
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].qty += qty;
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            img: product.img || product.image,
            qty,
            size,
            color,
          },
        ];
      }
    });
    showToast(`${product.name} sepete eklendi!`);
  };

  const removeFromCart = (id, size, color) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === id && item.size === size && item.color === color))
    );
  };

  const updateCartQty = (id, size, color, qty) => {
    if (qty <= 0) {
      removeFromCart(id, size, color);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, qty: parseInt(qty) }
          : item
      )
    );
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  };

  const getAutomaticDiscount = () => {
    const subtotal = getCartSubtotal();
    return subtotal >= 2000 ? 150.00 : 0.00;
  };

  const getCouponDiscount = () => {
    const subtotal = getCartSubtotal();
    if (!couponCode) return 0;

    switch (couponCode) {
      case 'INDIRIM10':
        return subtotal * 0.10;
      case 'KETEN20':
        return subtotal * 0.20;
      case 'VIP200':
        return subtotal >= 1000 ? 200.00 : 0.00;
      case 'BELESKARGO':
        return 0;
      default:
        return 0;
    }
  };

  const getShippingCost = () => {
    const subtotal = getCartSubtotal();
    if (subtotal === 0) return 0;
    if (subtotal >= 1500 || couponCode === 'BELESKARGO') return 0;
    return 79.90;
  };

  const getGrandTotal = () => {
    const subtotal = getCartSubtotal();
    const shipping = getShippingCost();
    const couponDiscount = getCouponDiscount();
    const autoDiscount = getAutomaticDiscount();
    const total = subtotal + shipping - couponDiscount - autoDiscount;
    return total < 0 ? 0 : total;
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.qty, 0);
  };

  const applyCoupon = (code) => {
    const formattedCode = code.trim().toUpperCase();
    const subtotal = getCartSubtotal();

    if (formattedCode === '') {
      setCouponCode('');
      return { success: true, message: '' };
    }

    const validCoupons = ['INDIRIM10', 'KETEN20', 'VIP200', 'BELESKARGO'];
    if (!validCoupons.includes(formattedCode)) {
      return { success: false, message: 'Geçersiz kupon kodu!' };
    }

    if (formattedCode === 'VIP200' && subtotal < 1000) {
      return { success: false, message: 'VIP200 kuponu için sepet tutarı en az 1000 ₺ olmalıdır!' };
    }

    setCouponCode(formattedCode);

    let successMessage = '';
    if (formattedCode === 'INDIRIM10') successMessage = '%10 indirim kuponu uygulandı!';
    if (formattedCode === 'KETEN20') successMessage = '%20 özel sezon indirim kuponu uygulandı!';
    if (formattedCode === 'VIP200') successMessage = '200 ₺ VIP sepet indirimi uygulandı!';
    if (formattedCode === 'BELESKARGO') successMessage = 'Ücretsiz kargo kuponu uygulandı!';

    return { success: true, message: successMessage };
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
  };

  // --- Auth Fonksiyonları ---

  // Kayıt Olma
  const registerUser = (userData) => {
    const registered = localStorage.getItem('elegant_registered_users');
    const users = registered ? JSON.parse(registered) : [];

    // E-posta adresi önceden kullanılmış mı kontrolü
    const exists = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) {
      return { success: false, message: 'Bu e-posta adresi ile zaten kayıt olunmuş!' };
    }

    users.push(userData);
    localStorage.setItem('elegant_registered_users', JSON.stringify(users));
    showToast('Kayıt işlemi başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
    return { success: true };
  };

  // Giriş Yapma
  const loginUser = (email, password) => {
    const registered = localStorage.getItem('elegant_registered_users');
    const users = registered ? JSON.parse(registered) : [];

    const matched = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (matched) {
      const sessionUser = {
        firstname: matched.firstname,
        lastname: matched.lastname,
        email: matched.email
      };
      setUser(sessionUser);
      showToast(`Hoş geldiniz, ${matched.firstname}!`);
      return { success: true };
    } else {
      return { success: false, message: 'E-posta veya şifre hatalı!' };
    }
  };

  // Çıkış Yapma
  const logoutUser = () => {
    setUser(null);
    showToast('Başarıyla çıkış yapıldı.');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        couponCode,
        user,
        toastMessage,
        addToCart,
        removeFromCart,
        updateCartQty,
        getCartSubtotal,
        getAutomaticDiscount,
        getCouponDiscount,
        getShippingCost,
        getGrandTotal,
        getCartItemCount,
        applyCoupon,
        clearCart,
        showToast,
        clearToast,
        registerUser,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
