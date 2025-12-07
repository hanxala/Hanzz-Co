import { auth } from '@clerk/nextjs/server';
import connectDB from './mongodb';
import User from '@/models/User';

export async function isAdmin(): Promise<boolean> {
    try {
        const { userId } = await auth();

        if (!userId) {
            return false;
        }

        await connectDB();
        const user = await User.findOne({ clerkId: userId });

        return user?.role === 'admin';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

export async function requireAdmin() {
    const admin = await isAdmin();

    if (!admin) {
        throw new Error('Unauthorized: Admin access required');
    }

    return true;
}

export async function getCurrentUser() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return null;
        }

        await connectDB();
        const user = await User.findOne({ clerkId: userId });

        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}
