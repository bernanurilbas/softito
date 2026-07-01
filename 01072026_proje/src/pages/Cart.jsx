import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Cart() {
  const { 
    cart, 
    updateCartQty, 
    removeFromCart, 
    getCartSubtotal, 
    getAutomaticDiscount,
    getCouponDiscount,
    getShippingCost,
    getGrandTotal,
    couponCode, 
    applyCoupon 
  } = useContext(CartContext);

  const [couponInput, setCouponInput] = useState(couponCode);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleApplyCoupon = (codeToApply = couponInput) => {
    const finalCode = codeToApply === undefined ? couponInput : codeToApply;
    const result = applyCoupon(finalCode);
    if (result.success) {
      setFeedback({ 
        type: 'success', 
        message: result.message 
      });
      if (codeToApply !== undefined) {
        setCouponInput(codeToApply);
      }
    } else {
      setFeedback({ type: 'danger', message: result.message });
    }
  };

  const handleRemoveCoupon = () => {
    applyCoupon('');
    setCouponInput('');
    setFeedback({ type: 'success', message: 'Kupon kodu kaldırıldı.' });
  };

  const subtotal = getCartSubtotal();
  const shipping = getShippingCost();
  const autoDiscount = getAutomaticDiscount();
  const couponDiscount = getCouponDiscount();
  const total = getGrandTotal();

  // Coupon Suggestions array
  const suggestions = [
    { code: 'INDIRIM10', desc: '%10 Genel İndirim' },
    { code: 'KETEN20', desc: '%20 Sezon İndirimi' },
    { code: 'VIP200', desc: '1000 ₺ üzeri 200 ₺ İndirim' },
    { code: 'BELESKARGO', desc: 'Bedava Kargo' }
  ];

  if (cart.length === 0) {
    return (
      <main className="py-5" id="main-cart-page">
        <div className="container text-center py-5">
          <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }}></i>
          <h3 className="mt-3">Sepetiniz Boş</h3>
          <p className="text-muted">Görünüşe göre henüz sepetinize bir ürün eklemediniz.</p>
          <Link to="/catalog" className="btn btn-khaki mt-2" id="btn-cart-empty-shop">Alışverişe Başla</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="py-5" id="main-cart-page">
      <div className="container">
        <h2 className="font-title fw-bold text-khaki-dark mb-4">Alışveriş Sepeti</h2>
        
        <div className="row g-4 text-start">
          {/* Sepetteki Ürünler Tablosu (Sol Bölüm) */}
          <div className="col-lg-8" id="cart-items-container">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th scope="col">Ürün</th>
                    <th scope="col">Fiyat</th>
                    <th scope="col" style={{ width: '150px' }}>Adet</th>
                    <th scope="col">Toplam</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => {
                    const itemTotal = (item.price * item.qty).toFixed(2);
                    return (
                      <tr key={`${item.id}-${item.size}-${item.color}`}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img src={item.img} alt={item.name} className="rounded me-3" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                            <div>
                              <h6 className="mb-0 font-title">{item.name}</h6>
                              <small className="text-muted">Renk: {item.color} | Beden: {item.size}</small>
                            </div>
                          </div>
                        </td>
                        <td>₺{item.price.toFixed(2)}</td>
                        <td>
                          <div className="input-group input-group-sm">
                            <button 
                              className="btn btn-outline-secondary" 
                              type="button" 
                              id={`btn-qty-dec-${index}`} 
                              onClick={() => updateCartQty(item.id, item.size, item.color, item.qty - 1)}
                            >
                              -
                            </button>
                            <input type="text" className="form-control text-center" value={item.qty} readOnly id={`input-qty-val-${index}`} />
                            <button 
                              className="btn btn-outline-secondary" 
                              type="button" 
                              id={`btn-qty-inc-${index}`} 
                              onClick={() => updateCartQty(item.id, item.size, item.color, item.qty + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="fw-semibold">₺{itemTotal}</td>
                        <td>
                          <button 
                            className="btn btn-link text-danger p-0" 
                            id={`btn-remove-${index}`} 
                            onClick={() => removeFromCart(item.id, item.size, item.color)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Automatic Discount Info Box if applicable */}
            {subtotal < 2000 ? (
              <div className="alert alert-light border mt-3 small text-muted d-flex align-items-center gap-2" id="alert-auto-discount-info">
                <i className="bi bi-info-circle text-khaki"></i>
                <span>Sepet tutarınızı <strong>₺2,000.00</strong> üzerine çıkarın, anında <strong>₺150.00 otomatik sepet indirimi</strong> kazanın! (Kalan tutar: <strong>₺{(2000 - subtotal).toFixed(2)}</strong>)</span>
              </div>
            ) : (
              <div className="alert alert-success border-success-subtle mt-3 small d-flex align-items-center gap-2" id="alert-auto-discount-success">
                <i className="bi bi-check-circle-fill text-success"></i>
                <span>Tebrikler! Sepetiniz 2,000 ₺ üzerinde olduğu için <strong>₺150.00 otomatik VIP sepet indirimi</strong> uygulandı.</span>
              </div>
            )}
          </div>
          
          {/* Sipariş Özeti Kartı (Sağ Bölüm) */}
          <div className="col-lg-4" id="cart-summary-container">
            <div className="card border-0 glass-card p-4">
              <h5 className="card-title mb-4 font-title">Sipariş Özeti</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Ara Toplam</span>
                <span>₺{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Kargo Ücreti</span>
                <span>{shipping === 0 ? <span className="text-success fw-semibold">Ücretsiz</span> : `₺${shipping.toFixed(2)}`}</span>
              </div>
              {autoDiscount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success fw-semibold">
                  <span>Otomatik Sepet İndirimi</span>
                  <span>-₺{autoDiscount.toFixed(2)}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success fw-semibold">
                  <span>Kupon İndirimi ({couponCode})</span>
                  <span>-₺{couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between mb-4 fw-bold fs-5 text-khaki-dark">
                <span>Toplam</span>
                <span>₺{total.toFixed(2)}</span>
              </div>
              
              {/* Kupon Kodu Girişi */}
              <div className="input-group mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Kupon Kodu" 
                  id="input-coupon-code" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                {couponCode ? (
                  <button className="btn btn-outline-danger" type="button" id="btn-remove-coupon" onClick={handleRemoveCoupon}>Kaldır</button>
                ) : (
                  <button className="btn btn-outline-khaki" type="button" id="btn-apply-coupon" onClick={() => handleApplyCoupon()}>Uygula</button>
                )}
              </div>
              
              {feedback.message && (
                <div id="coupon-feedback" className={`small mb-3 text-${feedback.type}`}>
                  {feedback.message}
                </div>
              )}

              {/* Kupon Önerileri */}
              <div className="mb-4" id="coupon-suggestions-box">
                <div className="small text-muted mb-2 fw-semibold">Kupon Önerileri:</div>
                <div className="d-flex flex-wrap gap-1">
                  {suggestions.map((sug) => (
                    <button
                      key={sug.code}
                      type="button"
                      className="btn btn-light btn-sm border text-start px-2 py-1 flex-grow-1"
                      style={{ fontSize: '0.75rem', backgroundColor: '#fcfbfa' }}
                      id={`btn-suggest-coupon-${sug.code.toLowerCase()}`}
                      onClick={() => handleApplyCoupon(sug.code)}
                    >
                      <strong className="text-khaki">{sug.code}</strong> - {sug.desc}
                    </button>
                  ))}
                </div>
              </div>

              <Link to="/checkout" className="btn btn-khaki w-100 py-2" id="btn-proceed-checkout">
                Ödemeye Geç <i className="bi bi-arrow-right ms-2"></i>
              </Link>
              <Link to="/catalog" className="btn btn-link text-center w-100 mt-2 small text-decoration-none text-muted" id="btn-cart-continue-shop">
                <i className="bi bi-chevron-left me-1"></i> Alışverişe Devam Et
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
