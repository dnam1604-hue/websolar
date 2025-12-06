const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ProductModel = require('../models/ProductModel');

// Load environment variables
dotenv.config();

const products = [
  {
    name: 'Trụ sạc ô tô – Sạc thường AC 7.4 kW',
    description: `Thiết bị sạc thường Ô tô điện AC 7.4kW là thiết bị cung cấp nguồn điện xoay chiều, thiết kế dạng treo tường/treo trụ, mỗi thiết bị được trang bị 1 cổng sạc, công suất sạc đạt tối đa 7.4kW. Dòng sạc AC không dùng được cho xe VF3.
Kiểu dáng: Treo tường/treo trụ
Điện áp, tần số hoạt động: 1 pha, 220VAC ± 10%, 50/60Hz
Điện áp đầu ra: 220VAC ± 10%
Công suất: 7.4kW/cổng sạc
Số lượng cổng sạc: 1 cổng/trụ sạc
Bảo vệ: Bảo vệ quá tải/quá nhiệt/dòng rò/ngắn mạch/IP54/55`,
    price: '11000000',
    category: 'AC',
    status: 'active',
    image: ''
  },
  {
    name: 'Trụ sạc ô tô – Sạc thường AC 22kW',
    description: `Thiết bị sạc thường Ô tô điện AC 22kW là thiết bị cung cấp nguồn điện xoay chiều, thiết kế dạng treo tường/treo trụ, mỗi thiết bị được trang bị 1 cổng sạc, công suất sạc đạt tối đa 22kW. Dòng sạc AC không sạc được cho xe VF3
Kiểu dáng: Treo tường/treo trụ
Điện áp, tần số hoạt động: 3 pha, 400VAC ± 10%, 50/60Hz
Điện áp đầu ra: 400VAC ± 10%
Công suất: 22kW/cổng sạc
Công suất thực nhận: VF5,6,7S và E34: 7kW VF7plus, Vf8, VF9: 11kW
Số lượng cổng sạc: 1 cổng/trụ sạc
Bảo vệ: Bảo vệ quá tải/quá nhiệt/dòng rò/ngắn mạch/IP54/55`,
    price: '12000000',
    category: 'AC',
    status: 'active',
    image: ''
  },
  {
    name: 'Chân trụ sạc',
    description: `Chân trụ sạc là phụ kiện hỗ trợ lắp đặt trụ sạc điện cho ô tô điện, thiết kế chắc chắn và bền bỉ.
Kiểu dáng: Treo tường/treo trụ
Điện áp, tần số hoạt động: 3 pha, 400VAC ± 10%, 50/60Hz
Điện áp đầu ra: 400VAC ± 10%
Công suất: 22kW/cổng sạc
Công suất thực nhận: VF5,6,7S và E34: 7kW VF7plus, Vf8, VF9: 11kW
Số lượng cổng sạc: 1 cổng/trụ sạc
Bảo vệ: Bảo vệ quá tải/quá nhiệt/dòng rò/ngắn mạch/IP54/55`,
    price: '2300000',
    category: 'AC',
    status: 'active',
    image: ''
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/websolar';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products (optional - comment out if you want to keep existing)
    // await ProductModel.deleteMany({ category: 'AC' });
    // console.log('🗑️  Cleared existing AC products');

    // Check if products already exist
    const existingProducts = await ProductModel.find({ category: 'AC' });
    if (existingProducts.length > 0) {
      console.log(`⚠️  Found ${existingProducts.length} existing AC products. Skipping seed.`);
      console.log('💡 To re-seed, delete existing products first or modify the script.');
      process.exit(0);
    }

    // Insert products
    const insertedProducts = await ProductModel.insertMany(products);
    console.log(`✅ Successfully seeded ${insertedProducts.length} products:`);
    insertedProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ${product.price} VNĐ`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();

