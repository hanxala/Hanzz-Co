import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { generateOrderNumber } from '@/lib/orderUtils';

// GET /api/orders - Fetch user's orders
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

        // Find user by clerkId
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Get query parameters for filtering
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        // Build query
        const query: any = { clerkId: userId };
        if (status && status !== 'all') {
            query.status = status;
        }

        // Fetch orders
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        // Find user by clerkId
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { items, shippingAddress, notes } = body;

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Order items are required' },
                { status: 400 }
            );
        }

        if (!shippingAddress) {
            return NextResponse.json(
                { success: false, error: 'Shipping address is required' },
                { status: 400 }
            );
        }

        // Calculate total amount
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order
        const order = await Order.create({
            userId: user._id,
            clerkId: userId,
            items,
            totalAmount,
            shippingAddress,
            notes: notes || '',
            status: 'pending',
            paymentStatus: 'pending'
        });

        // Send WhatsApp notification to admin
        try {
            const { formatNewOrderNotification } = await import('@/lib/whatsappNotifications');
            const notificationMessage = formatNewOrderNotification(order);
            console.log('📱 New Order Notification:', notificationMessage);

            // In production, you would send this via WhatsApp Business API
            // For now, it's logged to console
        } catch (notifError) {
            console.error('Failed to send WhatsApp notification:', notifError);
            // Don't fail the order creation if notification fails
        }

        return NextResponse.json({
            success: true,
            data: order,
            message: 'Order placed successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
