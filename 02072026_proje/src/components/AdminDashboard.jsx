import React from 'react';

export default function AdminDashboard({
  orders,
  restaurants,
  coupons,
  adminSearch,
  setAdminSearch,
  adminPage,
  setAdminPage,
  adminPageSize,
  adminSortHeader,
  adminSortDir,
  handleAdminSort,
  getPaginatedRestaurantsAdmin,
  getSortedRestaurantsAdmin,
  handleDeleteRestaurant,
  setShowAddRestModal,
  addRestDialogRef,
  newCouponCode,
  setNewCouponCode,
  newCouponType,
  setNewCouponType,
  newCouponValue,
  setNewCouponValue,
  newCouponMin,
  setNewCouponMin,
  handleAddCoupon,
  handleDeleteCoupon,
  renderPaymentMethodText
}) {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const sortedAdminRests = getSortedRestaurantsAdmin();
  const paginatedAdminRests = getPaginatedRestaurantsAdmin();
  const totalPages = Math.ceil(sortedAdminRests.length / adminPageSize);

  return (
    <div>
      <h2 className="fw-bold mb-4">
        <i className="bi bi-shield-lock text-hz-primary me-2"></i> Sistem Yönetim Paneli (Admin)
      </h2>

      <div className="row mb-5">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
            <span className="text-secondary small fw-bold text-uppercase d-block mb-1">Toplam Satış</span>
            <h3 className="fw-bold text-hz-primary mb-0">{totalRevenue} TL</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
            <span className="text-secondary small fw-bold text-uppercase d-block mb-1">Kayıtlı İşletme</span>
            <h3 className="fw-bold text-dark mb-0">{restaurants.length} adet</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
            <span className="text-secondary small fw-bold text-uppercase d-block mb-1">Toplam Kupon</span>
            <h3 className="fw-bold text-dark mb-0">{coupons.length} adet</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
            <span className="text-secondary small fw-bold text-uppercase d-block mb-1">Platform Siparişleri</span>
            <h3 className="fw-bold text-dark mb-0">{orders.length} adet</h3>
          </div>
        </div>
      </div>

      {/* RESTAURANTS DATA TABLE */}
      <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-5">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <h4 className="fw-bold m-0 text-dark">
            <i className="bi bi-grid-3x3-gap text-hz-primary me-2"></i> İşletme Veri Tablosu (Data Table)
          </h4>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control rounded-pill"
              style={{ maxWidth: '250px' }}
              placeholder="Mağaza ara..."
              value={adminSearch}
              onChange={(e) => {
                setAdminSearch(e.target.value);
                setAdminPage(1);
              }}
            />
            <button
              className="btn btn-hz-primary rounded-pill px-4 text-nowrap animate-hover"
              onClick={() => {
                setShowAddRestModal(true);
                addRestDialogRef.current?.showModal();
              }}
            >
              <i className="bi bi-plus-lg me-1"></i> Yeni İşletme Ekle
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => handleAdminSort('id')}>
                  ID {adminSortHeader === 'id' && (adminSortDir === 'asc' ? '▲' : '▼')}
                </th>
                <th>Resim</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleAdminSort('name')}>
                  İşletme İsmi {adminSortHeader === 'name' && (adminSortDir === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleAdminSort('type')}>
                  Portal Türü {adminSortHeader === 'type' && (adminSortDir === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleAdminSort('cuisine')}>
                  Alt Kategori {adminSortHeader === 'cuisine' && (adminSortDir === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleAdminSort('rating')}>
                  Puan {adminSortHeader === 'rating' && (adminSortDir === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleAdminSort('minBasket')}>
                  Min. Sepet {adminSortHeader === 'minBasket' && (adminSortDir === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleAdminSort('fee')}>
                  Kurye Ücreti {adminSortHeader === 'fee' && (adminSortDir === 'asc' ? '▲' : '▼')}
                </th>
                <th className="text-end">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAdminRests.length > 0 ? (
                paginatedAdminRests.map((r) => (
                  <tr key={r.id} className="text-dark">
                    <td>#{r.id}</td>
                    <td>
                      <img
                        src={r.image}
                        alt={r.name}
                        className="rounded"
                        style={{ width: '45px', height: '40px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>
                      <strong className="text-dark">{r.name}</strong>
                    </td>
                    <td>
                      <span className="badge bg-secondary text-white text-capitalize">{r.type}</span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">{r.cuisine}</span>
                    </td>
                    <td>
                      <span className="text-warning">
                        <i className="bi bi-star-fill me-1"></i>
                        {r.rating}
                      </span>
                    </td>
                    <td>{r.minBasket} TL</td>
                    <td>{r.fee === 0 ? 'Ücretsiz' : `${r.fee} TL`}</td>
                    <td className="text-end">
                      <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={() => handleDeleteRestaurant(r.id)}>
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-muted py-4">
                    İşletme bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
          <span className="small text-secondary">
            Toplam {sortedAdminRests.length} işletmeden {(adminPage - 1) * adminPageSize + 1} -{' '}
            {Math.min(adminPage * adminPageSize, sortedAdminRests.length)} arası gösteriliyor.
          </span>

          <nav>
            <ul className="pagination pagination-sm m-0">
              <li className={`page-item ${adminPage === 1 ? 'disabled' : ''}`}>
                <button type="button" className="page-link rounded-start-pill" onClick={() => setAdminPage((prev) => Math.max(1, prev - 1))}>
                  Önceki
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${adminPage === i + 1 ? 'active' : ''}`}>
                  <button type="button" className="page-link" onClick={() => setAdminPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${adminPage === totalPages ? 'disabled' : ''}`}>
                <button type="button" className="page-link rounded-end-pill" onClick={() => setAdminPage((prev) => Math.min(totalPages, prev + 1))}>
                  Sonraki
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-5 mb-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
            <h4 className="fw-bold mb-4 text-dark">
              <i className="bi bi-ticket-perforated text-hz-primary me-2"></i> İndirim Kuponu Yönetimi
            </h4>

            <form onSubmit={handleAddCoupon} className="mb-4 p-3 border rounded-4 bg-light">
              <h6 className="fw-bold mb-3 text-dark">Yeni Kupon Oluştur</h6>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small text-secondary fw-bold">Kupon Kodu</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="YEMEK50"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-secondary fw-bold">Tür</label>
                  <select className="form-select form-select-sm" value={newCouponType} onChange={(e) => setNewCouponType(e.target.value)}>
                    <option value="percent">% Yüzde İndirimi</option>
                    <option value="flat">TL Sabit İndirim</option>
                    <option value="free-delivery">Bedava Teslimat</option>
                  </select>
                </div>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small text-secondary fw-bold">Değer</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-secondary fw-bold">Min. Sepet</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-hz-primary btn-sm w-100 rounded-3 fw-bold animate-hover">
                Kupon Ekle
              </button>
            </form>

            <div className="table-responsive" style={{ maxHeight: '250px' }}>
              <table className="table table-hover align-middle table-sm">
                <thead>
                  <tr className="text-secondary">
                    <th>Kod</th>
                    <th>Değer</th>
                    <th>Min. Sepet</th>
                    <th className="text-end">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id} className="text-dark">
                      <td>
                        <strong className="text-hz-primary">{c.code}</strong>
                      </td>
                      <td>
                        {c.type === 'percent'
                          ? `%${c.value}`
                          : c.type === 'free-delivery'
                          ? 'Bedava Kurye'
                          : `${c.value} TL`}
                      </td>
                      <td>{c.minAmount} TL</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-xs border-0 p-1"
                          onClick={() => handleDeleteCoupon(c.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-7 mb-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
            <h4 className="fw-bold mb-4 text-dark">
              <i className="bi bi-clipboard-data text-hz-primary me-2"></i> Tüm Platform Siparişleri
            </h4>

            <div className="table-responsive" style={{ maxHeight: '430px' }}>
              <table className="table table-hover align-middle">
                <thead>
                  <tr className="text-secondary">
                    <th>Sipariş ID</th>
                    <th>İşletme</th>
                    <th>Tutar</th>
                    <th>Durum</th>
                    <th>Ödeme Yöntemi</th>
                    <th>Zaman</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="text-dark">
                      <td>#{o.id}</td>
                      <td>
                        <strong>{o.restaurantName}</strong>
                      </td>
                      <td>{o.total} TL</td>
                      <td>
                        <span className={`badge ${o.status === 'Teslim Edildi' ? 'bg-success' : 'bg-warning'} px-2 py-1`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="small text-muted">{renderPaymentMethodText(o.paymentMethod)}</td>
                      <td>{o.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
