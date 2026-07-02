import React from 'react';

export default function CustomerView({
  activeView,
  setActiveView,
  activePortal,
  setActivePortal,
  selectedCategoryTag,
  setSelectedCategoryTag,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  currentRestaurant,
  setCurrentRestaurant,
  getFilteredRestaurants,
  getPortalCategoryTags,
  renderCuisineIcon,
  openCustomizer,
  setCouponInput,
  applyPromoCoupon,
  setShowCartDrawer
}) {
  // VIEW A: HOME / LISTINGS
  if (activeView === 'home') {
    return (
      <div>
        {/* Promo Coupon copy bar */}
        <div className="slider-banner p-4 mb-4 shadow-sm">
          <div className="row align-items-center">
            <div className="col-md-8 text-white">
              <span className="badge bg-white text-hz-primary fw-bold px-3 py-2 mb-2 rounded-pill">%25 İNDİRİM FIRSATI</span>
              <h2 className="fw-bold mb-2">HızlıSepet ile Lezzet Kapında!</h2>
              <p className="mb-0">İlk siparişinde indirimli fiyatlarla alışveriş yapmanın keyfini çıkar.</p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <div className="bg-white text-dark d-inline-flex align-items-center gap-2 p-2 rounded-3 shadow">
                <span className="font-monospace fw-bold px-2 text-hz-primary">YEMEK25</span>
                <button
                  className="btn btn-hz-primary btn-sm rounded-2"
                  onClick={() => {
                    setCouponInput('YEMEK25');
                    applyPromoCoupon();
                    setShowCartDrawer(true);
                  }}
                >
                  Kodu Uygula
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subcategory selectors */}
        <div className="d-flex border-bottom mb-4">
          <div
            className={`category-tab ${activePortal === 'yemek' ? 'active' : ''}`}
            onClick={() => setActivePortal('yemek')}
          >
            <i className="bi bi-egg-fried me-2"></i> Yemek
          </div>
          <div
            className={`category-tab ${activePortal === 'market' ? 'active' : ''}`}
            onClick={() => setActivePortal('market')}
          >
            <i className="bi bi-cart4 me-2"></i> Market
          </div>
          <div
            className={`category-tab ${activePortal === 'mahalle' ? 'active' : ''}`}
            onClick={() => setActivePortal('mahalle')}
          >
            <i className="bi bi-shop me-2"></i> Mahalle
          </div>
        </div>

        {/* Cuisine / Category selector pills */}
        <div className="d-flex gap-2 overflow-x-auto pb-3 mb-4">
          {getPortalCategoryTags().map((tag) => (
            <button
              key={tag}
              className={`btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 text-nowrap ${
                selectedCategoryTag === tag ? 'btn-hz-primary' : 'btn-white border'
              }`}
              onClick={() => setSelectedCategoryTag(tag)}
            >
              <span>{renderCuisineIcon(tag)}</span> {tag}
            </button>
          ))}
        </div>

        {/* Filter and sorting control bar */}
        <div className="row align-items-center justify-content-between mb-4 gap-3">
          <div className="col-md-4">
            <div className="input-group bg-white rounded-pill border overflow-hidden px-2 py-1 shadow-sm">
              <span className="input-group-text bg-transparent border-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none bg-transparent"
                placeholder="Restoran, market veya dükkan ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4 d-flex align-items-center justify-content-md-end gap-2">
            <span className="text-secondary small fw-bold text-nowrap">
              <i className="bi bi-sort-down"></i> Sıralama:
            </span>
            <select
              className="form-select border rounded-pill shadow-sm py-1.5"
              style={{ maxWidth: '200px' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">Puan (Yüksekten Düşüğe)</option>
              <option value="duration">Teslimat Süresi (Hızlı)</option>
              <option value="minBasket">Min. Sepet Tutarı (Düşük)</option>
            </select>
          </div>
        </div>

        {/* Restaurants Grid List */}
        <div className="row">
          {getFilteredRestaurants().length > 0 ? (
            getFilteredRestaurants().map((restaurant) => (
              <div
                key={restaurant.id}
                className="col-lg-4 col-md-6 mb-4"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setCurrentRestaurant(restaurant);
                  setActiveView('menu');
                }}
              >
                <div className="card premium-card h-100">
                  <div className="position-relative">
                    <img
                      src={restaurant.image}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                      alt={restaurant.name}
                    />
                    {restaurant.fee === 0 && (
                      <span className="position-absolute top-0 start-0 m-3 badge bg-hz-primary px-3 py-2 rounded-2 shadow">
                        Ücretsiz Teslimat
                      </span>
                    )}
                  </div>
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title fw-bold text-dark m-0">{restaurant.name}</h5>
                      <span className="badge bg-hz-primary-light text-hz-primary fw-bold px-2 py-1 rounded-2">
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        {restaurant.rating}
                      </span>
                    </div>
                    <p className="card-text text-secondary mb-3 small">{restaurant.cuisine} • İstanbul</p>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between text-muted small mt-2">
                      <span>
                        <i className="bi bi-clock me-1"></i> {restaurant.duration} dk
                      </span>
                      <span>
                        <i className="bi bi-wallet2 me-1"></i> Min. {restaurant.minBasket} TL
                      </span>
                      <span>
                        <i className="bi bi-truck me-1"></i> {restaurant.fee === 0 ? 'Bedava' : `${restaurant.fee} TL`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 w-100">
              <i className="bi bi-search text-muted display-1"></i>
              <h4 className="mt-3">Aramanızla eşleşen sonuç bulunamadı.</h4>
              <p className="text-muted">Farklı bir kategori seçebilir veya aramayı temizleyebilirsiniz.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // VIEW B: RESTAURANT DETAIL & MENU LIST
  if (activeView === 'menu' && currentRestaurant) {
    return (
      <div>
        <button className="btn btn-outline-secondary rounded-pill mb-4" onClick={() => setActiveView('home')}>
          <i className="bi bi-arrow-left me-1"></i> Geri Dön
        </button>

        {/* Detail Cover Card */}
        <div className="card mb-4 border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={currentRestaurant.image}
                className="img-fluid w-100 h-100"
                style={{ objectFit: 'cover', minHeight: '220px' }}
                alt={currentRestaurant.name}
              />
            </div>
            <div className="col-md-8 d-flex align-items-center">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <h2 className="card-title fw-bold m-0">{currentRestaurant.name}</h2>
                  <span className="badge bg-hz-primary-light text-hz-primary fw-bold px-2 py-1 rounded-2">
                    <i className="bi bi-star-fill text-warning me-1"></i>
                    {currentRestaurant.rating}
                  </span>
                </div>
                <p className="text-muted mb-3">{currentRestaurant.cuisine} • HızlıSepet kalitesiyle kapınızda</p>
                <div className="d-flex flex-wrap gap-4 text-secondary small">
                  <div>
                    <i className="bi bi-wallet2 me-1"></i> Min. Sepet: <strong>{currentRestaurant.minBasket} TL</strong>
                  </div>
                  <div>
                    <i className="bi bi-truck me-1"></i> Teslimat:{' '}
                    <strong>{currentRestaurant.fee === 0 ? 'Ücretsiz' : `${currentRestaurant.fee} TL`}</strong>
                  </div>
                  <div>
                    <i className="bi bi-clock me-1"></i> Süre: <strong>{currentRestaurant.duration} dk</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grouped Products list */}
        <h3 className="fw-bold mb-4">Ürünler</h3>

        <div className="row">
          {currentRestaurant.menuItems && currentRestaurant.menuItems.length > 0 ? (
            Object.entries(
              currentRestaurant.menuItems.reduce((acc, item) => {
                acc[item.category] = acc[item.category] || [];
                acc[item.category].push(item);
                return acc;
              }, {})
            ).map(([category, items]) => (
              <div key={category} className="col-12 mb-4">
                <h5 className="fw-bold border-bottom pb-2 mb-3 text-secondary">{category}</h5>
                <div className="row">
                  {items.map((item) => (
                    <div key={item.id} className="col-md-6 mb-3">
                      <div className="card h-100 border-0 shadow-sm p-3 rounded-4">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="pe-3">
                            <h6 className="fw-bold mb-1">{item.name}</h6>
                            <p className="text-muted small mb-2">{item.description}</p>
                            <h6 className="text-hz-primary fw-bold mb-0">{item.price} TL</h6>
                          </div>
                          <button
                            className="btn btn-hz-primary rounded-circle p-2 d-flex align-items-center justify-content-center animate-hover"
                            style={{ width: '40px', height: '40px' }}
                            onClick={() => openCustomizer(item)}
                          >
                            <i className="bi bi-plus-lg fs-6"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 w-100">
              <p className="text-muted">Bu mağazaya ait ürün bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
