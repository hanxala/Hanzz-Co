'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CURRENCY } from '@/lib/constants';
import './collections.css';

interface Product {
    _id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    images: string[];
    inStock: boolean;
    featured: boolean;
}

export default function Collections() {
    const searchParams = useSearchParams();
    const category = searchParams.get('category');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, [category]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            let url = '/api/products';
            if (category) {
                url += `?category=${category}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            if (data.success) {
                setProducts(data.data || []);
            } else {
                setError('Failed to load products');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Page Hero */}
            <section className="page-hero">
                <div className="hero-image-wrapper">
                    <Image
                        src="/hero_collections.png"
                        alt="Collections"
                        fill
                        priority
                        className="hero-image"
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="hero-overlay"></div>
                </div>
                <div className="page-hero-content">
                    <h1 className="page-hero-title">Our Collections</h1>
                    <p className="page-hero-description">
                        Discover timeless pieces crafted with exceptional attention to detail
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="filters-section">
                <div className="container">
                    <div className="filters">
                        <button className="filter-btn active">All</button>
                        <button className="filter-btn">Menswear</button>
                        <button className="filter-btn">Womenswear</button>
                        <button className="filter-btn">Accessories</button>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="section">
                <div className="container">
                    {loading ? (
                        <div className="loading-state">
                            <p>Loading products...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                            <button onClick={fetchProducts} className="btn btn-primary">Retry</button>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            <p>No products available at the moment</p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products.map((product: Product) => (
                                <Link
                                    href={`/products/${product._id}`}
                                    key={product._id}
                                    className="product-card"
                                >
                                    <div className="product-image-wrapper">
                                        <Image
                                            src={product.images[0] || '/collection_menswear_1764223166571.png'}
                                            alt={product.name}
                                            width={500}
                                            height={700}
                                            className="product-image"
                                        />
                                        <div className="product-overlay">
                                            <button className="btn btn-outline-light">View Details</button>
                                        </div>
                                    </div>
                                    <div className="product-info">
                                        <span className="product-category">{product.category}</span>
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-price">{CURRENCY.symbol}{product.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="collections-cta">
                <div className="container">
                    <div className="text-center">
                        <h2 className="cta-title">Need Styling Assistance?</h2>
                        <p className="cta-description">
                            Our expert stylists are here to help you find the perfect pieces
                        </p>
                        <a href="/contact" className="btn btn-secondary">
                            Book Consultation
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
