'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

function CollectionsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get('category');

    // activeCategory state initialization
    const [activeCategory, setActiveCategory] = useState<string>(categoryQuery || 'all');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Update active category when URL changes
    useEffect(() => {
        const cat = searchParams.get('category');
        setActiveCategory(cat || 'all');
    }, [searchParams]);

    // Fetch products when activeCategory changes
    useEffect(() => {
        fetchProducts(activeCategory);
    }, [activeCategory]);

    const fetchProducts = async (category: string) => {
        try {
            setLoading(true);
            setError(null);

            let url = '/api/products';
            if (category && category !== 'all') {
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

    const handleCategoryFilter = (categoryValue: string) => {
        if (categoryValue === 'all') {
            router.push('/collections');
        } else {
            router.push(`/collections?category=${categoryValue}`);
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
                        {['all', 'menswear', 'womenswear', 'accessories'].map((cat) => (
                            <button
                                key={cat}
                                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => handleCategoryFilter(cat)}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
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
                            <button onClick={() => fetchProducts(activeCategory)} className="btn btn-primary">Retry</button>
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

export default function Collections() {
    return (
        <Suspense fallback={<div className="loading-screen">Loading collections...</div>}>
            <CollectionsContent />
        </Suspense>
    );
}
