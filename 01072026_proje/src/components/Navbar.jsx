import { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const { getCartItemCount, user, logoutUser } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/catalog?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-custom" id="nav-section">
      <div className="container">
        <Link className="navbar-brand font-title fw-bold text-khaki-dark fs-3" to="/" id="link-brand-logo">
          Elegant<span className="text-khaki">Cart</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation" id="btn-navbar-toggler">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active' : ''}`} to="/" id="link-nav-home">
                Ana Sayfa
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active' : ''}`} to="/catalog" id="link-nav-catalog">
                Mağaza
              </NavLink>
            </li>
          </ul>
          
          {/* Arama Çubuğu */}
          <form className="d-flex me-lg-3 my-2 my-lg-0" onSubmit={handleSearchSubmit} id="form-global-search">
            <div className="input-group">
              <input 
                className="form-control form-control-custom" 
                type="search" 
                placeholder="Ürün ara..." 
                aria-label="Search" 
                id="input-global-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline-khaki" type="submit" id="btn-global-search">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>
          
          {/* Kullanıcı Giriş & Çıkış Menüsü ve Sepet */}
          <div className="d-flex align-items-center gap-3">
            
            {user ? (
              <div className="d-flex align-items-center gap-2" id="navbar-user-info">
                <span className="small text-khaki-dark fw-semibold d-none d-sm-inline">
                  <i className="bi bi-person-fill text-khaki me-1"></i> Merhaba, {user.firstname}
                </span>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-danger px-2 py-1" 
                  id="btn-nav-logout"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right"></i> <span className="d-none d-md-inline">Çıkış</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline-khaki px-3 d-flex align-items-center gap-1" id="btn-nav-login">
                <i className="bi bi-person"></i> <span className="d-none d-sm-inline">Giriş Yap</span>
              </Link>
            )}
            
            <Link to="/cart" className="btn btn-khaki position-relative d-flex align-items-center justify-content-center" id="btn-nav-cart">
              <i className="bi bi-bag"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-khaki shadow" id="badge-nav-cart-count">
                {getCartItemCount()}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
