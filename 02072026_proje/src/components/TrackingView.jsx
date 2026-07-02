import React from 'react';

export default function TrackingView({
  setActiveView,
  activeOrder,
  selectedAddress,
  renderPaymentMethodText
}) {
  if (!activeOrder) return null;

  return (
    <div>
      <button className="btn btn-outline-secondary rounded-pill mb-4" onClick={() => setActiveView('orders')}>
        <i className="bi bi-arrow-left me-1"></i> Siparişlerime Dön
      </button>

      <h3 className="fw-bold mb-4">Sipariş Takibi</h3>

      <div className="row">
        <div className="col-lg-7 mb-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 text-center">
            <span className="badge bg-hz-primary-light text-hz-primary rounded-pill px-3 py-1.5 mb-2 mx-auto fw-bold">
              SİPARİŞ NO: #{activeOrder.id}
            </span>
            <h4 className="fw-bold mb-4">{activeOrder.restaurantName}</h4>

            <div className="d-flex justify-content-between align-items-center mb-5 mt-3">
              <div
                className={`stepper-item ${
                  ['Sipariş Alındı', 'Hazırlanıyor', 'Kurye Yolda', 'Teslim Edildi'].indexOf(activeOrder.status) >= 0 ? 'completed' : ''
                } ${activeOrder.status === 'Sipariş Alındı' ? 'active' : ''}`}
              >
                <div className="stepper-icon">
                  <i className="bi bi-file-earmark-check"></i>
                </div>
                <span className="small fw-bold text-dark">Sipariş Alındı</span>
              </div>
              <div
                className={`stepper-item ${
                  ['Hazırlanıyor', 'Kurye Yolda', 'Teslim Edildi'].indexOf(activeOrder.status) >= 0 ? 'completed' : ''
                } ${activeOrder.status === 'Hazırlanıyor' ? 'active' : ''}`}
              >
                <div className="stepper-icon">
                  <i className="bi bi-egg-fried"></i>
                </div>
                <span className="small fw-bold text-dark">Hazırlanıyor</span>
              </div>
              <div
                className={`stepper-item ${
                  ['Kurye Yolda', 'Teslim Edildi'].indexOf(activeOrder.status) >= 0 ? 'completed' : ''
                } ${activeOrder.status === 'Kurye Yolda' ? 'active' : ''}`}
              >
                <div className="stepper-icon">
                  <i className="bi bi-bicycle"></i>
                </div>
                <span className="small fw-bold text-dark">Yolda</span>
              </div>
              <div
                className={`stepper-item ${activeOrder.status === 'Teslim Edildi' ? 'completed' : ''} ${
                  activeOrder.status === 'Teslim Edildi' ? 'active' : ''
                }`}
              >
                <div className="stepper-icon">
                  <i className="bi bi-house-door"></i>
                </div>
                <span className="small fw-bold text-dark">Teslim Edildi</span>
              </div>
            </div>

            <hr />

            <div className="text-start mt-3 small text-secondary">
              <p className="mb-1">
                <i className="bi bi-wallet2 me-1"></i> Ödeme Yöntemi:{' '}
                <strong className="text-dark">{renderPaymentMethodText(activeOrder.paymentMethod)}</strong>
              </p>
            </div>

            <div className="alert alert-warning text-start small mb-0 mt-3 border-0 bg-light text-dark">
              <i className="bi bi-info-circle-fill text-warning me-2 fs-5"></i>
              <strong>Sipariş Durumu Güncellemesi:</strong> İlerlemeyi test etmek için <strong>İşletme Paneline</strong> giriş yapıp bu
              siparişin durumunu değiştirebilirsiniz.
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm p-4 rounded-4">
            <h5 className="fw-bold mb-3 text-dark">
              <i className="bi bi-compass-fill text-hz-primary me-2"></i> Canlı Kurye Haritası
            </h5>

            <div className="svg-map-container mb-3 position-relative">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect x="0" y="60" width="30" height="40" className="map-park" />
                <rect x="60" y="0" width="40" height="30" className="map-park" />
                <rect x="0" y="0" width="100" height="15" className="map-water" />

                <line x1="0" y1="20" x2="100" y2="20" className="map-road" strokeWidth="5" />
                <line x1="0" y1="50" x2="100" y2="50" className="map-road" strokeWidth="6" />
                <line x1="0" y1="80" x2="100" y2="80" className="map-road" strokeWidth="5" />

                <line x1="20" y1="0" x2="20" y2="100" className="map-road" strokeWidth="5" />
                <line x1="50" y1="0" x2="50" y2="100" className="map-road" strokeWidth="6" />
                <line x1="80" y1="0" x2="80" y2="100" className="map-road" strokeWidth="5" />

                <circle cx="50" cy="50" r="4" fill="#1E2022" />

                {selectedAddress && (
                  <g>
                    <circle cx={selectedAddress.x} cy={selectedAddress.y} r="5" fill="#F0144C" className="pulsating-pin" />
                    <circle cx={selectedAddress.x} cy={selectedAddress.y} r="2" fill="#FFFFFF" />
                  </g>
                )}

                {activeOrder.status === 'Kurye Yolda' && (
                  <g>
                    <circle
                      cx={selectedAddress ? 50 + (selectedAddress.x - 50) * 0.6 : 50}
                      cy={selectedAddress ? 50 + (selectedAddress.y - 50) * 0.6 : 50}
                      r="4"
                      fill="#00875A"
                    />
                    <circle
                      cx={selectedAddress ? 50 + (selectedAddress.x - 50) * 0.6 : 50}
                      cy={selectedAddress ? 50 + (selectedAddress.y - 50) * 0.6 : 50}
                      r="1.5"
                      fill="#FFFFFF"
                    />
                  </g>
                )}
                {activeOrder.status === 'Teslim Edildi' && (
                  <g>
                    <circle cx={selectedAddress ? selectedAddress.x : 50} cy={selectedAddress ? selectedAddress.y : 50} r="4" fill="#00875A" />
                  </g>
                )}
              </svg>

              <div
                className="position-absolute bg-white px-2.5 py-1 rounded shadow-sm border small text-dark"
                style={{ top: '20px', left: '20px' }}
              >
                <span className="badge bg-secondary me-1">A</span> Çıkış Noktası
              </div>

              <div
                className="position-absolute bg-white px-2.5 py-1 rounded shadow-sm border small text-dark"
                style={{ bottom: '20px', right: '20px' }}
              >
                <span className="badge bg-hz-primary me-1">B</span> {selectedAddress?.title || 'Adresiniz'}
              </div>
            </div>

            <div className="small text-secondary">
              <p className="mb-1">
                <i className="bi bi-geo-alt-fill text-hz-primary me-1"></i> Teslimat Adresi: <strong>{activeOrder.address}</strong>
              </p>
              <p className="mb-0">
                <i className="bi bi-clock-fill text-hz-primary me-1"></i> Durum: <strong>{activeOrder.status}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
