import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

// PATCH - Update inquiry
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const body = await request.json();

        const inquiry = await Inquiry.findByIdAndUpdate(
            params.id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!inquiry) {
            return NextResponse.json(
                { success: false, error: 'Inquiry not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: inquiry,
            message: 'Inquiry updated successfully'
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE inquiry
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const inquiry = await Inquiry.findByIdAndDelete(params.id);

        if (!inquiry) {
            return NextResponse.json(
                { success: false, error: 'Inquiry not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Inquiry deleted successfully'
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
