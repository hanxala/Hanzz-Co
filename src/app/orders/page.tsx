'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CURRENCY } from '@/lib/constants';
import { getOrderStatus, formatOrderDate } from '@/lib/orderUtils';
import './orders.css';

interface Order {
    _id: string;
    items: Array<{
        productName: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    status: string;
    createdAt: string;
    shippingAddress: {
        fullName: string;
        city: string;
        state: string;
    };
}

export default function OrdersPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/sign-in?redirect=/orders');
        } else if (user) {
            fetchOrders();
        }
    }, [isLoaded, user, filterStatus]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            let url = '/api/orders';
            if (filterStatus !== 'all') {
                url += `?status=${filterStatus}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            if (data.success) {
                setOrders(data.data || []);
            } else {
                setError('Failed to load orders');
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded || !user) {
        return <div className="loading-state">Loading...</div>;
    }

    return (
        <div className="orders-page">
            <div className="container">
                <h1 className="orders-title">My Orders</h1>

                {/* Filter */}
                <div className="orders-filter">
                    <button
                        className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('all')}
                    >
                        All Orders
                    </button>
                    <button
                        className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`filter-btn ${filterStatus === 'processing' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('processing')}
                    >
                        Processing
                    </button>
                    <button
                        className={`filter-btn ${filterStatus === 'shipped' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('shipped')}
                    >
                        Shipped
                    </button>
                    <button
                        className={`filter-btn ${filterStatus === 'delivered' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('delivered')}
                    >
                        Delivered
                    </button>
                </div>

                {loading ? (
                    <div className="loading-state">Loading orders...</div>
                ) : error ? (
                    <div className="error-state">
                        <p>{error}</p>
                        <button onClick={fetchOrders} className="btn btn-primary">Retry</button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <h2>No Orders Found</h2>
                        <p>You haven't placed any orders yet.</p>
                        <Link href="/collections" className="btn btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => {
                            const statusInfo = getOrderStatus(order.status);
                            return (
                                <Link
                                    href={`/orders/${order._id}`}
                                    key={order._id}
                                    className="order-card"
                                >
                                    <div className="order-header">
                                        <div>
                                            <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="order-date">{formatOrderDate(order.createdAt)}</p>
                                        </div>
                                        <span
                                            className="order-status-badge"
                                            style={{ backgroundColor: statusInfo?.color }}
                                        >
                                            {statusInfo?.label}
                                        </span>
                                    </div>
                                    <div className="order-body">
                                        <div className="order-items">
                                            <p className="items-count">
                                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                            </p>
                                            <p className="items-preview">
                                                {order.items.slice(0, 2).map(item => item.productName).join(', ')}
                                                {order.items.length > 2 && ` +${order.items.length - 2} more`}
                                            </p>
                                        </div>
                                        <div className="order-total">
                                            <p className="total-label">Total</p>
                                            <p className="total-amount">{CURRENCY.symbol}{order.totalAmount}</p>
                                        </div>
                                    </div>
                                    <div className="order-footer">
                                        <p className="shipping-to">
                                            Shipping to: {order.shippingAddress.city}, {order.shippingAddress.state}
                                        </p>
                                        <span className="view-details">View Details →</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
