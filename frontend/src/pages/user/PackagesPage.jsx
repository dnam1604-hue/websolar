import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { getImageUrl } from '../../utils/imageUtils';
import './PackagesPage.css';

// Map URL category to internal category value
const categoryMap = {
  'ac': 'AC',
  'dc': 'DC',
  'portable': 'Portable',
  'voucher': 'Voucher'
};

const PackagesPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Check if this is the packages page (not products page)
  const isPackagesPage = location.pathname === '/packages';
  
  const initialCategory = category ? (categoryMap[category.toLowerCase()] || 'all') : 'all';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    // Update selectedCategory when URL param changes
    if (category) {
      const mappedCategory = categoryMap[category.toLowerCase()] || 'all';
      setSelectedCategory(mappedCategory);
    } else {
      setSelectedCategory('all');
    }
  }, [category]);

  useEffect(() => {
    if (!isPackagesPage) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [selectedCategory, isPackagesPage]);

  const extractPower = (productName, description) => {
    // Tìm số kW trong tên sản phẩm hoặc mô tả
    const text = (productName + ' ' + description).toLowerCase();
    
    // Tìm pattern như "7.4kW", "22kW", "60kW", "120kW", "300kW"
    const patterns = [
      /(\d+\.?\d*)\s*kw/gi,  // 7.4kW, 22kW, 60kW
      /(\d+\.?\d*)\s*k\s*w/gi,  // 7.4 kW, 22 kW
    ];
    
    let maxPower = 0;
    patterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const power = parseFloat(match[1]);
        if (power > maxPower) {
          maxPower = power;
        }
      }
    });
    
    return maxPower;
  };

  const sortProductsByPower = (products) => {
    return [...products].sort((a, b) => {
      const powerA = extractPower(a.name, a.description || '');
      const powerB = extractPower(b.name, b.description || '');
      return powerA - powerB;
    });
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll(
        selectedCategory !== 'all' ? selectedCategory : null,
        'active'
      );
      const sortedProducts = sortProductsByPower(response.data || []);
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 'Liên hệ') return 'Liên hệ';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VNĐ';
  };

  const parseSpecifications = (description) => {
    if (!description) return { mainDescription: '', specs: [] };
    
    const lines = description.split('\n').filter(line => line.trim());
    const mainDescription = lines[0] || '';
    const specs = lines.slice(1);
    
    return { mainDescription, specs };
  };

  // Danh sách sản phẩm được đánh dấu bán chạy và đề xuất
  const featuredProductKeywords = [
    'AC 7.4 kW',
    'AC 7.4kW',
    'DC 60kW',
    'DC 120kW'
  ];

  const isFeaturedProduct = (productName) => {
    return featuredProductKeywords.some(keyword => 
      productName.includes(keyword)
    );
  };

  // Packages Page Content (Bảng giá và dịch vụ sạc)
  if (isPackagesPage) {
    const showcaseProducts = [
      {
        id: 1,
        name: 'Trụ sạc ô tô – Sạc thường AC 7.4 kW',
        price: '11.000.000',
        description: 'Thiết bị sạc thường Ô tô điện AC 7.4kW là thiết bị cung cấp nguồn điện xoay chiều, thiết kế dạng treo tường/treo trụ, mỗi thiết bị được trang bị 1 cổng sạc, công suất sạc đạt tối đa 7.4kW. Dòng sạc AC không dùng được cho xe VF3.',
        image: '/images/ac-7.4kw.png'
      },
      {
        id: 2,
        name: 'Trụ sạc ô tô – Sạc nhanh DC 60kW',
        price: '278.000.000',
        description: 'Thiết bị sạc nhanh Ô tô điện DC 60kW là thiết bị cung cấp nguồn điện một chiều, thiết kế dạng tủ đứng, mỗi thiết bị được trang bị 2 cổng sạc, công suất sạc đạt tối đa 60kW/80kW, tùy từng vị trí trạm sạc.',
        image: '/images/dc-60kw.png'
      },
      {
        id: 3,
        name: 'Trụ sạc ô tô - Sạc siêu nhanh DC 120kW',
        price: '416.000.000',
        description: 'Thiết bị sạc siêu nhanh Ô tô điện DC 120kW là thiết bị cung cấp nguồn điện một chiều, thiết kế dạng tủ đứng, mỗi thiết bị được trang bị 2 cổng sạc, công suất sạc đạt tối đa 120kW, tùy từng vị trí trạm sạc.',
        image: '/images/dc-120kw.png'
      }
    ];

    return (
      <div className="packages-page">
        <div className="section-container">
          {/* Header Section */}
          <section className="packages-intro-section">
            <h1 className="packages-main-title">Giải pháp đa dạng từ SolarEV</h1>
            <p className="packages-intro-text">
              SolarEV cam kết đầu tư, nâng cấp và cải tiến công nghệ để tạo ra những sản phẩm mới 
              mang lại sự tiện lợi vượt trội cho khách hàng. Mục tiêu của chúng tôi là trở thành nhà cung cấp 
              hàng đầu tại Việt Nam cho các trạm sạc nhượng quyền, xây dựng mạng lưới sạc rộng khắp, 
              góp phần vào quá trình chuyển đổi năng lượng xanh và đáp ứng nhu cầu ngày càng tăng của thị trường xe điện.
            </p>
            <div className="packages-recommended-badge">
              <span className="recommended-icon">⭐</span>
              <span className="recommended-text">Sản phẩm được khách hàng tin dùng và đánh giá cao</span>
            </div>
          </section>

          {/* Products Section */}
          <section className="packages-products-showcase">
            <div className="products-showcase-grid">
              {showcaseProducts.map((product) => (
                <div key={product.id} className="product-showcase-card">
                  <div className="product-badge-container">
                    <span className="product-badge">🔥 Bán chạy</span>
                    <span className="product-badge recommended">⭐ Đề xuất</span>
                  </div>
                  <div className="product-showcase-image">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="product-image-placeholder" style={{ display: 'none' }}>
                      <span>📦</span>
                    </div>
                  </div>
                  <h3 className="product-showcase-name">{product.name}</h3>
                  <p className="product-showcase-price">
                    Giá niêm yết: <span>{product.price} VNĐ</span>
                  </p>
                  <p className="product-showcase-description">{product.description}</p>
                  <div className="product-popularity">
                    <span className="popularity-text">✓ Được khách hàng tin dùng</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="packages-cta-section">
            <div className="packages-cta-buttons">
              <button 
                className="packages-cta-button"
                onClick={() => navigate('/products/ac')}
              >
                Xem tất cả sản phẩm AC
              </button>
              <button 
                className="packages-cta-button packages-cta-button-secondary"
                onClick={() => navigate('/products/dc')}
              >
                Xem tất cả sản phẩm DC
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Products Page Content (Trụ AC/DC)
  return (
    <div className="packages-page">
      {/* Header Section */}
      <section className="packages-header-section">
        <div className="section-container">
          <div className="section-header">
            <h1>{selectedCategory === 'DC' ? 'Trụ DC' : 'Trụ AC'}</h1>
            {selectedCategory === 'DC' ? (
              <div className="header-content">
                <p className="header-description">
                  Hệ thống sạc nhanh DC của SolarEV cung cấp giải pháp sạc điện tốc độ cao cho ô tô điện, 
                  từ sạc nhanh 20kW đến sạc siêu nhanh 300kW. Tất cả sản phẩm đều được thiết kế với công nghệ tiên tiến, 
                  đảm bảo an toàn và hiệu quả tối đa.
                </p>
              </div>
            ) : (
              <div className="header-content">
                <p className="header-description">
                  Hệ thống sạc AC của SolarEV cung cấp giải pháp sạc điện tiện lợi cho ô tô điện tại nhà và văn phòng. 
                  Từ sạc thường 7.4kW đến sạc nhanh 22kW, tất cả sản phẩm đều được thiết kế với tiêu chuẩn an toàn cao, 
                  dễ dàng lắp đặt và sử dụng.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="packages-products-section">
        <div className="section-container">
          {loading ? (
            <div className="products-loading">Đang tải sản phẩm...</div>
          ) : products.length > 0 ? (
            <div className={`products-grid ${selectedCategory === 'DC' ? 'dc-grid' : ''}`}>
              {products.map((product) => {
                const { mainDescription, specs } = parseSpecifications(product.description);
                const isFeatured = isFeaturedProduct(product.name);
                return (
                  <div key={product._id || product.id} className="product-card">
                    {isFeatured && (
                      <div className="product-badge-container">
                        <span className="product-badge">🔥 Bán chạy</span>
                        <span className="product-badge recommended">⭐ Đề xuất</span>
                      </div>
                    )}
                    <div className="product-image-container">
                      {product.image ? (
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="product-image"
                          onError={(e) => {
                            e.target.src = '/images/placeholder-product.png';
                          }}
                        />
                      ) : (
                        <div className="product-image-placeholder">
                          <span>📦</span>
                        </div>
                      )}
                    </div>
                    <div className="product-content">
                      <h3 className="product-title">{product.name}</h3>
                      <div className="product-price">
                        Giá niêm yết: <span>{formatPrice(product.price)}</span>
                      </div>
                      {mainDescription && (
                        <div className="product-description">
                          {mainDescription}
                        </div>
                      )}
                      {specs.length > 0 && (
                        <div className="product-specs">
                          {specs.map((spec, index) => (
                            <div key={index} className="spec-item">
                              {spec.trim()}
                            </div>
                          ))}
                        </div>
                      )}
                      {isFeatured && (
                        <div className="product-popularity">
                          <span className="popularity-text">✓ Được khách hàng tin dùng</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="products-empty">
              <p>Chưa có sản phẩm nào trong danh mục này.</p>
            </div>
          )}
          {products.length > 0 && (
            <div className="products-contact-section">
              <button className="products-contact-btn">
                Liên hệ
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PackagesPage;
