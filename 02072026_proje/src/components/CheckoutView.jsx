import React from 'react';

export default function CheckoutView({
  setActiveView,
  setShowCartDrawer,
  addresses,
  selectedAddress,
  setSelectedAddress,
  addressDialogRef,
  setShowAddressModal,
  paymentMethod,
  setPaymentMethod,
  isCardFlipped,
  setIsCardFlipped,
  cardNumber,
  handleCardNumberChange,
  cardHolder,
  setCardHolder,
  cardExpiry,
  handleCardExpiryChange,
  cardCvv,
  setCardCvv,
  checkoutNote,
  setCheckoutNote,
  handleCheckoutSubmit,
  cart,
  getCartSubtotal,
  appliedCoupon,
  getCartDiscount,
  getCartDeliveryFee,
  getCartTotal
}) {
  return (
    <div>
      <button
        className="btn btn-outline-secondary rounded-pill mb-4"
        onClick={() => {
          setActiveView('menu');
          setShowCartDrawer(true);
        }}
      >
        <i className="bi bi-arrow-left me-1"></i> Sepete Geri Dön
      </button>

      <h3 className="fw-bold mb-4">Ödeme Sayfası</h3>
      <div className="row">
        <div className="col-lg-8 mb-4">
          <form onSubmit={handleCheckoutSubmit}>
            {/* Address Selector card */}
            <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-geo-alt text-hz-primary me-2"></i> 1. Teslimat Adresi
              </h5>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`form-check p-3 border rounded-3 mb-2 d-flex align-items-center ${
                    selectedAddress?.id === addr.id ? 'border-danger bg-hz-primary-light' : ''
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedAddress(addr)}
                >
                  <input
                    className="form-check-input ms-0 me-3"
                    type="radio"
                    checked={selectedAddress?.id === addr.id}
                    readOnly
                  />
                  <label className="form-check-label fw-bold" style={{ cursor: 'pointer' }}>
                    {addr.title} <span className="text-muted fw-normal d-block small mt-1">{addr.addressText}</span>
                  </label>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-hz-primary btn-sm mt-3 w-100 rounded-pill"
                onClick={() => {
                  setShowAddressModal(true);
                  addressDialogRef.current?.showModal();
                }}
              >
                <i className="bi bi-plus-lg me-1"></i> Yeni Adres Ekle
              </button>
            </div>

            {/* Payment Method selector */}
            <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-credit-card text-hz-primary me-2"></i> 2. Ödeme Yöntemi
              </h5>

              <div className="row mb-4">
                {/* Cash / Card at Door Option */}
                <div className="col-sm-6 mb-2">
                  <div
                    className={`p-3 border rounded-3 text-center ${
                      paymentMethod === 'cash_door' || paymentMethod === 'card_door'
                        ? 'border-danger bg-hz-primary-light text-hz-primary'
                        : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setPaymentMethod('cash_door')}
                  >
                    <i className="bi bi-cash-coin display-6 d-block mb-2"></i>
                    <span className="fw-bold">Kapıda Ödeme</span>
                  </div>
                </div>

                {/* Online Credit Card Option */}
                <div className="col-sm-6 mb-2">
                  <div
                    className={`p-3 border rounded-3 text-center ${
                      paymentMethod === 'card_online' ? 'border-danger bg-hz-primary-light text-hz-primary' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setPaymentMethod('card_online')}
                  >
                    <i className="bi bi-credit-card-2-front display-6 d-block mb-2"></i>
                    <span className="fw-bold">Online Kredi Kartı</span>
                  </div>
                </div>
              </div>

              {/* SUB-OPTIONS FOR CASH-ON-DELIVERY */}
              {(paymentMethod === 'cash_door' || paymentMethod === 'card_door') && (
                <div className="p-3 border rounded-3 bg-light mb-3">
                  <h6 className="fw-bold text-dark small mb-3">Kapıda Hangi Yöntemle Ödeyeceksiniz?</h6>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="door-submethod"
                        id="cashdoor"
                        checked={paymentMethod === 'cash_door'}
                        onChange={() => setPaymentMethod('cash_door')}
                      />
                      <label className="form-check-label fw-semibold" htmlFor="cashdoor" style={{ cursor: 'pointer' }}>
                        Kapıda Nakit Ödeme
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="door-submethod"
                        id="carddoor"
                        checked={paymentMethod === 'card_door'}
                        onChange={() => setPaymentMethod('card_door')}
                      />
                      <label className="form-check-label fw-semibold" htmlFor="carddoor" style={{ cursor: 'pointer' }}>
                        Kapıda Kredi Kartı (POS Cihazı)
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card_online' && (
                <div>
                  <div className="cc-container">
                    <div className={`cc-card ${isCardFlipped ? 'flipped' : ''}`}>
                      <div className="cc-front">
                        <div className="d-flex justify-content-between align-items-center">
                          <i className="bi bi-chip fs-3 text-warning"></i>
                          <span className="fw-bold italic text-light">HIZLISEPET PAY</span>
                        </div>
                        <div className="fs-4 font-monospace my-3 tracking-wider">{cardNumber || '•••• •••• •••• ••••'}</div>
                        <div className="d-flex justify-content-between align-items-end small">
                          <div>
                            <div className="text-muted text-uppercase" style={{ fontSize: '9px' }}>
                              KART SAHİBİ
                            </div>
                            <div>{cardHolder.toUpperCase() || 'AD SOYAD'}</div>
                          </div>
                          <div className="text-end">
                            <div className="text-muted text-uppercase" style={{ fontSize: '9px' }}>
                              S.K.T
                            </div>
                            <div>{cardExpiry || 'AA/YY'}</div>
                          </div>
                        </div>
                      </div>
                      <div className="cc-back">
                        <div className="cc-magnetic-strip"></div>
                        <div className="cc-signature-area text-dark font-monospace text-end">
                          <span>{cardCvv || 'CVV'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-secondary small fw-bold">Kart Üzerindeki İsim</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        required
                        placeholder="KART SAHİBİ"
                        onFocus={() => setIsCardFlipped(false)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-secondary small fw-bold">Kart Numarası</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        required
                        placeholder="0000 0000 0000 0000"
                        maxLength="19"
                        onFocus={() => setIsCardFlipped(false)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label text-secondary small fw-bold">S.K.T</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        placeholder="AA/YY"
                        maxLength="5"
                        required
                        onFocus={() => setIsCardFlipped(false)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label text-secondary small fw-bold">CVV</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                        required
                        placeholder="***"
                        maxLength="3"
                        onFocus={() => setIsCardFlipped(true)}
                        onBlur={() => setIsCardFlipped(false)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-chat-left-dots text-hz-primary me-2"></i> 3. Sipariş Notu
              </h5>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Zile basmayın, siparişi kapıya asın vb. notlarınızı ekleyebilirsiniz..."
                value={checkoutNote}
                onChange={(e) => setCheckoutNote(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-hz-primary w-100 py-3 rounded-4 fw-bold fs-5 shadow animate-hover">
              Siparişi Tamamla ({getCartTotal()} TL)
            </button>
          </form>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 sticky-top" style={{ top: '100px', zIndex: 10 }}>
            <h5 className="fw-bold mb-3">Sipariş Özeti</h5>
            <hr />
            {cart.items.map((item) => (
              <div key={item.uniqueId} className="d-flex justify-content-between mb-2 small text-dark">
                <span>
                  {item.qty}x {item.name}{' '}
                  <span className="text-muted d-block" style={{ fontSize: '10px' }}>
                    {item.customizations.size}
                  </span>
                </span>
                <span className="fw-semibold">{item.finalSinglePrice * item.qty} TL</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between mb-2 small text-secondary">
              <span>Sepet Toplamı</span>
              <span>{getCartSubtotal()} TL</span>
            </div>
            {appliedCoupon && (
              <div className="d-flex justify-content-between mb-2 small text-success">
                <span>Kupon İndirimi ({appliedCoupon.code})</span>
                <span>-{getCartDiscount()} TL</span>
              </div>
            )}
            <div className="d-flex justify-content-between mb-2 small text-secondary">
              <span>Kurye Ücreti</span>
              <span>{getCartDeliveryFee() === 0 ? 'Ücretsiz' : `${getCartDeliveryFee()} TL`}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5 text-hz-primary">
              <span>Toplam</span>
              <span>{getCartTotal()} TL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
