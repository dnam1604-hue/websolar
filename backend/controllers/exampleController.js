const ExampleModel = require('../models/exampleModel');

// Test endpoint
exports.test = async (req, res) => {
  try {
    res.json({
      message: 'API đang hoạt động!',
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all examples
exports.getAll = async (req, res) => {
  try {
    const examples = await ExampleModel.find();
    res.json(examples);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get example by ID
exports.getById = async (req, res) => {
  try {
    const example = await ExampleModel.findById(req.params.id);
    if (!example) {
      return res.status(404).json({ error: 'Không tìm thấy' });
    }
    res.json(example);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create example
exports.create = async (req, res) => {
  try {
    const example = new ExampleModel(req.body);
    await example.save();
    res.status(201).json(example);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update example
exports.update = async (req, res) => {
  try {
    const example = await ExampleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!example) {
      return res.status(404).json({ error: 'Không tìm thấy' });
    }
    res.json(example);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete example
exports.delete = async (req, res) => {
  try {
    const example = await ExampleModel.findByIdAndDelete(req.params.id);
    if (!example) {
      return res.status(404).json({ error: 'Không tìm thấy' });
    }
    res.json({ message: 'Đã xóa thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


