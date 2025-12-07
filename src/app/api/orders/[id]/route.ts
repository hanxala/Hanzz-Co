import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';

// GET /api/orders/[id] - Fetch single order
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();
        const { id } = await params;

        const order = await Order.findById(id).lean();

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Check if user owns this order or is admin
        const user = await User.findOne({ clerkId: userId });
        const isAdmin = user?.role === 'admin';

        if (order.clerkId !== userId && !isAdmin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

// PATCH /api/orders/[id] - Update order (admin only)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();
        const { id } = await params;

        // Check if user is admin
        const user = await User.findOne({ clerkId: userId });
        if (user?.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { status, trackingNumber, paymentStatus, notes } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        if (notes !== undefined) updateData.notes = notes;

        const order = await Order.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: order,
            message: 'Order updated successfully'
        });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update order' },
            { status: 500 }
        );
    }
}

// DELETE /api/orders/[id] - Cancel order
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();
        const { id } = await params;

        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Check if user owns this order or is admin
        const user = await User.findOne({ clerkId: userId });
        const isAdmin = user?.role === 'admin';

        if (order.clerkId !== userId && !isAdmin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            );
        }

        // Only allow cancellation if order is pending or processing
        if (order.status !== 'pending' && order.status !== 'processing') {
            return NextResponse.json(
                { success: false, error: 'Cannot cancel order at this stage' },
                { status: 400 }
            );
        }

        order.status = 'cancelled';
        await order.save();

        // Send WhatsApp notification to admin about cancellation
        try {
            const { formatOrderCancellationNotification } = await import('@/lib/whatsappNotifications');
            const notificationMessage = formatOrderCancellationNotification(order);
            console.log('📱 Order Cancellation Notification:', notificationMessage);
        } catch (notifError) {
            console.error('Failed to send cancellation notification:', notifError);
        }

        return NextResponse.json({
            success: true,
            message: 'Order cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to cancel order' },
            { status: 500 }
        );
    }
}
