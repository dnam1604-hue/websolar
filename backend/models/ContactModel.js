const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Họ tên là bắt buộc'],
    trim: true,
    maxlength: [100, 'Họ tên không được vượt quá 100 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
  },
  phone: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Tư vấn lắp đặt', 'Hợp tác', 'Hỗ trợ kỹ thuật', 'Khác'],
    default: 'Tư vấn lắp đặt'
  },
  message: {
    type: String,
    required: [true, 'Nội dung tin nhắn là bắt buộc'],
    trim: true,
    maxlength: [2000, 'Nội dung không được vượt quá 2000 ký tự']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'resolved'],
    default: 'new'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh hơn
contactSchema.index({ status: 1 });
contactSchema.index({ type: 1 });
contactSchema.index({ createdAt: -1 });

const ContactModel = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

module.exports = ContactModel;

