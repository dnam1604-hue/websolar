const StationModel = require('../models/StationModel');

// Get all stations
exports.getAll = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const stations = await StationModel.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: stations.length,
      data: stations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get station by ID
exports.getById = async (req, res) => {
  try {
    const station = await StationModel.findById(req.params.id).select('-__v');
    
    if (!station) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy trạm sạc'
      });
    }
    
    res.json({
      success: true,
      data: station
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create station
exports.create = async (req, res) => {
  try {
    const station = new StationModel(req.body);
    await station.save();
    
    res.status(201).json({
      success: true,
      data: station
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update station
exports.update = async (req, res) => {
  try {
    const station = await StationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!station) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy trạm sạc'
      });
    }
    
    res.json({
      success: true,
      data: station
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete station
exports.delete = async (req, res) => {
  try {
    const station = await StationModel.findByIdAndDelete(req.params.id);
    
    if (!station) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy trạm sạc'
      });
    }
    
    res.json({
      success: true,
      message: 'Đã xóa trạm sạc thành công',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

