import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Login() {
  const { loginUser } = useContext(CartContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setErrorMsg('');

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      const result = loginUser(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setErrorMsg(result.message);
      }
    }
    setValidated(true);
  };

  return (
    <div className="login-bg" id="container-login-page">
      <div className="container text-start">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none" id="link-brand-logo-login">
                <h1 className="display-6 font-title fw-bold text-white mb-0">Elegant<span className="text-khaki">Cart</span></h1>
                <p className="text-white-50 small">Doğal ve Premium Yaşam Tarzı</p>
              </Link>
            </div>

            {/* Glassmorphic Login Card */}
            <div className="card border-0 glass-card p-4 p-md-5">
              <h3 className="card-title text-center mb-4 font-title text-khaki-dark">Giriş Yap</h3>

              {errorMsg && (
                <div className="alert alert-danger py-2 small mb-3" id="alert-login-error">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i> {errorMsg}
                </div>
              )}
              
              <form id="form-login" className={`needs-validation ${validated ? 'was-validated' : ''}`} noValidate onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label htmlFor="input-login-email" className="form-label fw-semibold text-khaki-dark">E-Posta Adresi</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0 text-muted"><i className="bi bi-envelope"></i></span>
                    <input 
                      type="email" 
                      className="form-control form-control-custom border-start-0" 
                      id="input-login-email" 
                      required 
                      placeholder="örnek@eposta.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="invalid-feedback">Lütfen geçerli bir e-posta adresi giriniz.</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <label htmlFor="input-login-password" className="form-label fw-semibold text-khaki-dark mb-0">Şifre</label>
                    <a href="javascript:void(0)" className="text-decoration-none small text-khaki" id="link-forgot-password">Şifremi Unuttum</a>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0 text-muted"><i className="bi bi-lock"></i></span>
                    <input 
                      type="password" 
                      className="form-control form-control-custom border-start-0" 
                      id="input-login-password" 
                      required 
                      placeholder="••••••••" 
                      minLength="6"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="invalid-feedback">Şifreniz en az 6 karakter olmalıdır.</div>
                  </div>
                </div>

                <div className="mb-3 p-2 bg-light rounded text-muted border" style={{ fontSize: '0.8rem' }} id="box-demo-credentials">
                  <i className="bi bi-info-circle-fill text-khaki me-1"></i>
                  <strong>Test Kullanıcı Girişi:</strong><br />
                  E-Posta: <code className="text-dark">demo@demo.com</code><br />
                  Şifre: <code className="text-dark">password123</code>
                </div>
                
                <div className="mb-4 d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="check-remember-me" />
                    <label className="form-check-label text-muted small" htmlFor="check-remember-me">Beni Hatırla</label>
                  </div>
                </div>
                
                <button type="submit" className="btn btn-khaki w-100 py-2.5 mb-3" id="btn-login-submit">
                  Giriş Yap <i className="bi bi-box-arrow-in-right ms-1"></i>
                </button>
              </form>
              
              <div className="text-center mt-3">
                <span className="text-muted small">Henüz bir hesabınız yok mu?</span>
                <Link to="/register" className="text-decoration-none small text-khaki fw-semibold ms-1" id="link-go-to-register">Kayıt Olun</Link>
              </div>
              
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
