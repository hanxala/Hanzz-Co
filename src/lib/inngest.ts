import { Inngest } from 'inngest';
import connectDB from './mongodb';
import User from '@/models/User';
import Inquiry from '@/models/Inquiry';

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'hanzz-co' });

// Define functions
export const syncUserToDatabase = inngest.createFunction(
    { id: 'sync-user-to-db' },
    { event: 'clerk/user.created' },
    async ({ event, step }) => {
        await step.run('connect-db', async () => {
            await connectDB();
        });

        await step.run('create-user', async () => {
            const { id, email_addresses, first_name, last_name, image_url } = event.data;

            // Check if user exists
            const existingUser = await User.findOne({ clerkId: id });
            if (existingUser) return;

            await User.create({
                clerkId: id,
                email: email_addresses[0].email_address,
                // For now we'll just log it
                await step.run('log-inquiry', async () => {
                    console.log(`Processing inquiry for ${inquiry.email}: ${inquiry.service}`);
                });
            }
            );
