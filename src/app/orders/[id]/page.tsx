'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { CURRENCY } from '@/lib/constants';
import { formatOrderDate, getEstimatedDelivery } from '@/lib/orderUtils';
import OrderStatusTimeline from '@/components/OrderStatusTimeline';
import '../orders.css';

interface OrderItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    paymentStatus: string;
    shippingAddress: {
        fullName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone: string;
    };
    trackingNumber?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isLoaded } = useUser();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);

    const isNewOrder = searchParams.get('new') === 'true';

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/sign-in?redirect=/orders');
        } else if (user && params.id) {
            fetchOrder();
        }
    }, [isLoaded, user, params.id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`/api/orders/${params.id}`);
            const data = await res.json();

            if (data.success) {
                setOrder(data.data);
            } else {
                setError(data.error || 'Failed to load order');
            }
        } catch (err) {
            console.error('Error fetching order:', err);
            setError('Failed to load order');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        try {
            setCancelling(true);
            const res = await fetch(`/api/orders/${params.id}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (data.success) {
                fetchOrder(); // Refresh order data
            } else {
                alert(data.error || 'Failed to cancel order');
            }
        } catch (err) {
            console.error('Error cancelling order:', err);
            alert('Failed to cancel order');
        } finally {
            setCancelling(false);
        }
    };

    if (!isLoaded || !user) {
        return <div className="loading-state">Loading...</div>;
    }

    if (loading) {
        return (
            <div className="order-details-page">
                <div className="container">
                    <div className="loading-state">Loading order details...</div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="order-details-page">
                <div className="container">
                    <div className="error-state">
                        <h2>Order Not Found</h2>
                        <p>{error || 'The order you are looking for does not exist.'}</p>
                        <button onClick={() => router.push('/orders')} className="btn btn-primary">
                            Back to Orders
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="order-details-page">
            <div className="container">
                {isNewOrder && (
                    <div className="success-banner">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <div>
                            <h3>Order Placed Successfully!</h3>
                            <p>Thank you for your order. We'll process it shortly.</p>
                        </div>
                    </div>
                )}

                <div className="order-details-header">
                    <div>
                        <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
                        <p className="order-date">Placed on {formatOrderDate(order.createdAt)}</p>
                    </div>
                    <button onClick={() => router.push('/orders')} className="btn btn-outline">
                        ← Back to Orders
                    </button>
                </div>

                <div className="order-details-layout">
                    {/* Main Content */}
                    <div className="order-main">
                        {/* Status Timeline */}
                        <div className="details-section">
                            <h2>Order Status</h2>
                            <OrderStatusTimeline currentStatus={order.status} />
                            {order.status === 'shipped' && order.trackingNumber && (
                                <div className="tracking-info">
                                    <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                                    <p className="tracking-note">Use this number to track your shipment with the carrier</p>
                                </div>
                            )}
                            {order.status === 'delivered' && (
                                <div className="delivery-info">
                                    <p>✓ Delivered on {formatOrderDate(order.updatedAt)}</p>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="details-section">
                            <h2>Order Items</h2>
                            <div className="order-items-list">
                                {order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <div className="item-details">
                                            <h3>{item.productName}</h3>
                                            {item.size && item.color && (
                                                <p className="item-specs">
                                                    Size: {item.size} | Color: {item.color}
                                                </p>
                                            )}
                                            <p className="item-qty">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="item-price">
                                            <p className="price">{CURRENCY.symbol}{item.price}</p>
                                            <p className="subtotal">
                                                Subtotal: {CURRENCY.symbol}{item.price * item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="details-section">
                            <h2>Shipping Address</h2>
                            <div className="address-card">
                                <p><strong>{order.shippingAddress.fullName}</strong></p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.country}</p>
                                <p>Phone: {order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        {order.notes && (
                            <div className="details-section">
                                <h2>Order Notes</h2>
                                <p className="order-notes">{order.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="order-sidebar">
                        <div className="summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>{CURRENCY.symbol}{order.totalAmount}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>FREE</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>{CURRENCY.symbol}{order.totalAmount}</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="payment-info">
                                <p><strong>Payment Method</strong></p>
                                <p>Cash on Delivery</p>
                                <p className="payment-status">
                                    Status: {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending Payment'}
                                </p>
                            </div>
                        </div>

                        {(order.status === 'pending' || order.status === 'processing') && (
                            <button
                                className="btn btn-danger btn-block"
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                            >
                                {cancelling ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
