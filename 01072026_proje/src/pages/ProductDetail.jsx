import { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsData } from '../data/products';
import { CartContext } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');

  useEffect(() => {
    const matched = productsData.find((p) => p.id === id) || productsData[0];
    setProduct(matched);
    if (matched) {
      setSelectedSize(matched.sizes[0]);
      setSelectedColor(matched.colors[0]);
      setQty(1);
    }
  }, [id]);

  if (!product) return <div className="container py-5 text-center"><p>Yükleniyor...</p></div>;

  const handleQtyChange = (val) => {
    setQty((prev) => {
      const next = prev + val;
      return next < 1 ? 1 : next;
    });
  };

  const handleAddToCart = () => {
    addToCart(product, qty, selectedSize, selectedColor);
  };

  // Star Rating elements
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

  const displayImage = product.colorImages && product.colorImages[selectedColor]
    ? product.colorImages[selectedColor]
    : product.img;

  return (
    <main className="py-5" id="main-product-detail">
      <div className="container" id="product-detail-container">
        <div className="row g-5">
          {/* Ürün Görseli Sol */}
          <div className="col-md-6 text-center">
            <div className="bg-linen p-4 rounded-4 shadow-sm overflow-hidden" style={{ maxHeight: '480px' }}>
              <img src={displayImage} alt={product.name} className="img-fluid rounded-3 object-fit-cover w-100 h-100" id="img-detail-main" />
            </div>
          </div>

          {/* Ürün Bilgileri Sağ */}
          <div className="col-md-6">
            <span className="badge bg-khaki mb-2 px-3 py-1.5 rounded-pill" id="badge-detail-tag">{product.tag}</span>
            <h1 className="font-title fw-bold text-khaki-dark mb-2" id="text-product-title">{product.name}</h1>

            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="d-flex gap-1" style={{ fontSize: '0.9rem' }}>
                {stars}
              </div>
              <span className="text-muted small">({product.reviews} Müşteri Yorumu)</span>
            </div>

            <h2 className="font-title text-khaki fw-bold mb-4 fs-2" id="text-product-price">₺{product.price.toFixed(2)}</h2>

            <p className="text-muted mb-4">{product.desc}</p>

            <form id="form-detail-variations" onSubmit={(e) => e.preventDefault()}>
              {/* Beden Seçenekleri */}
              <div className="mb-3">
                <h6 className="font-title fw-semibold text-khaki-dark mb-2">Beden Seçeneği</h6>
                <div className="d-flex" id="container-sizes">
                  {product.sizes.map((size, idx) => (
                    <button
                      key={size}
                      type="button"
                      className={`btn ${selectedSize === size ? 'btn-khaki' : 'btn-outline-secondary'} btn-sm me-2 btn-size-select`}
                      id={`btn-size-${idx}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Renk Seçenekleri */}
              <div className="mb-4">
                <h6 className="font-title fw-semibold text-khaki-dark mb-2">Renk Seçeneği</h6>
                <div className="d-flex align-items-center" id="container-colors">
                  {product.colors.map((color, idx) => (
                    <button
                      key={color}
                      type="button"
                      className={`btn btn-sm rounded-circle me-2 btn-color-select ${selectedColor === color ? 'active' : ''}`}
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: color === 'Haki' || color === 'Haki Yeşil' ? '#4a5d4e'
                          : color === 'Taş Beji' || color === 'Bej' || color === 'Doğal Keten' ? '#d9d0c5'
                            : color === 'Zeytin' ? '#6b7f70'
                              : color === 'Karamel Toprak' || color === 'Karamel Kahve' ? '#a38a70'
                                : '#5c4d3c',
                        border: selectedColor === color ? '2px solid var(--primary-dark)' : '2px solid transparent'
                      }}
                      title={color}
                      id={`btn-color-${idx}`}
                      onClick={() => setSelectedColor(color)}
                    >
                    </button>
                  ))}
                </div>
              </div>

              {/* Adet ve Sepete Ekle */}
              <div className="d-flex align-items-center gap-3 pt-3 border-top">
                <div className="input-group" style={{ width: '130px' }}>
                  <button className="btn btn-outline-secondary" type="button" id="btn-qty-decrement" onClick={() => handleQtyChange(-1)}>-</button>
                  <input type="text" className="form-control text-center form-control-custom" value={qty} readOnly id="input-qty-value" />
                  <button className="btn btn-outline-secondary" type="button" id="btn-qty-increment" onClick={() => handleQtyChange(1)}>+</button>
                </div>
                <button type="button" className="btn btn-khaki py-2.5 px-4 flex-grow-1" id="btn-detail-add-to-cart" onClick={handleAddToCart}>
                  <i className="bi bi-cart-plus me-2"></i> Sepete Ekle
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Ürün Bilgisi Tab Paneli */}
        <div className="row mt-5 pt-4">
          <div className="col-12">
            <div className="card border-0 glass-card p-4">
              <nav>
                <div className="nav nav-tabs border-bottom mb-4" id="nav-tab" role="tablist">
                  <button
                    className={`nav-link nav-link-custom ${activeTab === 'desc' ? 'active' : ''}`}
                    id="tab-trigger-desc"
                    type="button"
                    onClick={() => setActiveTab('desc')}
                  >
                    Açıklama
                  </button>
                  <button
                    className={`nav-link nav-link-custom ${activeTab === 'specs' ? 'active' : ''}`}
                    id="tab-trigger-specs"
                    type="button"
                    onClick={() => setActiveTab('specs')}
                  >
                    Özellikler
                  </button>
                  <button
                    className={`nav-link nav-link-custom ${activeTab === 'reviews' ? 'active' : ''}`}
                    id="tab-trigger-reviews"
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                  >
                    Yorumlar ({product.reviews})
                  </button>
                </div>
              </nav>
              <div className="tab-content text-start" id="nav-tabContent">
                {activeTab === 'desc' && (
                  <div className="tab-pane fade show active text-muted" id="tab-content-desc">
                    <p>{product.desc}</p>
                    <p className="mt-2">ElegantCart güvencesiyle adil ticaret (Fair Trade) standartlarında üretilmiş olan bu ürünümüz, doğanın zarafetini ve insan elinin hassas emeğini yansıtır.</p>
                  </div>
                )}
                {activeTab === 'specs' && (
                  <div className="tab-pane fade show active text-muted" id="tab-content-specs">
                    <p className="fw-semibold text-khaki-dark mb-1">Teknik Özellikler:</p>
                    <p>{product.specs}</p>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="tab-pane fade show active" id="tab-content-reviews">
                    <div className="d-flex align-items-start mb-4 pb-3 border-bottom">
                      <div className="bg-linen rounded-circle p-3 me-3 text-khaki d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}><i className="bi bi-person-fill"></i></div>
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h6 className="mb-0 font-title text-khaki-dark">Ayşe K.</h6>
                          <div className="text-warning small"><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i></div>
                        </div>
                        <p className="text-muted small mb-0">Ürün inanılmaz kaliteli, rengi görseldekinin aynısı. Paketleme çok özenliydi. Çok teşekkürler!</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-start mb-2">
                      <div className="bg-linen rounded-circle p-3 me-3 text-khaki d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}><i className="bi bi-person-fill"></i></div>
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h6 className="mb-0 font-title text-khaki-dark">Mehmet B.</h6>
                          <div className="text-warning small"><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star"></i></div>
                        </div>
                        <p className="text-muted small mb-0">Hızlı kargo ve doğal malzeme hissiyatı çok iyi. Tavsiye ederim.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
