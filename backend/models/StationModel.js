const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên trạm là bắt buộc'],
    trim: true,
    maxlength: [200, 'Tên trạm không được vượt quá 200 ký tự']
  },
  address: {
    type: String,
    required: [true, 'Địa chỉ là bắt buộc'],
    trim: true
  },
  power: {
    type: String,
    required: [true, 'Công suất là bắt buộc'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Hoạt động', 'Bảo trì', 'Sắp khai trương'],
    default: 'Hoạt động'
  },
  location: {
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  icon: {
    type: String,
    enum: ['green', 'blue', 'orange', 'red'],
    default: 'green'
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh hơn
stationSchema.index({ status: 1 });
stationSchema.index({ createdAt: -1 });

const StationModel = mongoose.models.Station || mongoose.model('Station', stationSchema);

module.exports = StationModel;

