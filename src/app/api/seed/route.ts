import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

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

export async function POST() {
    try {
        await connectDB();

        // Clear existing products
        await Product.deleteMany({});

        // Insert sample products
        const result = await Product.insertMany(sampleProducts);

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${result.length} products`,
            data: result
        });
    } catch (error: any) {
        console.error('Error seeding database:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to seed database', details: error.message },
            { status: 500 }
        );
    }
}
