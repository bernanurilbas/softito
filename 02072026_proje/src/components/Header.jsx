import React from 'react';

export default function Header({
  currentUser,
  activeView,
  setActiveView,
  selectedAddress,
  addressDialogRef,
  setShowAddressModal,
  darkMode,
  toggleDarkMode,
  showRoleDropdown,
  setShowRoleDropdown,
  quickSwitchRole,
  cart,
  setShowCartDrawer,
  handleLogout,
  setIsRegisterMode
}) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top glass-nav px-md-5 px-3 py-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <a
          className="navbar-brand d-flex align-items-center text-hz-primary fw-bolder fs-2 m-0"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentUser?.role === 'customer' || !currentUser) {
              setActiveView('home');
            }
          }}
        >
          <span className="bg-hz-primary text-white px-2 py-1 rounded-3 me-2 fs-4">
            <i className="bi bi-bicycle"></i>
          </span>
          hızlısepet
        </a>

        {/* User Address Tracker (only for customers) */}
        {(!currentUser || currentUser?.role === 'customer') && (
          <div
            className="d-none d-md-flex align-items-center bg-light border rounded-pill px-3 py-2 ms-4 flex-grow-1"
            style={{ maxWidth: '450px', cursor: 'pointer' }}
            onClick={() => {
              setShowAddressModal(true);
              addressDialogRef.current?.showModal();
            }}
          >
            <i className="bi bi-geo-alt-fill text-hz-primary me-2 fs-5"></i>
            <span className="text-truncate fw-semibold" style={{ maxWidth: '350px' }}>
              {selectedAddress ? `[${selectedAddress.title}] ${selectedAddress.addressText}` : 'Teslimat Adresi Seçin...'}
            </span>
            <i className="bi bi-chevron-down text-muted ms-auto"></i>
          </div>
        )}

        <div className="d-flex align-items-center gap-3">
          {/* QUICK ROLE SWITCHER FOR TESTING */}
          <div className="position-relative">
            <button
              className="btn btn-sm btn-outline-warning rounded-pill px-3 fw-bold py-1.5"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              🧪 Rol: {currentUser ? (currentUser.role === 'customer' ? 'Müşteri' : currentUser.role === 'merchant' ? 'İşletme' : 'Admin') : 'Giriş Yok'} <i className="bi bi-chevron-down ms-1"></i>
            </button>
            {showRoleDropdown && (
              <div
                className="position-absolute bg-white text-dark shadow border rounded-3 p-2 mt-2 end-0 text-start"
                style={{ zIndex: 1100, minWidth: '200px' }}
              >
                <h6 className="px-2.5 py-1.5 mb-1 small fw-bold text-uppercase text-muted border-bottom" style={{ fontSize: '10px' }}>
                  Hızlı Rol Değiştir
                </h6>
                <button
                  type="button"
                  className="dropdown-item rounded text-start w-100 py-2 px-2.5 border-0 bg-transparent text-dark small fw-semibold d-block"
                  onClick={() => {
                    quickSwitchRole('customer');
                    setShowRoleDropdown(false);
                  }}
                >
                  🧑‍💼 Müşteri Modu
                </button>
                <button
                  type="button"
                  className="dropdown-item rounded text-start w-100 py-2 px-2.5 border-0 bg-transparent text-dark small fw-semibold d-block"
                  onClick={() => {
                    quickSwitchRole('merchant');
                    setShowRoleDropdown(false);
                  }}
                >
                  🏪 İşletme (Burger Hub)
                </button>
                <button
                  type="button"
                  className="dropdown-item rounded text-start w-100 py-2 px-2.5 border-0 bg-transparent text-dark small fw-semibold d-block"
                  onClick={() => {
                    quickSwitchRole('admin');
                    setShowRoleDropdown(false);
                  }}
                >
                  🛡️ Platform Yöneticisi (Admin)
                </button>
              </div>
            )}
          </div>

          {/* DARK MODE TOGGLE BUTTON */}
          <button className="theme-switch-btn" onClick={toggleDarkMode} title={darkMode ? 'Aydınlık Mod' : 'Karanlık Mod'}>
            {darkMode ? <i className="bi bi-sun-fill text-warning fs-5"></i> : <i className="bi bi-moon-fill text-secondary fs-5"></i>}
          </button>

          {currentUser ? (
            <div className="d-flex align-items-center gap-3">
              <span className="d-none d-sm-inline text-muted small fw-semibold">
                Hoş geldiniz, <span className="text-hz-primary">{currentUser.name}</span>
              </span>

              {currentUser.role !== 'customer' && (
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setActiveView('dashboard')}>
                  <i className="bi bi-speedometer2 me-1"></i> Panel
                </button>
              )}

              {currentUser.role === 'customer' && (
                <>
                  <button className="btn btn-outline-secondary px-3 py-2 rounded-pill" onClick={() => setActiveView('orders')}>
                    <i className="bi bi-clock-history me-1"></i> Siparişlerim
                  </button>

                  <button className="btn btn-hz-primary px-3 py-2 rounded-pill position-relative" onClick={() => setShowCartDrawer(true)}>
                    <i className="bi bi-cart3 me-1"></i> Sepet
                    {cart.items.length > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-hz-primary border border-light">
                        {cart.items.reduce((sum, i) => sum + i.qty, 0)}
                      </span>
                    )}
                  </button>
                </>
              )}

              <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={handleLogout}>
                Çıkış Yap <i className="bi bi-box-arrow-right ms-1"></i>
              </button>
            </div>
          ) : (
            <button
              className="btn btn-hz-primary px-4 py-2 rounded-pill"
              onClick={() => {
                setIsRegisterMode(false);
                setActiveView('login');
              }}
            >
              <i className="bi bi-person-fill me-1"></i> Giriş Yap
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
