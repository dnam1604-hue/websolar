const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const exampleController = require('../controllers/exampleController');
const newsController = require('../controllers/newsController');
const stationController = require('../controllers/stationController');
const productController = require('../controllers/productController');
const contactController = require('../controllers/contactController');

// Test route
router.get('/test', exampleController.test);

// Example routes (có thể xóa sau)
router.get('/examples', exampleController.getAll);
router.post('/examples', exampleController.create);
router.get('/examples/:id', exampleController.getById);
router.put('/examples/:id', exampleController.update);
router.delete('/examples/:id', exampleController.delete);

// News routes
router.get('/news', newsController.getAll);
router.post('/news', newsController.create);
router.get('/news/:id', newsController.getById);
router.put('/news/:id', newsController.update);
router.delete('/news/:id', newsController.delete);

// Station routes
router.get('/stations', stationController.getAll);
router.post('/stations', stationController.create);
router.get('/stations/:id', stationController.getById);
router.put('/stations/:id', stationController.update);
router.delete('/stations/:id', stationController.delete);

// Product routes
router.get('/products', productController.getAll);
router.post('/products', productController.create);
router.get('/products/:id', productController.getById);
router.put('/products/:id', productController.update);
router.delete('/products/:id', productController.delete);

// Contact routes
router.get('/contacts', contactController.getAll);
router.post('/contacts', contactController.create);
router.get('/contacts/:id', contactController.getById);
router.put('/contacts/:id', contactController.update);
router.delete('/contacts/:id', contactController.delete);

// Upload image route
router.post('/upload/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Không có file được upload'
      });
    }

    // Trả về URL của ảnh đã upload
    const imageUrl = `/api/images/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Upload ảnh thành công',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Lỗi khi upload ảnh'
    });
  }
});

module.exports = router;


