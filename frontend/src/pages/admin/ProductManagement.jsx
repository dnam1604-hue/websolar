import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import uploadService from '../../services/uploadService';
import { getImageUrl } from '../../utils/imageUtils';
import './AdminDashboard.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'AC',
    status: 'active',
    image: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadProducts();
  }, [filterCategory]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll(
        filterCategory !== 'all' ? filterCategory : null,
        null
      );
      setProducts(response.data || []);
    } catch (err) {
      setMessage('❌ Lỗi khi tải sản phẩm: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setShowForm(true);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'AC',
      status: product.status || 'active',
      image: product.image || ''
    });
    setTimeout(() => {
      document.querySelector('.admin-product-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleNew = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'AC',
      status: 'active',
      image: ''
    });
    setSelectedProduct(null);
    setIsEditing(false);
    setShowForm(true);
    setTimeout(() => {
      document.querySelector('.admin-product-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('❌ Vui lòng chọn file ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('❌ Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    setUploadingImage(true);
    setMessage('');

    try {
      const response = await uploadService.uploadImage(file);
      if (response.success && response.imageUrl) {
        setProductForm({ ...productForm, image: response.imageUrl });
        setMessage('✅ Upload ảnh thành công');
      } else {
        setMessage('❌ Upload ảnh thất bại');
      }
    } catch (error) {
      setMessage('❌ Lỗi khi upload ảnh: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      if (isEditing && selectedProduct) {
        await productService.update(selectedProduct._id || selectedProduct.id, productForm);
        setMessage('Đã cập nhật sản phẩm ✅');
      } else {
        await productService.create(productForm);
        setMessage('Đã thêm sản phẩm mới ✅');
      }

      setProductForm({
        name: '',
        description: '',
        price: '',
        category: 'AC',
        status: 'active',
        image: ''
      });
      setSelectedProduct(null);
      setIsEditing(false);
      setShowForm(false);
      await loadProducts();
    } catch (err) {
      setMessage('❌ Có lỗi xảy ra: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      await productService.delete(productId);
      setMessage('Đã xóa sản phẩm ✅');
      await loadProducts();
      if (selectedProduct && (selectedProduct._id || selectedProduct.id) === productId) {
        handleNew();
      }
    } catch (err) {
      setMessage('❌ Lỗi khi xóa: ' + (err.response?.data?.error || err.message));
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 'Liên hệ') return 'Liên hệ';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VNĐ';
  };

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'AC', label: 'Bộ sạc AC' },
    { value: 'DC', label: 'Bộ sạc DC' },
    { value: 'Portable', label: 'Bộ sạc di động' },
    { value: 'Other', label: 'Khác' }
  ];

  return (
    <div className="admin-content">
      <header className="admin-content-header">
        <div>
          <h1>Quản trị sản phẩm</h1>
          <p>Thêm, chỉnh sửa và quản lý sản phẩm</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleNew}
            disabled={loading}
          >
            + Thêm sản phẩm mới
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={loadProducts}
            disabled={loading}
          >
            {loading ? 'Đang tải...' : 'Tải lại'}
          </button>
        </div>
      </header>

      {message && <div className="admin-toast">{message}</div>}

      {/* Filter */}
      <div className="admin-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ marginBottom: 'var(--spacing-sm)' }}>Lọc theo danh mục:</label>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`btn ${filterCategory === cat.value ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterCategory(cat.value)}
              style={{ fontSize: 'var(--font-size-sm)' }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Panel */}
      {showForm && (
        <div className="admin-product-form-section">
          <form className="admin-card" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>{isEditing ? `Chỉnh sửa: ${selectedProduct?.name || ''}` : 'Thêm sản phẩm mới'}</h2>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(false);
                  setSelectedProduct(null);
                }}
              >
                Đóng
              </button>
            </div>

            <label>
              Tên sản phẩm *
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                required
                placeholder="VD: Trụ sạc ô tô – Sạc thường AC 7.4 kW"
                maxLength={200}
              />
              <span className="char-counter">
                {productForm.name.length} / 200 ký tự
              </span>
            </label>

            <label>
              Mô tả và thông số kỹ thuật *
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                required
                rows={12}
                placeholder="Dòng đầu tiên là mô tả chính, các dòng sau là thông số kỹ thuật (mỗi thông số một dòng)&#10;&#10;VD:&#10;Thiết bị sạc thường Ô tô điện AC 7.4kW là thiết bị cung cấp nguồn điện xoay chiều...&#10;Kiểu dáng: Treo tường/treo trụ&#10;Điện áp, tần số hoạt động: 1 pha, 220VAC ± 10%, 50/60Hz&#10;..."
              />
            </label>

            <label>
              Giá *
              <input
                type="text"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                required
                placeholder="VD: 11000000 hoặc 'Liên hệ'"
              />
              <small style={{ color: '#64748b', marginTop: 'var(--spacing-xs)' }}>
                Nhập số (không có dấu chấm) hoặc "Liên hệ"
              </small>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
              <label>
                Danh mục *
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  required
                >
                  <option value="AC">Bộ sạc AC</option>
                  <option value="DC">Bộ sạc DC</option>
                  <option value="Portable">Bộ sạc di động</option>
                  <option value="Other">Khác</option>
                </select>
              </label>

              <label>
                Trạng thái *
                <select
                  value={productForm.status}
                  onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                  required
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Tạm ngưng</option>
                </select>
              </label>
            </div>

            <label>
              Ảnh sản phẩm
              <div className="image-upload-section">
                <div className="image-upload-options">
                  <div className="upload-option">
                    <label className="upload-file-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        style={{ display: 'none' }}
                      />
                      <span className="upload-button">
                        {uploadingImage ? 'Đang upload...' : '📤 Upload ảnh'}
                      </span>
                    </label>
                    <span className="upload-hint">Hoặc nhập URL</span>
                  </div>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="Nhập URL ảnh hoặc đường dẫn"
                    className="image-url-input"
                  />
                </div>
                {productForm.image && (
                  <div className="image-preview">
                    <img 
                      src={getImageUrl(productForm.image)}
                      alt="Preview" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="image-preview-error" style={{ display: 'none' }}>
                      <span>Không thể tải ảnh</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProductForm({ ...productForm, image: '' })}
                      className="remove-image-btn"
                    >
                      ✕ Xóa ảnh
                    </button>
                  </div>
                )}
              </div>
            </label>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Thêm sản phẩm')}
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => handleDelete(selectedProduct._id || selectedProduct.id)}
                  disabled={submitting}
                >
                  Xóa
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      {loading && products.length === 0 ? (
        <div className="news-loading">Đang tải sản phẩm...</div>
      ) : products.length > 0 ? (
        <div className="admin-products-list">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {products.map((product) => (
              <div 
                key={product._id || product.id} 
                className={`admin-card ${selectedProduct && (selectedProduct._id || selectedProduct.id) === (product._id || product.id) ? 'selected' : ''}`}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => handleEdit(product)}
              >
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  {product.image ? (
                    <img 
                      src={getImageUrl(product.image)} 
                      alt={product.name}
                      style={{ width: '100%', height: '200px', objectFit: 'contain', backgroundColor: '#f3f4f6', borderRadius: 'var(--radius-md)' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '200px', backgroundColor: '#f3f4f6', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                      📦
                    </div>
                  )}
                </div>
                <h3 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: 'var(--font-size-lg)', color: '#0f172a' }}>
                  {product.name}
                </h3>
                <p style={{ margin: '0 0 var(--spacing-sm) 0', color: '#64748b', fontSize: 'var(--font-size-sm)' }}>
                  <strong>Giá:</strong> {formatPrice(product.price)}
                </p>
                <p style={{ margin: '0 0 var(--spacing-sm) 0', color: '#64748b', fontSize: 'var(--font-size-sm)' }}>
                  <strong>Danh mục:</strong> {product.category}
                </p>
                <p style={{ margin: 0, color: product.status === 'active' ? '#10b981' : '#ef4444', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                  {product.status === 'active' ? '✓ Đang hoạt động' : '✗ Tạm ngưng'}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="news-loading">Chưa có sản phẩm nào. Hãy thêm sản phẩm mới.</div>
      )}
    </div>
  );
};

export default ProductManagement;

