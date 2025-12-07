import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

// GET /api/inquiries - List all inquiries (admin only)
export async function GET() {
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
        const User = (await import('@/models/User')).default;
        const user = await User.findOne({ clerkId: userId });

        if (!user || user.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Forbidden - Admin access required' },
                { status: 403 }
            );
        }

        const inquiries = await Inquiry.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: inquiries,
        });
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch inquiries' },
            { status: 500 }
        );
    }
}

// POST /api/inquiries - Submit new inquiry (public)
export async function POST(request: Request) {
    console.log('API: POST /api/inquiries called');
    try {
        await connectDB();
        console.log('API: Connected to DB');

        const body = await request.json();
        console.log('API: Body received', body);
        const { name, email, phone, service, message } = body;

        // Validate required fields
        if (!name || !email || !service || !message) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const inquiry = await Inquiry.create({
            name,
            email,
            phone,
            service,
            message,
            status: 'new',
        });

        // TODO: Trigger Inngest function to send notification email

        return NextResponse.json({
            success: true,
            data: inquiry,
            message: 'Thank you for your inquiry! We will contact you shortly.',
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating inquiry:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to submit inquiry', details: error.message },
            { status: 500 }
        );
    }
}
