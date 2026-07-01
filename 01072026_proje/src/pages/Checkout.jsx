import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Checkout() {
  const { 
    cart, 
    getCartSubtotal, 
    getAutomaticDiscount, 
    getCouponDiscount, 
    getShippingCost, 
    couponCode,
    clearCart 
  } = useContext(CartContext);
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    shippingMethod: 'standard',
    paymentMethod: 'card',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    agreeTerms: false
  });

  const [validated, setValidated] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (cart.length === 0 && !showSuccessModal) {
      navigate('/cart');
    }
  }, [cart, navigate, showSuccessModal]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      clearCart();
      setShowSuccessModal(true);
    }
    setValidated(true);
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  const subtotal = getCartSubtotal();
  const baseShipping = getShippingCost();
  // Express kargo farkı: Eğer normal kargo ücretsizse express +70₺, kargo ücretliyse express 149.90₺ (standard kargo 79.90₺)
  const shipping = baseShipping === 0 
    ? (formData.shippingMethod === 'express' ? 70.00 : 0)
    : (formData.shippingMethod === 'express' ? 149.90 : 79.90);
  
  const autoDiscount = getAutomaticDiscount();
  const couponDiscount = getCouponDiscount();
  const total = subtotal + shipping - couponDiscount - autoDiscount;

  return (
    <main className="py-5" id="main-checkout-page">
      <div className="container text-start">
        <h2 className="font-title fw-bold text-khaki-dark mb-4">Ödeme Adımı</h2>
        
        <form id="form-checkout" className={`needs-validation ${validated ? 'was-validated' : ''}`} noValidate onSubmit={handleFormSubmit}>
          <div className="row g-5">
            
            {/* Sol Bölüm: Fatura & Kargo Formları */}
            <div className="col-lg-7">
              <div className="card border-0 glass-card p-4 p-md-5">
                
                {/* 1. Teslimat Adresi */}
                <h4 className="font-title fw-bold text-khaki-dark mb-4">1. Teslimat & Fatura Bilgileri</h4>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label htmlFor="input-firstname" className="form-label fw-semibold text-khaki-dark small">Ad</label>
                    <input 
                      type="text" 
                      className="form-control form-control-custom" 
                      id="input-firstname" 
                      required 
                      placeholder="Adınız"
                      value={formData.firstname}
                      onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    />
                    <div className="invalid-feedback">Lütfen adınızı giriniz.</div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="input-lastname" className="form-label fw-semibold text-khaki-dark small">Soyad</label>
                    <input 
                      type="text" 
                      className="form-control form-control-custom" 
                      id="input-lastname" 
                      required 
                      placeholder="Soyadınız"
                      value={formData.lastname}
                      onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    />
                    <div className="invalid-feedback">Lütfen soyadınızı giriniz.</div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="input-email" className="form-label fw-semibold text-khaki-dark small">E-Posta</label>
                    <input 
                      type="email" 
                      className="form-control form-control-custom" 
                      id="input-email" 
                      required 
                      placeholder="eposta@adresiniz.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <div className="invalid-feedback">Lütfen geçerli bir e-posta adresi giriniz.</div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="input-phone" className="form-label fw-semibold text-khaki-dark small">Telefon</label>
                    <input 
                      type="tel" 
                      className="form-control form-control-custom" 
                      id="input-phone" 
                      required 
                      placeholder="0 (555) 555 55 55"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <div className="invalid-feedback">Lütfen telefon numaranızı giriniz.</div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="input-address" className="form-label fw-semibold text-khaki-dark small">Adres</label>
                    <textarea 
                      className="form-control form-control-custom" 
                      id="input-address" 
                      rows="3" 
                      required 
                      placeholder="Mahalle, sokak, daire no vb."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    ></textarea>
                    <div className="invalid-feedback">Lütfen açık adresinizi giriniz.</div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="input-city" className="form-label fw-semibold text-khaki-dark small">Şehir</label>
                    <input 
                      type="text" 
                      className="form-control form-control-custom" 
                      id="input-city" 
                      required 
                      placeholder="İstanbul"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                    <div className="invalid-feedback">Lütfen şehir giriniz.</div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="input-zip" className="form-label fw-semibold text-khaki-dark small">Posta Kodu</label>
                    <input 
                      type="text" 
                      className="form-control form-control-custom" 
                      id="input-zip" 
                      required 
                      placeholder="34000"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    />
                    <div className="invalid-feedback">Lütfen posta kodunu giriniz.</div>
                  </div>
                </div>
                
                <hr className="my-4" />
                
                {/* 2. Kargo Seçenekleri */}
                <h4 className="font-title fw-bold text-khaki-dark mb-3">2. Teslimat Yöntemi</h4>
                <div className="mb-4">
                  <div className="form-check p-3 rounded border mb-2 bg-linen d-flex justify-content-between align-items-center">
                    <div>
                      <input 
                        className="form-check-input ms-0 me-2" 
                        type="radio" 
                        name="radio-shipping" 
                        id="radio-shipping-standard" 
                        checked={formData.shippingMethod === 'standard'}
                        value="standard"
                        onChange={() => setFormData({ ...formData, shippingMethod: 'standard' })}
                      />
                      <label className="form-check-label fw-semibold small text-khaki-dark" htmlFor="radio-shipping-standard">
                        Standart Eko Kargo
                      </label>
                      <div className="text-muted small ms-4">3-5 İş Gününde Teslimat</div>
                    </div>
                    <span className="fw-bold small text-khaki">
                      {baseShipping === 0 ? 'Ücretsiz' : '₺79.90'}
                    </span>
                  </div>
                  <div className="form-check p-3 rounded border bg-white d-flex justify-content-between align-items-center">
                    <div>
                      <input 
                        className="form-check-input ms-0 me-2" 
                        type="radio" 
                        name="radio-shipping" 
                        id="radio-shipping-express"
                        checked={formData.shippingMethod === 'express'}
                        value="express"
                        onChange={() => setFormData({ ...formData, shippingMethod: 'express' })}
                      />
                      <label className="form-check-label fw-semibold small text-khaki-dark" htmlFor="radio-shipping-express">
                        Hızlı Express Kargo
                      </label>
                      <div className="text-muted small ms-4">1-2 İş Gününde Teslimat</div>
                    </div>
                    <span className="fw-bold small text-khaki">
                      {baseShipping === 0 ? '₺70.00' : '₺149.90'}
                    </span>
                  </div>
                </div>

                <hr className="my-4" />
                
                {/* 3. Ödeme Seçenekleri Accordion Simülasyonu */}
                <h4 className="font-title fw-bold text-khaki-dark mb-3">3. Ödeme Bilgileri</h4>
                <div className="accordion mb-4" id="paymentAccordion">
                  
                  {/* Kredi Kartı Seçeneği */}
                  <div className="accordion-item border-0 glass-card mb-2 overflow-hidden">
                    <h2 className="accordion-header">
                      <button 
                        className={`accordion-button ${formData.paymentMethod === 'card' ? '' : 'collapsed'} bg-linen text-khaki-dark fw-semibold`} 
                        type="button" 
                        onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                        id="btn-accordion-card"
                      >
                        <i className="bi bi-credit-card me-2"></i> Kredi veya Banka Kartı
                      </button>
                    </h2>
                    {formData.paymentMethod === 'card' && (
                      <div className="accordion-collapse collapse show">
                        <div className="accordion-body bg-white p-4">
                          <div className="row g-3">
                            <div className="col-12">
                              <label htmlFor="input-card-name" className="form-label small fw-semibold text-khaki-dark">Kart Üzerindeki İsim</label>
                              <input 
                                type="text" 
                                className="form-control form-control-custom" 
                                id="input-card-name" 
                                required={formData.paymentMethod === 'card'} 
                                placeholder="Ahmet Yılmaz"
                                value={formData.cardName}
                                onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                              />
                              <div className="invalid-feedback">Lütfen kart sahibinin adını giriniz.</div>
                            </div>
                            <div className="col-12">
                              <label htmlFor="input-card-number" className="form-label small fw-semibold text-khaki-dark">Kart Numarası</label>
                              <input 
                                type="text" 
                                className="form-control form-control-custom" 
                                id="input-card-number" 
                                required={formData.paymentMethod === 'card'} 
                                placeholder="0000 0000 0000 0000" 
                                maxLength="19"
                                value={formData.cardNumber}
                                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                              />
                              <div className="invalid-feedback">Lütfen kart numaranızı giriniz.</div>
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="input-card-expiry" className="form-label small fw-semibold text-khaki-dark">Son Kullanma Tarihi</label>
                              <input 
                                type="text" 
                                className="form-control form-control-custom" 
                                id="input-card-expiry" 
                                required={formData.paymentMethod === 'card'} 
                                placeholder="AA/YY" 
                                maxLength="5"
                                value={formData.cardExpiry}
                                onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                              />
                              <div className="invalid-feedback">Lütfen son kullanma tarihini giriniz.</div>
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="input-card-cvv" className="form-label small fw-semibold text-khaki-dark">CVC/CVV</label>
                              <input 
                                type="text" 
                                className="form-control form-control-custom" 
                                id="input-card-cvv" 
                                required={formData.paymentMethod === 'card'} 
                                placeholder="123" 
                                maxLength="3"
                                value={formData.cardCvv}
                                onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value })}
                              />
                              <div className="invalid-feedback">Lütfen CVV kodunu giriniz.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Havale Seçeneği */}
                  <div className="accordion-item border-0 glass-card overflow-hidden">
                    <h2 className="accordion-header">
                      <button 
                        className={`accordion-button ${formData.paymentMethod === 'eft' ? '' : 'collapsed'} bg-linen text-khaki-dark fw-semibold`} 
                        type="button" 
                        onClick={() => setFormData({ ...formData, paymentMethod: 'eft' })}
                        id="btn-accordion-eft"
                      >
                        <i className="bi bi-bank me-2"></i> Havale / EFT ile Ödeme
                      </button>
                    </h2>
                    {formData.paymentMethod === 'eft' && (
                      <div className="accordion-collapse collapse show">
                        <div className="accordion-body bg-white p-4">
                          <p className="text-muted small mb-2">Siparişinizi tamamladıktan sonra aşağıdaki banka hesabımıza sipariş tutarını transfer etmeniz gerekmektedir. Açıklama kısmına sipariş numaranızı yazmayı unutmayınız.</p>
                          <div className="p-3 bg-linen rounded border small">
                            <strong>Elegant E-Ticaret A.Ş.</strong><br />
                            İş Bankası IBAN: <span className="fw-mono text-khaki-dark">TR99 0006 2000 0001 2345 6789 01</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                </div>

                {/* Koşullar Onay Kutusu */}
                <div className="form-check mb-4">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="check-checkout-terms" 
                    required 
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  />
                  <label className="form-check-label text-muted small" htmlFor="check-checkout-terms">
                    <a href="javascript:void(0)" className="text-khaki text-decoration-none">Mesafeli Satış Sözleşmesi</a>'ni ve <a href="javascript:void(0)" className="text-khaki text-decoration-none">Ön Bilgilendirme Koşulları</a>'nı okudum, kabul ediyorum.
                  </label>
                  <div className="invalid-feedback">Siparişi tamamlamak için sözleşmeyi onaylamalısınız.</div>
                </div>
                
                {/* Siparişi Tamamla Butonu */}
                <button type="submit" className="btn btn-khaki w-100 py-3 font-title fw-bold fs-5" id="btn-submit-order">
                  Siparişi Tamamla <i className="bi bi-check-lg ms-1"></i>
                </button>

              </div>
            </div>
            
            {/* Sağ Bölüm: Sipariş Özeti */}
            <div className="col-lg-5">
              <div className="card border-0 glass-card p-4 sticky-lg-top" style={{ top: '100px', zIndex: 10 }}>
                <h5 className="card-title font-title fw-bold text-khaki-dark mb-4">Sepet Özeti</h5>
                
                <div id="checkout-items-summary">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <img src={item.img} alt={item.name} className="rounded me-2" style={{ width: '45px', height: '45px', objectFit: 'cover' }} />
                        <div>
                          <h6 className="mb-0 font-title" style={{ fontSize: '0.9rem' }}>{item.name}</h6>
                          <small className="text-muted">Adet: {item.qty} | Beden: {item.size}</small>
                        </div>
                      </div>
                      <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                        ₺{(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  
                  <hr />
                  <div className="d-flex justify-content-between mb-2 small">
                    <span>Ara Toplam</span>
                    <span>₺{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 small">
                    <span>Kargo</span>
                    <span>{shipping === 0 ? <span className="text-success">Ücretsiz</span> : `₺${shipping.toFixed(2)}`}</span>
                  </div>
                  {autoDiscount > 0 && (
                    <div className="d-flex justify-content-between mb-2 small text-success">
                      <span>Otomatik İndirim</span>
                      <span>-₺{autoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div className="d-flex justify-content-between mb-2 small text-success">
                      <span>Kupon İndirimi ({couponCode})</span>
                      <span>-₺{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <hr />
                  <div className="d-flex justify-content-between fw-bold text-khaki-dark fs-5">
                    <span>Toplam</span>
                    <span>₺{total.toFixed(2)}</span>
                  </div>
                </div>
                
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* Sipariş Başarı Modalı */}
      {showSuccessModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} id="modal-order-success" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 glass-card p-4">
              <div className="modal-body text-center">
                <div className="bg-linen rounded-circle p-4 mx-auto text-success mb-4 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-bag-check fs-1"></i>
                </div>
                <h3 className="font-title fw-bold text-khaki-dark mb-3">Siparişiniz Alındı!</h3>
                <p className="text-muted mb-4">Harika bir seçim! Siparişiniz başarıyla alındı ve hazırlanma sürecine girdi. E-posta adresinize detaylı bir bilgilendirme gönderdik.</p>
                <button type="button" className="btn btn-khaki w-100 py-2.5" onClick={handleModalClose} id="btn-success-modal-home">
                  Ana Sayfaya Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
