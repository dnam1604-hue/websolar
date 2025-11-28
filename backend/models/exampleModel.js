const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên là bắt buộc'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Nếu chưa có model, tạo mới
const ExampleModel = mongoose.models.Example || mongoose.model('Example', exampleSchema);

module.exports = ExampleModel;


