import React from 'react';

export default function MerchantDashboard({
  currentUser,
  orders,
  restaurants,
  setShowAddItemModal,
  handleUpdateOrderStatus,
  handleDeleteMenuItem,
  renderPaymentMethodText
}) {
  const shopOrders = orders.filter((o) => o.restaurantId === currentUser.restaurantId);
  const shopActiveOrders = shopOrders.filter((o) => o.status !== 'Teslim Edildi');
  const totalRevenue = shopOrders.reduce((sum, o) => sum + o.total, 0);
  const targetRestaurant = restaurants.find((r) => r.id === currentUser.restaurantId);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">
          <i className="bi bi-shop text-hz-primary me-2"></i> Mağaza Yönetim Paneli
        </h2>
        <button className="btn btn-hz-primary rounded-pill px-4 animate-hover" onClick={() => setShowAddItemModal(true)}>
          <i className="bi bi-plus-lg me-1"></i> Yeni Ürün Ekle
        </button>
      </div>

      <div className="row mb-5">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
            <span className="text-secondary small fw-bold text-uppercase d-block mb-1">Toplam Ciro</span>
            <h3 className="fw-bold text-hz-primary mb-0">{totalRevenue} TL</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
            <span className="text-secondary small fw-bold text-uppercase d-block mb-1">Sipariş Sayısı</span>
            <h3 className="fw-bold text-dark mb-0">{shopOrders.length} adet</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
            <span className="text-secondary small fw-bold text-uppercase d-block mb-1">Aktif Siparişler</span>
            <h3 className="fw-bold text-success mb-0">{shopActiveOrders.length} adet</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
            <span className="text-secondary small fw-bold text-uppercase d-block mb-1">Ürün Çeşitliliği</span>
            <h3 className="fw-bold text-dark mb-0">{targetRestaurant?.menuItems?.length || 0} ürün</h3>
          </div>
        </div>
      </div>

      {/* 4-COLUMN KANBAN LIFECYCLE ORDER WORKFLOW */}
      <h4 className="fw-bold mb-3">
        <i className="bi bi-kanban text-hz-primary me-2"></i> Sipariş İş Akışı (Sipariş Durumları)
      </h4>
      <div className="row mb-5">
        {/* Column 1: Onay Bekleyenler */}
        <div className="col-lg-3 col-sm-6 mb-4">
          <div className="card border-0 shadow-sm p-3 rounded-4 h-100 bg-white">
            <h6 className="fw-bold text-secondary mb-3 border-bottom pb-2 d-flex justify-content-between align-items-center">
              <span>⏳ Onay Bekleyen</span>
              <span className="badge bg-secondary text-white rounded-pill">
                {shopOrders.filter((o) => o.status === 'Sipariş Alındı').length}
              </span>
            </h6>
            <div className="d-flex flex-column gap-2 overflow-y-auto" style={{ maxHeight: '420px', minHeight: '120px' }}>
              {shopOrders.filter((o) => o.status === 'Sipariş Alındı').length > 0 ? (
                shopOrders
                  .filter((o) => o.status === 'Sipariş Alındı')
                  .map((order) => (
                    <div key={order.id} className="border rounded-3 p-3 shadow-sm bg-light">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-hz-primary small">Sipariş #{order.id}</span>
                        <span className="text-muted" style={{ fontSize: '10px' }}>
                          {order.timestamp}
                        </span>
                      </div>
                      <div className="mb-2 small text-dark">
                        {order.items.map((it) => (
                          <div key={it.uniqueId} className="fw-semibold">
                            {it.qty}x {it.name}{' '}
                            <span className="text-muted font-normal" style={{ fontSize: '10px' }}>
                              ({it.customizations.size})
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mb-3 small text-muted" style={{ fontSize: '11px' }}>
                        <div className="text-truncate">
                          <i className="bi bi-geo-alt"></i> {order.address}
                        </div>
                        <div>
                          <i className="bi bi-wallet2"></i> {renderPaymentMethodText(order.paymentMethod)} • {order.total} TL
                        </div>
                      </div>
                      <button
                        className="btn btn-warning btn-sm w-100 rounded-3 text-dark fw-bold"
                        onClick={() => handleUpdateOrderStatus(order.id, 'Hazırlanıyor')}
                      >
                        Onayla & Hazırla <i className="bi bi-check-lg ms-1"></i>
                      </button>
                    </div>
                  ))
              ) : (
                <div className="text-center py-4 text-muted small">Yeni sipariş yok.</div>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Hazırlanıyor */}
        <div className="col-lg-3 col-sm-6 mb-4">
          <div className="card border-0 shadow-sm p-3 rounded-4 h-100 bg-white">
            <h6 className="fw-bold text-warning mb-3 border-bottom pb-2 d-flex justify-content-between align-items-center">
              <span>🍳 Hazırlanıyor</span>
              <span className="badge bg-warning text-dark rounded-pill">
                {shopOrders.filter((o) => o.status === 'Hazırlanıyor').length}
              </span>
            </h6>
            <div className="d-flex flex-column gap-2 overflow-y-auto" style={{ maxHeight: '420px', minHeight: '120px' }}>
              {shopOrders.filter((o) => o.status === 'Hazırlanıyor').length > 0 ? (
                shopOrders
                  .filter((o) => o.status === 'Hazırlanıyor')
                  .map((order) => (
                    <div key={order.id} className="border rounded-3 p-3 shadow-sm bg-light">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-hz-primary small">Sipariş #{order.id}</span>
                        <span className="text-muted" style={{ fontSize: '10px' }}>
                          {order.timestamp}
                        </span>
                      </div>
                      <div className="mb-2 small text-dark">
                        {order.items.map((it) => (
                          <div key={it.uniqueId} className="fw-semibold">
                            {it.qty}x {it.name}{' '}
                            <span className="text-muted font-normal" style={{ fontSize: '10px' }}>
                              ({it.customizations.size})
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mb-3 small text-muted" style={{ fontSize: '11px' }}>
                        <div className="text-truncate">
                          <i className="bi bi-geo-alt"></i> {order.address}
                        </div>
                        <div>
                          <i className="bi bi-wallet2"></i> {renderPaymentMethodText(order.paymentMethod)} • {order.total} TL
                        </div>
                      </div>
                      <button
                        className="btn btn-primary btn-sm w-100 rounded-3 text-white fw-bold"
                        onClick={() => handleUpdateOrderStatus(order.id, 'Kurye Yolda')}
                      >
                        Kuryeye Ver <i className="bi bi-bicycle ms-1"></i>
                      </button>
                    </div>
                  ))
              ) : (
                <div className="text-center py-4 text-muted small">Hazırlanan sipariş yok.</div>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Yolda */}
        <div className="col-lg-3 col-sm-6 mb-4">
          <div className="card border-0 shadow-sm p-3 rounded-4 h-100 bg-white">
            <h6 className="fw-bold text-primary mb-3 border-bottom pb-2 d-flex justify-content-between align-items-center">
              <span>🚴 Yolda / Teslimatta</span>
              <span className="badge bg-primary text-white rounded-pill">
                {shopOrders.filter((o) => o.status === 'Kurye Yolda').length}
              </span>
            </h6>
            <div className="d-flex flex-column gap-2 overflow-y-auto" style={{ maxHeight: '420px', minHeight: '120px' }}>
              {shopOrders.filter((o) => o.status === 'Kurye Yolda').length > 0 ? (
                shopOrders
                  .filter((o) => o.status === 'Kurye Yolda')
                  .map((order) => (
                    <div key={order.id} className="border rounded-3 p-3 shadow-sm bg-light">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-hz-primary small">Sipariş #{order.id}</span>
                        <span className="text-muted" style={{ fontSize: '10px' }}>
                          {order.timestamp}
                        </span>
                      </div>
                      <div className="mb-2 small text-dark">
                        {order.items.map((it) => (
                          <div key={it.uniqueId} className="fw-semibold">
                            {it.qty}x {it.name}{' '}
                            <span className="text-muted font-normal" style={{ fontSize: '10px' }}>
                              ({it.customizations.size})
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mb-3 small text-muted" style={{ fontSize: '11px' }}>
                        <div className="text-truncate">
                          <i className="bi bi-geo-alt"></i> {order.address}
                        </div>
                        <div>
                          <i className="bi bi-wallet2"></i> {renderPaymentMethodText(order.paymentMethod)} • {order.total} TL
                        </div>
                      </div>
                      <button
                        className="btn btn-success btn-sm w-100 rounded-3 text-white fw-bold"
                        onClick={() => handleUpdateOrderStatus(order.id, 'Teslim Edildi')}
                      >
                        Teslim Et <i className="bi bi-check-circle-fill ms-1"></i>
                      </button>
                    </div>
                  ))
              ) : (
                <div className="text-center py-4 text-muted small">Yolda olan sipariş yok.</div>
              )}
            </div>
          </div>
        </div>

        {/* Column 4: Teslim Edildi */}
        <div className="col-lg-3 col-sm-6 mb-4">
          <div className="card border-0 shadow-sm p-3 rounded-4 h-100 bg-white">
            <h6 className="fw-bold text-success mb-3 border-bottom pb-2 d-flex justify-content-between align-items-center">
              <span>✅ Teslim Edildi</span>
              <span className="badge bg-success text-white rounded-pill">
                {shopOrders.filter((o) => o.status === 'Teslim Edildi').length}
              </span>
            </h6>
            <div className="d-flex flex-column gap-2 overflow-y-auto" style={{ maxHeight: '420px', minHeight: '120px' }}>
              {shopOrders.filter((o) => o.status === 'Teslim Edildi').length > 0 ? (
                shopOrders
                  .filter((o) => o.status === 'Teslim Edildi')
                  .map((order) => (
                    <div key={order.id} className="border rounded-3 p-3 shadow-sm bg-light">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-success small">Sipariş #{order.id}</span>
                        <span className="text-muted" style={{ fontSize: '10px' }}>
                          {order.timestamp}
                        </span>
                      </div>
                      <div className="mb-2 small text-dark">
                        {order.items.map((it) => (
                          <div key={it.uniqueId} className="fw-semibold">
                            {it.qty}x {it.name}{' '}
                            <span className="text-muted font-normal" style={{ fontSize: '10px' }}>
                              ({it.customizations.size})
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="small text-muted" style={{ fontSize: '11px' }}>
                        <div className="text-truncate">
                          <i className="bi bi-geo-alt"></i> {order.address}
                        </div>
                        <div>
                          <i className="bi bi-wallet2"></i> {renderPaymentMethodText(order.paymentMethod)} • {order.total} TL
                        </div>
                      </div>
                      <div className="text-success small fw-bold mt-2 text-center">
                        <i className="bi bi-check-circle-fill"></i> Sipariş Teslim Edildi
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-4 text-muted small">Teslim edilen sipariş yok.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
            <h4 className="fw-bold mb-4">
              <i className="bi bi-card-list text-hz-primary me-2"></i> Ürün Listesi
            </h4>

            <div className="d-flex flex-column gap-2 overflow-y-auto" style={{ maxHeight: '450px' }}>
              {targetRestaurant?.menuItems?.map((menuItem) => (
                <div
                  key={menuItem.id}
                  className="d-flex justify-content-between align-items-center p-3 border rounded-3 mb-2 bg-light text-dark"
                >
                  <div>
                    <h6 className="fw-bold mb-1">{menuItem.name}</h6>
                    <small className="text-muted d-block">{menuItem.category}</small>
                    <span className="text-hz-primary fw-bold mt-1 d-block">{menuItem.price} TL</span>
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm rounded-circle p-2"
                    style={{ width: '36px', height: '36px' }}
                    onClick={() => handleDeleteMenuItem(menuItem.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
