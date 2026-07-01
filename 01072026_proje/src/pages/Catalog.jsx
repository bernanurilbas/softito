import { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsData } from '../data/products';
import { CartContext } from '../context/CartContext';

export default function Catalog() {
  const { addToCart } = useContext(CartContext);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState('default');

  // Handle parameters from search query (e.g. Nav link search or Category redirects)
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const cat = searchParams.get('category');
    
    if (query) setSearchTerm(query);
    if (cat) setSelectedCategories([cat]);
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setMaxPrice(2000);
    setSortBy('default');
    setSearchParams({});
  };

  // Filter logic
  let filteredProducts = productsData.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price <= maxPrice;
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    
    return matchesSearch && matchesPrice && matchesCategory;
  });

  // Sorting
  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating-desc') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <main className="py-5" id="main-catalog-content">
      <div className="container">
        <div className="row">
          
          {/* Sol Filtreleme Paneli */}
          <aside className="col-lg-3 mb-4">
            <div className="card border-0 glass-card p-4">
              <h5 className="font-title fw-bold text-khaki-dark mb-4 d-flex justify-content-between align-items-center">
                Filtreler
                <button 
                  className="btn btn-link text-khaki p-0 small text-decoration-none" 
                  style={{ fontSize: '0.8rem' }} 
                  id="btn-filter-clear" 
                  onClick={clearAllFilters}
                >
                  Temizle
                </button>
              </h5>
              
              {/* Metin Arama */}
              <div className="mb-4">
                <h6 className="font-title fw-semibold text-khaki-dark mb-3">Arama</h6>
                <input 
                  type="text" 
                  className="form-control form-control-custom" 
                  placeholder="Kelimeleri yazın..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  id="input-catalog-search"
                />
              </div>
              
              <hr className="my-4" />

              {/* Kategori Filtresi */}
              <div className="mb-4">
                <h6 className="font-title fw-semibold text-khaki-dark mb-3">Kategoriler</h6>
                {['giyim', 'mutfak', 'ev', 'aksesuar'].map((cat) => {
                  const label = cat === 'giyim' ? 'Organik Giyim' 
                              : cat === 'mutfak' ? 'Sofra & Seramik' 
                              : cat === 'ev' ? 'Ev & Aksesuar' 
                              : 'Deri Tasarım';
                  return (
                    <div key={cat} className="form-check mb-2">
                      <input 
                        className="form-check-input check-category" 
                        type="checkbox" 
                        value={cat} 
                        id={`filter-category-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                      />
                      <label className="form-check-label text-muted small" htmlFor={`filter-category-${cat}`}>
                        {label}
                      </label>
                    </div>
                  );
                })}
              </div>
              
              <hr className="my-4" />
              
              {/* Fiyat Aralığı Filtresi */}
              <div className="mb-4">
                <h6 className="font-title fw-semibold text-khaki-dark mb-3">Maksimum Fiyat</h6>
                <input 
                  type="range" 
                  className="form-range" 
                  min="200" 
                  max="2000" 
                  step="50" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                  id="input-filter-price-max" 
                />
                <div className="d-flex justify-content-between text-muted small mt-2">
                  <span>₺200</span>
                  <span className="fw-bold text-khaki-dark" id="price-max-label">₺{maxPrice}</span>
                </div>
              </div>
              
              <hr className="my-4" />
              
              {/* Sıralama Seçimi */}
              <div>
                <h6 className="font-title fw-semibold text-khaki-dark mb-3">Sırala</h6>
                <select 
                  className="form-select form-control-custom" 
                  id="select-catalog-sort" 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Önerilen</option>
                  <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                  <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                  <option value="rating-desc">Değerlendirme Puanı</option>
                </select>
              </div>
            </div>
          </aside>
          
          {/* Sağ Ürün Grid Alanı */}
          <section className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-muted small" id="text-products-count">
                {filteredProducts.length} ürün listeleniyor
              </span>
            </div>
            
            <div className="row g-4" id="catalog-products-row">
              {filteredProducts.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }}></i>
                  <h5 className="mt-3">Aramanıza Uygun Ürün Bulunamadı</h5>
                  <p className="text-muted">Lütfen filtreleri sıfırlayıp tekrar deneyin.</p>
                </div>
              ) : (
                filteredProducts.map((product) => {
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
                    <div key={product.id} className="col-12 col-sm-6 col-md-4">
                      <div className="premium-card h-100 d-flex flex-column">
                        <div className="product-img-wrapper">
                          <span className="badge bg-khaki position-absolute top-2 start-2 m-3 z-1 px-3 py-1.5 rounded-pill shadow-sm" style={{ fontSize: '0.75rem' }}>
                            {product.tag}
                          </span>
                          <img src={product.img} alt={product.name} id={`img-catalog-product-${product.id}`} />
                        </div>
                        <div className="p-3 d-flex flex-column flex-grow-1">
                          <div className="mb-1 text-muted small text-capitalize">{product.category}</div>
                          <h5 className="card-title font-title fw-semibold text-khaki-dark mb-2" style={{ fontSize: '1.05rem' }}>
                            {product.name}
                          </h5>
                          <div className="d-flex align-items-center gap-1 mb-3" style={{ fontSize: '0.85rem' }}>
                            {stars}
                            <span className="text-muted small ms-1">({product.reviews})</span>
                          </div>
                          <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                            <span className="fs-5 fw-bold text-khaki-dark">₺{product.price.toFixed(2)}</span>
                            <div className="d-flex gap-2">
                              <Link to={`/detail/${product.id}`} className="btn btn-outline-khaki btn-sm" id={`btn-catalog-view-detail-${product.id}`} title="Detaylar">
                                <i className="bi bi-eye"></i>
                              </Link>
                              <button 
                                className="btn btn-khaki btn-sm" 
                                id={`btn-catalog-add-to-cart-${product.id}`}
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
                })
              )}
            </div>
          </section>
          
        </div>
      </div>
    </main>
  );
}
