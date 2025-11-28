const ContactModel = require('../models/ContactModel');

// Get all contacts (for admin)
exports.getAll = async (req, res) => {
  try {
    const { status, type } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    
    const contacts = await ContactModel.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get contact by ID
exports.getById = async (req, res) => {
  try {
    const contact = await ContactModel.findById(req.params.id).select('-__v');
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy liên hệ'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create contact (public endpoint)
exports.create = async (req, res) => {
  try {
    const contact = new ContactModel(req.body);
    await contact.save();
    
    res.status(201).json({
      success: true,
      message: 'Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất có thể!',
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update contact status (for admin)
exports.update = async (req, res) => {
  try {
    const contact = await ContactModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy liên hệ'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete contact
exports.delete = async (req, res) => {
  try {
    const contact = await ContactModel.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy liên hệ'
      });
    }
    
    res.json({
      success: true,
      message: 'Đã xóa liên hệ thành công',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

