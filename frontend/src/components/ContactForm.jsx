import React, { useState } from 'react';
import { contactService } from '../services/contactService';
import './ContactForm.css';

const ContactForm = ({ onSuccess, onCancel, hideTitle = false, submitButtonText = 'Gửi yêu cầu' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    province: '',
    district: '',
    area: '',
    type: 'Đăng ký đặt trạm',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Họ tên là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.address?.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    if (!formData.province?.trim()) {
      newErrors.province = 'Tỉnh/Thành phố là bắt buộc';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Nội dung tin nhắn là bắt buộc';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Nội dung tin nhắn phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const response = await contactService.create(formData);
      
      if (response.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          address: '',
          province: '',
          district: '',
          area: '',
          type: 'Đăng ký đặt trạm',
          message: ''
        });
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(response);
        }
        
        // Auto hide success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
          if (onCancel) {
            onCancel();
          }
        }, 5000);
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.error || 'Có lỗi xảy ra. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-container">
      <form className="contact-form" onSubmit={handleSubmit}>
        {!hideTitle && <h3>Gửi yêu cầu liên hệ</h3>}
        
        {success && (
          <div className="contact-form-success">
            ✅ Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.
          </div>
        )}

        {errors.submit && (
          <div className="contact-form-error">
            ❌ {errors.submit}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">
            Họ tên <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Nhập họ tên của bạn"
            disabled={loading || success}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="your.email@example.com"
            disabled={loading || success}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            Số điện thoại <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'error' : ''}
            placeholder="0123456789"
            disabled={loading || success}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="company">
            Tên công ty/Tổ chức
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Nhập tên công ty/tổ chức"
            disabled={loading || success}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">
            Địa chỉ <span className="required">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? 'error' : ''}
            placeholder="Nhập địa chỉ chi tiết"
            disabled={loading || success}
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="province">
            Tỉnh/Thành phố <span className="required">*</span>
          </label>
          <input
            type="text"
            id="province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            className={errors.province ? 'error' : ''}
            placeholder="Nhập tỉnh/thành phố"
            disabled={loading || success}
          />
          {errors.province && <span className="error-message">{errors.province}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="district">
            Quận/Huyện
          </label>
          <input
            type="text"
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="Nhập quận/huyện"
            disabled={loading || success}
          />
        </div>

        <div className="form-group">
          <label htmlFor="area">
            Diện tích mặt bằng (m²)
          </label>
          <input
            type="number"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="Nhập diện tích mặt bằng"
            disabled={loading || success}
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">
            Loại yêu cầu <span className="required">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={loading || success}
          >
            <option value="Đăng ký đặt trạm">Đăng ký đặt trạm</option>
            <option value="Tư vấn lắp đặt">Tư vấn lắp đặt</option>
            <option value="Hợp tác">Hợp tác</option>
            <option value="Hỗ trợ kỹ thuật">Hỗ trợ kỹ thuật</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">
            Nội dung tin nhắn <span className="required">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={errors.message ? 'error' : ''}
            rows={5}
            placeholder="Vui lòng mô tả chi tiết yêu cầu của bạn..."
            disabled={loading || success}
          />
          {errors.message && <span className="error-message">{errors.message}</span>}
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || success}
          >
            {loading ? 'Đang gửi...' : success ? 'Đã gửi thành công!' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;

