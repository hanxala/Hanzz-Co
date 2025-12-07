import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    category: 'menswear' | 'womenswear' | 'accessories';
    price: number;
    images: string[];
    sizes: string[];
    colors: string[];
    inStock: boolean;
    featured: boolean;
    sku?: string;
    material?: string;
    careInstructions?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['menswear', 'womenswear', 'accessories'],
            index: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        images: {
            type: [String],
            required: true,
            validate: {
                validator: function (v: string[]) {
                    return v && v.length > 0;
                },
                message: 'At least one image is required',
            },
        },
        sizes: {
            type: [String],
            default: [],
        },
        colors: {
            type: [String],
            default: [],
        },
        inStock: {
            type: Boolean,
            default: true,
            index: true,
        },
        featured: {
            type: Boolean,
            default: false,
            index: true,
        },
        sku: {
            type: String,
            unique: true,
            sparse: true,
        },
        material: {
            type: String,
        },
        careInstructions: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for common queries
ProductSchema.index({ category: 1, inStock: 1 });
ProductSchema.index({ featured: 1, createdAt: -1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
