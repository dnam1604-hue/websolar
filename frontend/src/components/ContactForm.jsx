import React, { useState } from 'react';
import { contactService } from '../services/contactService';
import './ContactForm.css';

const ContactForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Tư vấn lắp đặt',
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
          type: 'Tư vấn lắp đặt',
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
        <h3>Gửi yêu cầu liên hệ</h3>
        
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
            {loading ? 'Đang gửi...' : success ? 'Đã gửi thành công!' : 'Gửi yêu cầu'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;

