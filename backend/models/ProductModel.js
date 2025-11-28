const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên sản phẩm là bắt buộc'],
    trim: true,
    maxlength: [200, 'Tên sản phẩm không được vượt quá 200 ký tự']
  },
  description: {
    type: String,
    required: [true, 'Mô tả là bắt buộc'],
    trim: true
  },
  price: {
    type: String,
    trim: true,
    default: 'Liên hệ'
  },
  category: {
    type: String,
    enum: ['DC', 'AC', 'Portable', 'Voucher', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  image: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh hơn
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ createdAt: -1 });

const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = ProductModel;

