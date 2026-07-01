import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-auto" id="section-footer" style={{ backgroundColor: 'var(--primary-dark) !important' }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h4 className="font-title fw-bold text-white mb-3">Elegant<span className="text-khaki">Cart</span></h4>
            <p className="text-white-50 small mb-3">Doğanın zarafetini ve el yapımı zanaatkarlığı bir araya getiren premium alışveriş platformu. Sürdürülebilir, adil ticaret odaklı, doğal yaşam alanı.</p>
            <div className="d-flex gap-2">
              <a href="javascript:void(0)" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }} id="social-link-instagram"><i className="bi bi-instagram"></i></a>
              <a href="javascript:void(0)" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }} id="social-link-pinterest"><i className="bi bi-pinterest"></i></a>
              <a href="javascript:void(0)" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }} id="social-link-facebook"><i className="bi bi-facebook"></i></a>
            </div>
          </div>
          <div className="col-lg-2 col-md-6">
            <h5 className="font-title fw-semibold text-white mb-3">Hızlı Linkler</h5>
            <ul className="list-unstyled text-white-50 small d-flex flex-column gap-2">
              <li><Link to="/" className="text-white-50 text-decoration-none hover-light" id="footer-link-home">Ana Sayfa</Link></li>
              <li><Link to="/catalog" className="text-white-50 text-decoration-none hover-light" id="footer-link-catalog">Mağaza / Ürünler</Link></li>
              <li><Link to="/cart" className="text-white-50 text-decoration-none hover-light" id="footer-link-cart">Sepetim</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5 className="font-title fw-semibold text-white mb-3">Yardım & Destek</h5>
            <ul className="list-unstyled text-white-50 small d-flex flex-column gap-2">
              <li><a href="javascript:void(0)" className="text-white-50 text-decoration-none" id="footer-link-faq">Sıkça Sorulan Sorular</a></li>
              <li><a href="javascript:void(0)" className="text-white-50 text-decoration-none" id="footer-link-shipping">Teslimat & İade Politikası</a></li>
              <li><a href="javascript:void(0)" className="text-white-50 text-decoration-none" id="footer-link-kvkk">Gizlilik ve KVKK Politikası</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5 className="font-title fw-semibold text-white mb-3">İletişim</h5>
            <ul className="list-unstyled text-white-50 small d-flex flex-column gap-2">
              <li><i className="bi bi-geo-alt me-2"></i> Levent, İstanbul, Türkiye</li>
              <li><i className="bi bi-telephone me-2"></i> +90 (212) 555 43 21</li>
              <li><i className="bi bi-envelope me-2"></i> destek@elegantcart.com</li>
            </ul>
          </div>
        </div>
        <hr className="my-4 border-light-subtle" />
        <div className="d-flex flex-column flex-sm-row justify-content-between text-white-50 small">
          <p className="mb-0">© 2026 ElegantCart. Tüm Hakları Saklıdır.</p>
          <p className="mb-0">Design with 🤎 & Bootstrap</p>
        </div>
      </div>
    </footer>
  );
}
