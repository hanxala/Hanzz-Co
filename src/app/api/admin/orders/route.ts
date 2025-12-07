import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';

// GET /api/admin/orders - Fetch all orders (admin only)
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        // Check if user is admin
        const user = await User.findOne({ clerkId: userId });
        if (user?.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Admin access required' },
                { status: 403 }
            );
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        // Build query
        const query: any = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        // Fetch orders with pagination
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            Order.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments(query)
        ]);

        // Calculate statistics
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        const statistics = {
            total: total,
            byStatus: stats.reduce((acc, stat) => {
                acc[stat._id] = {
                    count: stat.count,
                    revenue: stat.totalAmount
                };
                return acc;
            }, {} as Record<string, { count: number; revenue: number }>)
        };

        return NextResponse.json({
            success: true,
            data: orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            },
            statistics
        });
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
