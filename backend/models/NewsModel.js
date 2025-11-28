const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề là bắt buộc'],
    trim: true,
    maxlength: [200, 'Tiêu đề không được vượt quá 200 ký tự']
  },
  summary: {
    type: String,
    required: [true, 'Tóm tắt là bắt buộc'],
    trim: true,
    maxlength: [500, 'Tóm tắt không được vượt quá 500 ký tự']
  },
  content: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    trim: true,
    default: ''
  },
  link: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh hơn
newsSchema.index({ createdAt: -1 });
newsSchema.index({ status: 1 });

const NewsModel = mongoose.models.News || mongoose.model('News', newsSchema);

module.exports = NewsModel;

