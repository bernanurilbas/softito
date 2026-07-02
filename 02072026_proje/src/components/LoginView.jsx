import React from 'react';

export default function LoginView({
  isRegisterMode,
  setIsRegisterMode,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  authError,
  setAuthError,
  handleLogin,
  handleRegister,
  regName,
  setRegName,
  regEmail,
  setRegEmail,
  regPassword,
  setRegPassword,
  regRole,
  setRegRole,
  regRestName,
  setRegRestName,
  regRestCuisine,
  setRegRestCuisine,
  quickFill
}) {
  return (
    <div className="row justify-content-center align-items-center auth-wrapper py-5">
      <div className="col-md-6 col-lg-5">
        <div className="card auth-card p-4">
          {!isRegisterMode ? (
            /* LOGIN PANEL */
            <div>
              <h3 className="text-center fw-bold mb-4">Giriş Yap</h3>
              {authError && <div className="alert alert-danger p-2 small">{authError}</div>}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">E-Posta Adresi</label>
                  <input
                    type="email"
                    className="form-control"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="ornek@hizlisepet.com"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-secondary small fw-bold">Şifre</label>
                  <input
                    type="password"
                    className="form-control"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="•••••"
                  />
                </div>
                <button type="submit" className="btn btn-hz-primary w-100 py-2.5 rounded-3 fw-bold mb-3">
                  Devam Et
                </button>
              </form>

              <div className="text-center mb-3">
                <span className="text-muted small">Hesabınız yok mu? </span>
                <button
                  className="btn btn-link text-hz-primary btn-sm fw-bold p-0 border-0"
                  onClick={() => {
                    setAuthError('');
                    setIsRegisterMode(true);
                  }}
                >
                  Kayıt Ol
                </button>
              </div>
            </div>
          ) : (
            /* REGISTRATION PANEL */
            <div>
              <h3 className="text-center fw-bold mb-4">Kayıt Ol</h3>
              {authError && <div className="alert alert-danger p-2 small">{authError}</div>}

              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Ad Soyad</label>
                  <input
                    type="text"
                    className="form-control"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    placeholder="Ahmet Yılmaz"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">E-Posta Adresi</label>
                  <input
                    type="email"
                    className="form-control"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    placeholder="ornek@hizlisepet.com"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Şifre</label>
                  <input
                    type="password"
                    className="form-control"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    placeholder="••••••"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold d-block">Hesap Türü</label>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 ${regRole === 'customer' ? 'btn-hz-primary' : 'btn-light border'}`}
                      onClick={() => setRegRole('customer')}
                    >
                      Müşteri
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 ${regRole === 'merchant' ? 'btn-hz-primary' : 'btn-light border'}`}
                      onClick={() => setRegRole('merchant')}
                    >
                      İşletme sahibi
                    </button>
                  </div>
                </div>

                {regRole === 'merchant' && (
                  <div className="p-3 border rounded-3 mb-4 bg-light">
                    <h6 className="fw-bold text-dark small mb-3">Restoran / Dükkan Bilgileri</h6>
                    <div className="mb-2">
                      <label className="form-label text-secondary small fw-bold">Dükkan Adı</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={regRestName}
                        onChange={(e) => setRegRestName(e.target.value)}
                        required
                        placeholder="Örn: Lezzet Lokantası"
                      />
                    </div>
                    <div>
                      <label className="form-label text-secondary small fw-bold">Dükkan Kategorisi</label>
                      <select
                        className="form-select form-select-sm"
                        value={regRestCuisine}
                        onChange={(e) => setRegRestCuisine(e.target.value)}
                      >
                        <option value="Burger">Burger</option>
                        <option value="Pizza">Pizza</option>
                        <option value="Kebap">Kebap / Döner</option>
                        <option value="Tatlı">Tatlı</option>
                        <option value="Süpermarket">Süpermarket / Market</option>
                      </select>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn btn-hz-primary w-100 py-2.5 rounded-3 fw-bold mb-3">
                  Hesap Oluştur
                </button>
              </form>

              <div className="text-center mb-3">
                <span className="text-muted small">Zaten hesabınız var mı? </span>
                <button
                  className="btn btn-link text-hz-primary btn-sm fw-bold p-0 border-0"
                  onClick={() => {
                    setAuthError('');
                    setIsRegisterMode(false);
                  }}
                >
                  Giriş Yap
                </button>
              </div>
            </div>
          )}

          <hr />

          <div className="text-center">
            <p className="text-muted small mb-2 fw-semibold">Geliştirici Hızlı Giriş Paneli</p>
            <div className="d-flex flex-column gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  quickFill('customer');
                }}
              >
                🧑‍💼 Müşteri Olarak Giriş Yap
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  quickFill('merchant');
                }}
              >
                🏪 Burger Hub (İşletme) Olarak Giriş Yap
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  quickFill('admin');
                }}
              >
                🛡️ Platform Yöneticisi (Admin) Olarak Giriş Yap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
