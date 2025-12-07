'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { CURRENCY, getWhatsAppProductLink } from '@/lib/constants';
import './product-detail.css';

interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    images: string[];
    sizes?: string[];
    colors?: string[];
    inStock: boolean;
    featured: boolean;
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (params.id) {
            fetchProduct(params.id as string);
        }
    }, [params.id]);

    const fetchProduct = async (id: string) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();

            if (data.success) {
                setProduct(data.data);
                // Set default selections
                if (data.data.sizes && data.data.sizes.length > 0) {
                    setSelectedSize(data.data.sizes[0]);
                }
                if (data.data.colors && data.data.colors.length > 0) {
                    setSelectedColor(data.data.colors[0]);
                }
            } else {
                setError(data.error || 'Product not found');
            }
        } catch (err) {
            setError('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Please select a size');
            return;
        }

        if (product.colors && product.colors.length > 0 && !selectedColor) {
            alert('Please select a color');
            return;
        }

        addToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: selectedSize || 'N/A',
            color: selectedColor || 'N/A',
            quantity: quantity
        });

        alert('Added to cart!');
    };

    const handleWhatsAppInquiry = () => {
        if (!product) return;
        window.open(getWhatsAppProductLink(product.name, product.price), '_blank');
    };

    if (loading) {
        return (
            <div className="product-detail-loading">
                <div className="loading-spinner"></div>
                <p>Loading product...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-error">
                <h2>Product Not Found</h2>
                <p>{error || 'The product you are looking for does not exist.'}</p>
                <button onClick={() => router.push('/collections')} className="btn btn-primary">
                    Back to Collections
                </button>
            </div>
        );
    }

    return (
        <div className="product-detail-container">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <a href="/collections">Collections</a>
                <span>/</span>
                <span className="current">{product.name}</span>
            </div>

            <div className="product-detail-content">
                {/* Product Images */}
                <div className="product-images">
                    <div className="main-image">
                        <Image
                            src={product.images[selectedImage] || '/placeholder.png'}
                            alt={product.name}
                            width={600}
                            height={800}
                            className="product-main-image"
                        />
                        {product.featured && (
                            <div className="featured-badge">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                                Featured
                            </div>
                        )}
                    </div>
                    {product.images.length > 1 && (
                        <div className="image-thumbnails">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <Image
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        width={100}
                                        height={133}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <div className="product-header">
                        <span className="product-category">{product.category}</span>
                        <h1 className="product-title">{product.name}</h1>
                        <div className="product-price">{CURRENCY.symbol}{product.price.toFixed(2)}</div>
                        <div className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                            {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                        </div>
                    </div>

                    <div className="product-description">
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="product-options">
                            <h3>Select Size</h3>
                            <div className="size-options">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Color Selection */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="product-options">
                            <h3>Select Color</h3>
                            <div className="color-options">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                                        onClick={() => setSelectedColor(color)}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="product-options">
                        <h3>Quantity</h3>
                        <div className="quantity-selector">
                            <button
                                className="qty-btn"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span className="qty-value">{quantity}</span>
                            <button
                                className="qty-btn"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart & WhatsApp */}
                    <div className="product-actions">
                        <button
                            className="btn btn-primary btn-large"
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                        >
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button
                            className="btn btn-secondary btn-large"
                            onClick={handleWhatsAppInquiry}
                            style={{ borderColor: '#25D366', color: '#25D366' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            WhatsApp Inquiry
                        </button>
                    </div>

                    {/* Product Details */}
                    <div className="product-details">
                        <h3>Product Details</h3>
                        <ul>
                            <li><strong>Category:</strong> {product.category}</li>
                            <li><strong>Availability:</strong> {product.inStock ? 'In Stock' : 'Out of Stock'}</li>
                            {product.sizes && product.sizes.length > 0 && (
                                <li><strong>Available Sizes:</strong> {product.sizes.join(', ')}</li>
                            )}
                            {product.colors && product.colors.length > 0 && (
                                <li><strong>Available Colors:</strong> {product.colors.join(', ')}</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
