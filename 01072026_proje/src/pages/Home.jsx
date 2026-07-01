import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { productsData } from '../data/products';
import { CartContext } from '../context/CartContext';

export default function Home() {
  const { addToCart } = useContext(CartContext);
  const [activeSlide, setActiveSlide] = useState(0);

  // Automatic Carousel rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = productsData.slice(0, 3);

  return (
    <div id="home-page-container">
      {/* Kahraman Bölümü (Slider) */}
      <header id="carousel-hero-section">
        <div id="heroCarousel" className="carousel slide carousel-fade">
          <div className="carousel-indicators">
            <button 
              type="button" 
              className={activeSlide === 0 ? 'active' : ''} 
              aria-current={activeSlide === 0 ? 'true' : 'false'}
              onClick={() => setActiveSlide(0)}
              id="btn-indicator-1"
            ></button>
            <button 
              type="button" 
              className={activeSlide === 1 ? 'active' : ''} 
              aria-current={activeSlide === 1 ? 'true' : 'false'}
              onClick={() => setActiveSlide(1)}
              id="btn-indicator-2"
            ></button>
          </div>
          <div className="carousel-inner">
            {/* Slide 1 */}
            <div className={`carousel-item ${activeSlide === 0 ? 'active' : ''}`} style={{ height: '520px', backgroundColor: 'var(--bg-sec)', display: activeSlide === 0 ? 'block' : 'none' }}>
              <div className="container h-100">
                <div className="row align-items-center h-100">
                  <div className="col-lg-6 order-2 order-lg-1 text-center text-lg-start">
                    <span className="text-uppercase tracking-wider fw-bold text-khaki mb-2 d-inline-block">Doğal ve Sürdürülebilir</span>
                    <h1 className="display-4 fw-bold font-title text-khaki-dark mb-3">Zarafeti Üzerinizde Hissedin</h1>
                    <p className="lead text-muted mb-4">Tamamen doğal keten liflerinden üretilmiş, yumuşak tonlarda keten giysilerle kendinizi doğanın kollarına bırakın.</p>
                    <Link to="/catalog" className="btn btn-khaki py-2.5 px-4" id="btn-hero-shop-1">Koleksiyonu Keşfet <i className="bi bi-arrow-right ms-1"></i></Link>
                  </div>
                  <div className="col-lg-6 order-1 order-lg-2 h-100 d-flex align-items-center justify-content-center p-3">
                    <img src="/assets/img/hero_1.png" alt="Doğal keten giyim koleksiyonu" className="rounded-4 shadow-sm w-100 h-100 object-fit-cover" style={{ maxHeight: '420px', objectPosition: 'center' }} />
                  </div>
                </div>
              </div>
            </div>
            {/* Slide 2 */}
            <div className={`carousel-item ${activeSlide === 1 ? 'active' : ''}`} style={{ height: '520px', backgroundColor: 'var(--bg-sec)', display: activeSlide === 1 ? 'block' : 'none' }}>
              <div className="container h-100">
                <div className="row align-items-center h-100">
                  <div className="col-lg-6 order-2 order-lg-1 text-center text-lg-start">
                    <span className="text-uppercase tracking-wider fw-bold text-khaki mb-2 d-inline-block">El Yapımı Sanat</span>
                    <h1 className="display-4 fw-bold font-title text-khaki-dark mb-3">Evinize Toprak Sıcaklığı Katın</h1>
                    <p className="lead text-muted mb-4">Usta eller tarafından şekillendirilmiş, doğal seramik sofra takımlarıyla her yemeği bir ritüele dönüştürün.</p>
                    <Link to="/catalog" className="btn btn-earth py-2.5 px-4" id="btn-hero-shop-2">Seramikleri İncele <i className="bi bi-arrow-right ms-1"></i></Link>
                  </div>
                  <div className="col-lg-6 order-1 order-lg-2 h-100 d-flex align-items-center justify-content-center p-3">
                    <img src="/assets/img/hero_2.png" alt="Artizan seramik mutfak ürünleri" className="rounded-4 shadow-sm w-100 h-100 object-fit-cover" style={{ maxHeight: '420px', objectPosition: 'center' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" onClick={() => setActiveSlide((prev) => (prev === 0 ? 1 : 0))} id="btn-carousel-prev">
            <span className="carousel-control-prev-icon bg-khaki-dark p-3 rounded-circle" aria-hidden="true"></span>
            <span className="visually-hidden">Önceki</span>
          </button>
          <button className="carousel-control-next" type="button" onClick={() => setActiveSlide((prev) => (prev === 0 ? 1 : 0))} id="btn-carousel-next">
            <span className="carousel-control-next-icon bg-khaki-dark p-3 rounded-circle" aria-hidden="true"></span>
            <span className="visually-hidden">Sonraki</span>
          </button>
        </div>
      </header>

      {/* Değerlerimiz Bölümü */}
      <section className="py-5" id="section-values">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-md-6 col-lg-3 text-center">
              <div className="p-4 glass-card h-100">
                <i className="bi bi-tree text-khaki fs-1 mb-3 d-block"></i>
                <h5 className="font-title fw-semibold text-khaki-dark mb-2">%100 Organik</h5>
                <p className="text-muted small mb-0">Ürünlerimizin tamamı doğaya zarar vermeyen, biyolojik olarak parçalanabilir organik liflerden üretilir.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 text-center">
              <div className="p-4 glass-card h-100">
                <i className="bi bi-scissors text-khaki fs-1 mb-3 d-block"></i>
                <h5 className="font-title fw-semibold text-khaki-dark mb-2">El Emeği</h5>
                <p className="text-muted small mb-0">Seramik ve dokuma ürünlerimiz, yerel zanaatkarlar tarafından geleneksel yöntemlerle el yapımı üretilir.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 text-center">
              <div className="p-4 glass-card h-100">
                <i className="bi bi-box-seam text-khaki fs-1 mb-3 d-block"></i>
                <h5 className="font-title fw-semibold text-khaki-dark mb-2">Sıfır Atık Kargo</h5>
                <p className="text-muted small mb-0">Paketlemede tamamen geri dönüştürülmüş kağıt ve doğada çözünür kargo malzemeleri kullanılır.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 text-center">
              <div className="p-4 glass-card h-100">
                <i className="bi bi-shield-check text-khaki fs-1 mb-3 d-block"></i>
                <h5 className="font-title fw-semibold text-khaki-dark mb-2">Güvenli Alışveriş</h5>
                <p className="text-muted small mb-0">256-bit SSL güvenlik sertifikası ve 3D Secure altyapısı ile kart bilgileriniz tam güvendedir.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Kategoriler */}
      <section className="py-4 bg-linen" id="section-categories">
        <div className="container text-center">
          <h2 className="font-title text-khaki-dark fw-bold mb-4">Kategorileri Keşfedin</h2>
          <div className="row justify-content-center g-4">
            <div className="col-6 col-md-3">
              <Link to="/catalog?category=giyim" className="text-decoration-none text-center d-block group" id="link-cat-clothing">
                <div className="bg-white rounded-circle shadow-sm mx-auto mb-3 d-flex align-items-center justify-content-center overflow-hidden border" style={{ width: '120px', height: '120px' }}>
                  <img src="/assets/img/product_3.png" alt="Organik Giyim" className="w-100 h-100 object-fit-cover" />
                </div>
                <h6 className="font-title text-khaki-dark fw-semibold mb-0">Organik Giyim</h6>
              </Link>
            </div>
            <div className="col-6 col-md-3">
              <Link to="/catalog?category=mutfak" className="text-decoration-none text-center d-block group" id="link-cat-ceramics">
                <div className="bg-white rounded-circle shadow-sm mx-auto mb-3 d-flex align-items-center justify-content-center overflow-hidden border" style={{ width: '120px', height: '120px' }}>
                  <img src="/assets/img/product_2.png" alt="Zanaat Seramik" className="w-100 h-100 object-fit-cover" />
                </div>
                <h6 className="font-title text-khaki-dark fw-semibold mb-0">Sofra & Seramik</h6>
              </Link>
            </div>
            <div className="col-6 col-md-3">
              <Link to="/catalog?category=ev" className="text-decoration-none text-center d-block group" id="link-cat-home">
                <div className="bg-white rounded-circle shadow-sm mx-auto mb-3 d-flex align-items-center justify-content-center overflow-hidden border" style={{ width: '120px', height: '120px' }}>
                  <img src="/assets/img/product_4.png" alt="Ev Aksesuar" className="w-100 h-100 object-fit-cover" />
                </div>
                <h6 className="font-title text-khaki-dark fw-semibold mb-0">Ev & Aksesuar</h6>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popüler Ürünler */}
      <section className="py-5" id="section-featured-products">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span class="text-khaki font-title fw-bold text-uppercase small">Editörün Seçimi</span>
              <h2 className="font-title text-khaki-dark fw-bold mb-0">Haftanın Popüler Ürünleri</h2>
            </div>
            <Link to="/catalog" className="btn btn-outline-khaki px-3 btn-sm" id="btn-see-all-featured">Tümünü Gör</Link>
          </div>
          
          <div className="row g-4">
            {featuredProducts.map((product) => {
              // Rating stars
              const stars = [];
              const fullStars = Math.floor(product.rating);
              const hasHalf = product.rating % 1 !== 0;
              for (let i = 0; i < 5; i++) {
                if (i < fullStars) {
                  stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
                } else if (i === fullStars && hasHalf) {
                  stars.push(<i key={i} className="bi bi-star-half text-warning"></i>);
                } else {
                  stars.push(<i key={i} className="bi bi-star text-warning"></i>);
                }
              }

              return (
                <div key={product.id} className="col-12 col-sm-6 col-lg-4">
                  <div className="premium-card h-100 d-flex flex-column">
                    <div className="product-img-wrapper">
                      <span className="badge bg-khaki position-absolute top-2 start-2 m-3 z-1 px-3 py-1.5 rounded-pill shadow-sm" style={{ fontSize: '0.75rem' }}>
                        {product.tag}
                      </span>
                      <img src={product.img} alt={product.name} id={`img-product-${product.id}`} />
                    </div>
                    <div className="p-3 d-flex flex-column flex-grow-1">
                      <div className="mb-1 text-muted small text-capitalize">{product.category}</div>
                      <h5 className="card-title font-title fw-semibold text-khaki-dark mb-2">{product.name}</h5>
                      <div className="d-flex align-items-center gap-1 mb-2">
                        {stars}
                        <span className="text-muted small ms-1">({product.reviews})</span>
                      </div>
                      <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                        <span className="fs-5 fw-bold text-khaki-dark">₺{product.price.toFixed(2)}</span>
                        <div className="d-flex gap-2">
                          <Link to={`/detail/${product.id}`} className="btn btn-outline-khaki btn-sm" id={`btn-view-detail-${product.id}`} title="Detaylar">
                            <i className="bi bi-eye"></i>
                          </Link>
                          <button 
                            className="btn btn-khaki btn-sm" 
                            id={`btn-add-to-cart-${product.id}`}
                            onClick={() => addToCart(product)}
                          >
                            Sepete Ekle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bülten Aboneliği */}
      <section className="py-5 bg-linen border-top border-bottom" id="section-newsletter">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <i className="bi bi-envelope-open text-khaki fs-1 mb-3 d-block"></i>
              <h3 className="font-title text-khaki-dark fw-bold mb-2">Bültenimize Abone Olun</h3>
              <p className="text-muted mb-4">Gelişmelerden, yeni sürdürülebilir ürün koleksiyonlarımızdan ve özel indirim kuponlarından ilk siz haberdar olun.</p>
              
              <form 
                className="needs-validation" 
                novalidate 
                id="form-newsletter" 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Bülten aboneliğiniz alındı! Teşekkür ederiz.');
                  e.target.reset();
                }}
              >
                <div className="input-group">
                  <input type="email" className="form-control form-control-custom" placeholder="E-posta adresiniz..." required id="input-newsletter-email" aria-label="E-posta adresi" />
                  <button className="btn btn-khaki" type="submit" id="btn-newsletter-subscribe">Kayıt Ol</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
