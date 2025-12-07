import { serve } from 'inngest/next';
import { inngest, syncUserToDatabase, processInquiry } from '@/lib/inngest';

// Create an API that serves zero-latency functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        syncUserToDatabase,
        processInquiry,
    ],
});
