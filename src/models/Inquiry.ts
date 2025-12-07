import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInquiry extends Document {
    name: string;
    email: string;
    phone?: string;
    service: 'consultation' | 'custom' | 'shopping' | 'general';
    message: string;
    status: 'new' | 'contacted' | 'resolved';
    adminNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        service: {
            type: String,
            required: true,
            enum: ['consultation', 'custom', 'shopping', 'general'],
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['new', 'contacted', 'resolved'],
            default: 'new',
            index: true,
        },
        adminNotes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Index for filtering by status and date
InquirySchema.index({ status: 1, createdAt: -1 });

const Inquiry: Model<IInquiry> = mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
