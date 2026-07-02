import React from 'react';

export default function OrdersHistoryView({
  setActiveView,
  orders,
  currentUser,
  setActiveOrder,
  handleReorder,
  renderPaymentMethodText
}) {
  const userOrders = orders.filter((o) => o.userId === (currentUser?.id || '1'));

  return (
    <div>
      <button className="btn btn-outline-secondary rounded-pill mb-4" onClick={() => setActiveView('home')}>
        <i className="bi bi-arrow-left me-1"></i> Alışverişe Devam Et
      </button>

      <h3 className="fw-bold mb-4">
        <i className="bi bi-clock-history text-hz-primary me-2"></i> Sipariş Geçmişim
      </h3>

      <div className="row">
        <div className="col-12">
          {userOrders.length > 0 ? (
            [...userOrders]
              .reverse() // show latest first
              .map((order) => (
                <div key={order.id} className="card border-0 shadow-sm p-4 rounded-4 mb-3 bg-white">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                    <div>
                      <h5 className="fw-bold text-dark mb-1">{order.restaurantName}</h5>
                      <span className="text-secondary small d-block">
                        <i className="bi bi-calendar3 me-1"></i> Saat: {order.timestamp}
                      </span>
                    </div>
                    <div className="text-md-end">
                      <span className={`badge ${order.status === 'Teslim Edildi' ? 'bg-success' : 'bg-warning'} px-3 py-1.5 rounded-pill mb-1 d-inline-block`}>
                        {order.status}
                      </span>
                      <h6 className="text-hz-primary fw-bold mb-0 mt-1">{order.total} TL</h6>
                    </div>
                  </div>

                  <hr />

                  <div className="mb-3 small">
                    <h6 className="fw-bold small text-secondary mb-2">Sipariş İçeriği:</h6>
                    {order.items.map((it) => (
                      <div key={it.uniqueId} className="mb-1 text-dark">
                        {it.qty}x {it.name} <span className="text-muted">({it.customizations.size})</span>
                        {it.customizations?.extras?.length > 0 && (
                          <span className="text-muted d-block" style={{ fontSize: '11px', paddingLeft: '20px' }}>
                            Ekstralar: {it.customizations.extras.join(', ')}
                          </span>
                        )}
                      </div>
                    ))}
                    <div className="mt-2 text-secondary">
                      <span>
                        Ödeme: <strong>{renderPaymentMethodText(order.paymentMethod)}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    {order.status !== 'Teslim Edildi' && (
                      <button
                        className="btn btn-hz-primary btn-sm px-4 rounded-3"
                        onClick={() => {
                          setActiveOrder(order);
                          setActiveView('tracking');
                        }}
                      >
                        Siparişi Takip Et <i className="bi bi-compass ms-1"></i>
                      </button>
                    )}
                    <button
                      className="btn btn-outline-hz-primary btn-sm px-4 rounded-3"
                      onClick={() => handleReorder(order)}
                    >
                      Tekrar Sipariş Et <i className="bi bi-arrow-repeat ms-1"></i>
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="card border-0 shadow-sm p-5 rounded-4 text-center text-muted bg-white">
              <i className="bi bi-clock-history display-1 mb-3"></i>
              <h5>Henüz siparişiniz bulunmuyor</h5>
              <p className="small mb-4">HızlıSepet ile ilk siparişinizi hemen oluşturabilirsiniz!</p>
              <button className="btn btn-hz-primary rounded-pill px-4" onClick={() => setActiveView('home')}>
                Alışverişe Başla
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
