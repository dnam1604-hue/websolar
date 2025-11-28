const NewsModel = require('../models/NewsModel');

// Get all news
exports.getAll = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const news = await NewsModel.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get news by ID
exports.getById = async (req, res) => {
  try {
    const news = await NewsModel.findById(req.params.id).select('-__v');
    
    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy tin tức'
      });
    }
    
    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create news
exports.create = async (req, res) => {
  try {
    const news = new NewsModel(req.body);
    await news.save();
    
    res.status(201).json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update news
exports.update = async (req, res) => {
  try {
    const news = await NewsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy tin tức'
      });
    }
    
    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete news
exports.delete = async (req, res) => {
  try {
    const news = await NewsModel.findByIdAndDelete(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy tin tức'
      });
    }
    
    res.json({
      success: true,
      message: 'Đã xóa tin tức thành công',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

