const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ProductModel = require('../models/ProductModel');

// Load environment variables
dotenv.config();

const dcProducts = [
  {
    name: 'Trụ sạc ô tô - Sạc nhanh DC 20kW',
    description: `Thiết bị sạc nhanh Ô tô điện DC 20kW là thiết bị cung cấp nguồn điện một chiều, thiết kế dạng treo tường/treo trụ, mỗi thiết bị được trang bị 1 cổng sạc, công suất sạc đạt tối đa 20kW.
Kiểu dáng: Treo tường/treo trụ
Điện áp, tần số hoạt động: 3 pha, 400VAC ± 10%, 50/60Hz
Điện áp đầu ra: 200-1000 VDC
Công suất: 20kW/cổng sạc
Số lượng cổng sạc: 1 cổng/trụ sạc
Bảo vệ: Bảo vệ quá tải/quá nhiệt/dòng rò/ngắn mạch/IP54/55`,
    price: '96000000',
    category: 'DC',
    status: 'active',
    image: ''
  },
  {
    name: 'Trụ sạc ô tô - Sạc nhanh DC 30kW',
    description: `Thiết bị sạc nhanh Ô tô điện DC 30kW là thiết bị cung cấp nguồn điện một chiều, thiết kế dạng treo tường/treo trụ, mỗi thiết bị được trang bị 1 cổng sạc, công suất sạc đạt tối đa 30kW.
Kiểu dáng: Treo tường/treo trụ
Điện áp, tần số hoạt động: 3 pha, 400VAC ± 10%, 50/60Hz
Điện áp đầu ra: 200-1000 VDC
Công suất: 30kW/cổng sạc
Số lượng cổng sạc: 1 cổng/trụ sạc
Bảo vệ: Bảo vệ quá tải/quá nhiệt/dòng rò/ngắn mạch/IP54/55`,
    price: '143000000',
    category: 'DC',
    status: 'active',
    image: ''
  },
  {
    name: 'Trụ sạc ô tô - Sạc nhanh DC 60kW',
    description: `Thiết bị sạc nhanh Ô tô điện DC 60kW là thiết bị cung cấp nguồn điện một chiều, thiết kế dạng tủ đứng, mỗi thiết bị được trang bị 2 cổng sạc, công suất sạc đạt tối đa 60kW/80kW tùy theo vị trí trạm.
Kiểu dáng: Tủ đứng
Điện áp, tần số hoạt động: 3 pha, 400VAC ± 10%, 50/60Hz
Điện áp đầu ra: 200-1000 VDC
Công suất: 60kW/cổng sạc
Số lượng cổng sạc: 2 cổng/trụ sạc
Bảo vệ: Bảo vệ quá tải/quá nhiệt/dòng rò/ngắn mạch/IP54/55`,
    price: '278000000',
    category: 'DC',
    status: 'active',
    image: ''
  },
  {
    name: 'Trụ sạc ô tô - Sạc siêu nhanh DC 120kW',
    description: `Thiết bị sạc siêu nhanh Ô tô điện DC 120kW là thiết bị cung cấp nguồn điện một chiều, thiết kế dạng tủ đứng, mỗi thiết bị được trang bị 2 cổng sạc, công suất sạc đạt tối đa 120kW tùy theo vị trí trạm.
Kiểu dáng: Tủ đứng
Điện áp, tần số hoạt động: 3 pha, 400VAC ± 10%, 50/60Hz
Điện áp đầu ra: 200-1000 VDC
Công suất: 120kW/cổng sạc
Số lượng cổng sạc: 2 cổng/trụ sạc
Bảo vệ: Bảo vệ quá tải/quá nhiệt/dòng rò/ngắn mạch/IP54/55`,
    price: '416000000',
    category: 'DC',
    status: 'active',
    image: ''
  },
  {
    name: 'Trụ sạc ô tô - Sạc siêu nhanh DC 150kW',
    description: `Thiết bị sạc siêu nhanh Ô tô điện DC 150kW là thiết bị cung cấp nguồn điện một chiều, thiết kế dạng tủ đứng, mỗi thiết bị được trang bị 2 cổng sạc, công suất sạc đạt tối đa 150kW tùy theo vị trí trạm.
Kiểu dáng: Tủ đứng
Điện áp, tần số hoạt động: 3 pha, 400VAC ± 10%, 50/60Hz
Điện áp đầu ra: 200-1000 VDC
Công suất: 120kW/150kW/cổng sạc
Số lượng cổng sạc: 2 cổng/trụ sạc
Bảo vệ: Bảo vệ quá tải/quá nhiệt/dòng rò/ngắn mạch/IP54/55`,
    price: '526000000',
    category: 'DC',
    status: 'active',
    image: ''
  },
  {
    name: 'Trụ sạc ô tô - Sạc siêu nhanh DC 300kW',
    description: `Thiết bị sạc siêu nhanh Ô tô điện DC 300kW là thiết bị cung cấp nguồn điện một chiều, thiết kế dạng tủ đứng, mỗi thiết bị được trang bị 1 cổng sạc, công suất sạc đạt tối đa 300kW.
Kiểu dáng: Tủ đứng
Điện áp, tần số hoạt động: 3 pha, 400VAC ± 10%, 50/60Hz
Điện áp đầu ra: 200-1000 VDC
Công suất: 300 kW/cổng sạc
Số lượng cổng sạc: 1 cổng/trụ sạc
Bảo vệ: Bảo vệ quá tải/quá nhiệt/dòng rò/ngắn mạch/IP54/55`,
    price: 'Liên hệ',
    category: 'DC',
    status: 'active',
    image: ''
  }
];

const seedDCProducts = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/websolar';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check if DC products already exist
    const existingProducts = await ProductModel.find({ category: 'DC' });
    if (existingProducts.length > 0) {
      console.log(`⚠️  Found ${existingProducts.length} existing DC products. Skipping seed.`);
      console.log('💡 To re-seed, delete existing DC products first or modify the script.');
      process.exit(0);
    }

    // Insert products
    const insertedProducts = await ProductModel.insertMany(dcProducts);
    console.log(`✅ Successfully seeded ${insertedProducts.length} DC products:`);
    insertedProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ${product.price} VNĐ`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding DC products:', error);
    process.exit(1);
  }
};

seedDCProducts();

