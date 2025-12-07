// Script to seed the database with sample products
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Product Schema (matching the model)
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['menswear', 'womenswear', 'accessories']
    },
    price: { type: Number, required: true },
    images: [{ type: String }],
    sizes: [{ type: String }],
    colors: [{ type: String }],
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const sampleProducts = [
    {
        name: 'Tailored Suit - Midnight Black',
        description: 'Impeccably crafted three-piece suit in premium Italian wool. Features hand-stitched lapels and custom lining.',
        category: 'menswear',
        price: 2499,
        images: ['/collection_menswear_1764223166571.png'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Navy', 'Charcoal'],
        inStock: true,
        featured: true
    },
    {
        name: 'Classic Blazer - Navy',
        description: 'Single-breasted blazer with notch lapels. Perfect for business or casual elegance.',
        category: 'menswear',
        price: 1799,
        images: ['/collection_menswear_1764223166571.png'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Navy', 'Gray', 'Brown'],
        inStock: true,
        featured: false
    },
    {
        name: 'Evening Gown - Champagne',
        description: 'Floor-length silk gown with delicate beading. Designed for unforgettable evenings.',
        category: 'womenswear',
        price: 3299,
        images: ['/collection_womenswear_1764223196318.png'],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Champagne', 'Emerald', 'Ruby'],
        inStock: true,
        featured: true
    },
    {
        name: 'Silk Dress - Pearl White',
        description: 'Elegant midi dress in pure silk. Timeless design with modern sophistication.',
        category: 'womenswear',
        price: 2899,
        images: ['/collection_womenswear_1764223196318.png'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['White', 'Ivory', 'Blush'],
        inStock: true,
        featured: false
    },
    {
        name: 'Luxury Accessories Set',
        description: 'Curated collection of premium leather goods including wallet, belt, and card holder.',
        category: 'accessories',
        price: 1899,
        images: ['/accessories_collection_1764223263858.png'],
        sizes: ['One Size'],
        colors: ['Black', 'Brown', 'Tan'],
        inStock: true,
        featured: true
    },
    {
        name: 'Designer Handbag',
        description: 'Handcrafted Italian leather handbag with gold hardware. A statement piece.',
        category: 'accessories',
        price: 2199,
        images: ['/accessories_collection_1764223263858.png'],
        sizes: ['One Size'],
        colors: ['Black', 'Burgundy', 'Camel'],
        inStock: true,
        featured: false
    }
];

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing products
        console.log('Clearing existing products...');
        await Product.deleteMany({});
        console.log('Existing products cleared');

        // Insert sample products
        console.log('Inserting sample products...');
        const result = await Product.insertMany(sampleProducts);
        console.log(`✅ Successfully seeded ${result.length} products`);

        // Display seeded products
        console.log('\nSeeded Products:');
        result.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`);
        });

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
}

seedDatabase();
