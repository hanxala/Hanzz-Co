import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Inquiry from '@/models/Inquiry';

export async function GET() {
    try {
        await connectDB();

        // Get product statistics
        const totalProducts = await Product.countDocuments();
        const productsInStock = await Product.countDocuments({ inStock: true });
        const featuredProducts = await Product.countDocuments({ featured: true });

        // Get inquiry statistics
        const totalInquiries = await Inquiry.countDocuments();
        const newInquiries = await Inquiry.countDocuments({ status: 'new' });
        const contactedInquiries = await Inquiry.countDocuments({ status: 'contacted' });
        const resolvedInquiries = await Inquiry.countDocuments({ status: 'resolved' });

        // Get recent items
        const recentProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name category price createdAt');

        const recentInquiries = await Inquiry.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email service status createdAt');

        return NextResponse.json({
            success: true,
            data: {
                products: {
                    total: totalProducts,
                    inStock: productsInStock,
                    featured: featuredProducts,
                    outOfStock: totalProducts - productsInStock
                },
                inquiries: {
                    total: totalInquiries,
                    new: newInquiries,
                    contacted: contactedInquiries,
                    resolved: resolvedInquiries
                },
                recent: {
                    products: recentProducts,
                    inquiries: recentInquiries
                }
            }
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
