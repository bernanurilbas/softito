import React from 'react';

export default function CartDrawer({
  showCartDrawer,
  setShowCartDrawer,
  cart,
  updateCartQty,
  couponInput,
  setCouponInput,
  applyPromoCoupon,
  couponError,
  couponSuccess,
  getCartSubtotal,
  appliedCoupon,
  getCartDiscount,
  getCartDeliveryFee,
  getCartTotal,
  restaurants,
  setActiveView
}) {
  return (
    <>
      <div
        className={`cart-drawer-backdrop ${showCartDrawer ? 'show' : ''}`}
        onClick={() => setShowCartDrawer(false)}
      ></div>
      <div className={`cart-drawer ${showCartDrawer ? 'open' : ''} p-3 text-dark`}>
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
          <h5 className="fw-bold m-0 text-dark">
            <i className="bi bi-basket-fill text-hz-primary me-2"></i> Sepetim
          </h5>
          <button type="button" className="btn-close" onClick={() => setShowCartDrawer(false)}></button>
        </div>

        {cart.items.length > 0 ? (
          <div className="d-flex flex-column h-100 pb-5" style={{ overflowY: 'auto' }}>
            <div className="flex-grow-1 pb-3">
              {cart.items.map((item) => (
                <div key={item.uniqueId} className="border-bottom py-2.5 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '14px' }}>
                      {item.name}
                    </h6>
                    <small className="text-secondary d-block" style={{ fontSize: '11px' }}>
                      {item.customizations.size}
                    </small>
                    {item.customizations?.extras?.length > 0 && (
                      <small className="text-muted d-block" style={{ fontSize: '10px' }}>
                        Ekstra: {item.customizations.extras.join(', ')}
                      </small>
                    )}
                    <span className="text-hz-primary fw-bold small">{item.finalSinglePrice * item.qty} TL</span>
                  </div>

                  <div className="input-group input-group-sm" style={{ width: '90px' }}>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => updateCartQty(item.uniqueId, -1)}>
                      -
                    </button>
                    <input type="text" className="form-control text-center bg-white border-secondary p-0" value={item.qty} readOnly />
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => updateCartQty(item.uniqueId, 1)}>
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-light p-3 rounded-4 mb-3 border text-dark">
              <h6 className="fw-bold mb-2 small">
                <i className="bi bi-ticket-perforated-fill text-hz-primary"></i> Kupon Kodu Uygula
              </h6>
              <div className="input-group input-group-sm mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="YEMEK25"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button className="btn btn-hz-primary text-white" onClick={applyPromoCoupon}>
                  Uygula
                </button>
              </div>
              {couponError && (
                <small className="text-danger d-block small" style={{ fontSize: '11px' }}>
                  <i className="bi bi-exclamation-triangle"></i> {couponError}
                </small>
              )}
              {couponSuccess && (
                <small className="text-success d-block small" style={{ fontSize: '11px' }}>
                  <i className="bi bi-check-circle"></i> {couponSuccess}
                </small>
              )}
            </div>

            <div className="border-top pt-3 text-dark">
              <div className="d-flex justify-content-between mb-2 small text-secondary">
                <span>Ara Toplam</span>
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
              <div className="d-flex justify-content-between fw-bold mb-4 text-dark">
                <span>Toplam</span>
                <span>{getCartTotal()} TL</span>
              </div>

              {(() => {
                const restObj = restaurants.find((r) => r.id === cart.restaurantId);
                const sub = getCartSubtotal();
                const min = restObj ? restObj.minBasket : 0;

                if (sub < min) {
                  return (
                    <div className="alert alert-danger py-2 small border-0 mb-0 text-dark">
                      <i className="bi bi-exclamation-circle-fill me-1"></i> Bu mağazadan sipariş vermek için sepet tutarınız minimum{' '}
                      <strong>{min} TL</strong> olmalıdır.
                    </div>
                  );
                } else {
                  return (
                    <button
                      className="btn btn-hz-primary w-100 py-2.5 rounded-3 fw-bold animate-hover text-white"
                      onClick={() => {
                        setShowCartDrawer(false);
                        setActiveView('checkout');
                      }}
                    >
                      Sepeti Onayla <i className="bi bi-chevron-right ms-1"></i>
                    </button>
                  );
                }
              })()}
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center h-75 text-center text-muted">
            <i className="bi bi-cart3 display-2 mb-3"></i>
            <h5>Sepetiniz Boş</h5>
            <p className="small px-4">Alışverişinizi tamamlamak için dilediğiniz ürünleri sepetinize ekleyebilirsiniz.</p>
          </div>
        )}
      </div>
    </>
  );
}
