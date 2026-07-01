import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Register() {
  const { registerUser } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [validated, setValidated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setErrorMsg('');

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      if (formData.password !== formData.confirmPassword) {
        setErrorMsg('Şifreler birbiriyle uyuşmuyor!');
        return;
      }

      const result = registerUser({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        navigate('/login');
      } else {
        setErrorMsg(result.message);
      }
    }
    setValidated(true);
  };

  return (
    <div className="login-bg" id="container-register-page">
      <div className="container text-start">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">

            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none" id="link-brand-logo-register">
                <h1 className="display-6 font-title fw-bold text-white mb-0">Elegant<span className="text-khaki">Cart</span></h1>
                <p className="text-white-50 small">Doğal ve Premium Yaşam Tarzı</p>
              </Link>
            </div>

            {/* Glassmorphic Register Card */}
            <div className="card border-0 glass-card p-4 p-md-5">
              <h3 className="card-title text-center mb-4 font-title text-khaki-dark">Kayıt Ol</h3>

              {errorMsg && (
                <div className="alert alert-danger py-2 small mb-3" id="alert-register-error">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i> {errorMsg}
                </div>
              )}

              <form id="form-register" className={`needs-validation ${validated ? 'was-validated' : ''}`} noValidate onSubmit={handleFormSubmit}>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="input-register-firstname" className="form-label fw-semibold text-khaki-dark">Ad</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      id="input-register-firstname"
                      required
                      placeholder="Ahmet"
                      value={formData.firstname}
                      onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    />
                    <div className="invalid-feedback">Lütfen adınızı giriniz.</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="input-register-lastname" className="form-label fw-semibold text-khaki-dark">Soyad</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      id="input-register-lastname"
                      required
                      placeholder="Yılmaz"
                      value={formData.lastname}
                      onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    />
                    <div className="invalid-feedback">Lütfen soyadınızı giriniz.</div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="input-register-email" className="form-label fw-semibold text-khaki-dark">E-Posta Adresi</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0 text-muted"><i className="bi bi-envelope"></i></span>
                    <input
                      type="email"
                      className="form-control form-control-custom border-start-0"
                      id="input-register-email"
                      required
                      placeholder="örnek@eposta.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <div className="invalid-feedback">Lütfen geçerli bir e-posta adresi giriniz.</div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="input-register-password" className="form-label fw-semibold text-khaki-dark">Şifre</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0 text-muted"><i className="bi bi-lock"></i></span>
                      <input
                        type="password"
                        className="form-control form-control-custom border-start-0"
                        id="input-register-password"
                        required
                        placeholder="••••••••"
                        minLength="6"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <div className="invalid-feedback">En az 6 karakter olmalıdır.</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <label htmlFor="input-register-confirm-password" className="form-label fw-semibold text-khaki-dark">Şifre Tekrarı</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0 text-muted"><i className="bi bi-lock-fill"></i></span>
                      <input
                        type="password"
                        className="form-control form-control-custom border-start-0"
                        id="input-register-confirm-password"
                        required
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                      <div className="invalid-feedback">Lütfen şifrenizi tekrar giriniz.</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="check-terms-agree"
                      required
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    />
                    <label className="form-check-label text-muted small" htmlFor="check-terms-agree">
                      <a href="javascript:void(0)" className="text-khaki text-decoration-none" id="link-terms-conditions">Kullanım Koşullarını</a> ve <a href="javascript:void(0)" className="text-khaki text-decoration-none" id="link-privacy-policy">Gizlilik Politikası</a>'nı kabul ediyorum.
                    </label>
                    <div className="invalid-feedback">Kayıt olmak için kullanım koşullarını onaylamalısınız.</div>
                  </div>
                </div>

                <button type="submit" className="btn btn-khaki w-100 py-2.5 mb-3" id="btn-register-submit">
                  Hesap Oluştur <i className="bi bi-person-plus ms-1"></i>
                </button>
              </form>

              <div className="text-center mt-3">
                <span className="text-muted small">Zaten bir hesabınız var mı?</span>
                <Link to="/login" className="text-decoration-none small text-khaki fw-semibold ms-1" id="link-go-to-login">Giriş Yapın</Link>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
