import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

const sampleProducts = [
    // Menswear
    {
        name: "Classic Navy Suit",
        description: "Tailored navy suit crafted from premium Italian wool. Perfect for formal occasions and business meetings.",
        category: "menswear",
        price: 45000,
        images: ["/collection_menswear_1764223166571.png"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Navy", "Charcoal"],
        inStock: true,
        featured: true,
        material: "100% Italian Wool",
        careInstructions: "Dry clean only"
    },
    {
        name: "Premium Cotton Shirt",
        description: "Crisp white cotton shirt with French cuffs. Essential wardrobe staple for the modern gentleman.",
        category: "menswear",
        price: 8500,
        images: ["/collection_menswear_1764223166571.png"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Light Blue", "Pink"],
        inStock: true,
        featured: false,
        material: "Egyptian Cotton",
        careInstructions: "Machine wash cold"
    },
    {
        name: "Leather Oxford Shoes",
        description: "Handcrafted leather oxford shoes with Goodyear welt construction.",
        category: "menswear",
        price: 18000,
        images: ["/collection_menswear_1764223166571.png"],
        sizes: ["7", "8", "9", "10", "11"],
        colors: ["Black", "Brown"],
        inStock: true,
        featured: true,
        material: "Full Grain Leather",
        careInstructions: "Polish regularly"
    },

    // Womenswear
    {
        name: "Silk Evening Gown",
        description: "Elegant floor-length silk gown with intricate beadwork. Perfect for galas and special occasions.",
        category: "womenswear",
        price: 65000,
        images: ["/collection_menswear_1764223166571.png"],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Emerald", "Ruby Red", "Midnight Blue"],
        inStock: true,
        featured: true,
        material: "100% Silk",
        careInstructions: "Dry clean only"
    },
    {
        name: "Cashmere Wrap",
        description: "Luxurious cashmere wrap shawl, perfect for layering over evening wear.",
        category: "womenswear",
        price: 28000,
        images: ["/collection_menswear_1764223166571.png"],
        sizes: ["One Size"],
        colors: ["Ivory", "Charcoal", "Burgundy"],
        inStock: true,
        featured: true,
        material: "100% Cashmere",
        careInstructions: "Hand wash cold"
    },
    {
        name: "Designer Cocktail Dress",
        description: "Sophisticated cocktail dress with modern silhouette and premium fabric.",
        category: "womenswear",
        price: 42000,
        images: ["/collection_menswear_1764223166571.png"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Navy", "Wine"],
        inStock: true,
        featured: false,
        material: "Silk Blend",
        careInstructions: "Dry clean only"
    },
    {
        name: "Tailored Blazer",
        description: "Classic tailored blazer with contemporary fit. Versatile piece for work and evening.",
        category: "womenswear",
        price: 35000,
        images: ["/collection_menswear_1764223166571.png"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Camel", "Navy"],
        inStock: true,
        featured: false,
        material: "Wool Blend",
        careInstructions: "Dry clean only"
    },

    // Accessories
    {
        name: "Italian Leather Handbag",
        description: "Handcrafted Italian leather handbag with gold hardware. Timeless elegance.",
        category: "accessories",
        price: 55000,
        images: ["/collection_menswear_1764223166571.png"],
        sizes: ["One Size"],
        colors: ["Black", "Tan", "Burgundy"],
        inStock: true,
        featured: true,
        material: "Italian Leather",
        careInstructions: "Clean with leather conditioner"
    },
    {
        name: "Swiss Automatic Watch",
        description: "Luxury Swiss-made automatic watch with sapphire crystal and leather strap.",
        category: "accessories",
        price: 125000,
        images: ["/collection_menswear_1764223166571.png"],
        sizes: ["One Size"],
        colors: ["Silver", "Gold", "Rose Gold"],
        inStock: true,
        featured: true,
        material: "Stainless Steel",
        careInstructions: "Water resistant to 50m"
    },
    {
        name: "Silk Scarf",
        description: "Hand-printed silk scarf with exclusive pattern design.",
        category: "accessories",
        price: 12000,
        images: ["/collection_menswear_1764223166571.png"],
        sizes: ["One Size"],
        colors: ["Floral", "Geometric", "Abstract"],
        inStock: true,
        featured: false,
        material: "100% Silk",
        careInstructions: "Dry clean only"
    },
    {
        name: "Diamond Stud Earrings",
        description: "Classic diamond stud earrings in 18k gold setting. Certified diamonds.",
        category: "accessories",
        price: 85000,
        images: ["/collection_menswear_1764223166571.png"],
        sizes: ["One Size"],
        colors: ["White Gold", "Yellow Gold", "Rose Gold"],
        inStock: true,
        featured: true,
        material: "18K Gold, Diamonds",
        careInstructions: "Clean with jewelry cloth"
    },
    {
        name: "Leather Belt",
        description: "Premium leather belt with polished buckle. Essential accessory.",
        category: "accessories",
        price: 8500,
        images: ["/collection_menswear_1764223166571.png"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Brown"],
        inStock: true,
        featured: false,
        material: "Full Grain Leather",
        careInstructions: "Wipe clean"
    }
];

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Clear existing products (optional - remove in production)
        // await Product.deleteMany({});

        // Insert sample products
        const products = await Product.insertMany(sampleProducts);

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${products.length} products`,
            data: products
        }, { status: 201 });
    } catch (error) {
        console.error('Error seeding products:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to seed products' },
            { status: 500 }
        );
    }
}
