'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { CURRENCY } from '@/lib/constants';
import { validateShippingAddress, type ShippingAddress } from '@/lib/orderUtils';
import './checkout.css';

export default function CheckoutPage() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const { cart, cartTotal, clearCart } = useCart();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [shippingAddress, setShippingAddress] = useState<Partial<ShippingAddress>>({
        fullName: user?.fullName || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phone: ''
    });

    const [notes, setNotes] = useState('');

    // Redirect if cart is empty
    if (cart.length === 0 && isLoaded) {
        router.push('/cart');
        return null;
    }

    // Redirect if not logged in
    if (isLoaded && !user) {
        router.push('/sign-in?redirect=/checkout');
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleContinueToReview = () => {
        const validation = validateShippingAddress(shippingAddress);
        if (!validation.valid) {
            setError(validation.errors.join(', '));
            return;
        }
        setError(null);
        setStep(2);
    };

    const handlePlaceOrder = async () => {
        try {
            setLoading(true);
            setError(null);

            // Prepare order items
            const items = cart.map(item => ({
                productId: item.id,
                productName: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color
            }));

            // Create order
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items,
                    shippingAddress,
                    notes
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to place order');
            }

            // Clear cart
            clearCart();

            // Redirect to order confirmation
            router.push(`/orders/${data.data._id}?new=true`);
        } catch (err: any) {
            console.error('Error placing order:', err);
            setError(err.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="checkout-title">Checkout</h1>

                {/* Progress Indicator */}
                <div className="checkout-progress">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-label">Shipping</div>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-label">Review</div>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="checkout-layout">
                    {/* Main Content */}
                    <div className="checkout-main">
                        {step === 1 && (
                            <div className="shipping-form">
                                <h2>Shipping Address</h2>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label htmlFor="fullName">Full Name *</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={shippingAddress.fullName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label htmlFor="addressLine1">Address Line 1 *</label>
                                        <input
                                            type="text"
                                            id="addressLine1"
                                            name="addressLine1"
                                            value={shippingAddress.addressLine1}
                                            onChange={handleInputChange}
                                            placeholder="Street address, P.O. box"
                                            required
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label htmlFor="addressLine2">Address Line 2</label>
                                        <input
                                            type="text"
                                            id="addressLine2"
                                            name="addressLine2"
                                            value={shippingAddress.addressLine2}
                                            onChange={handleInputChange}
                                            placeholder="Apartment, suite, unit, etc. (optional)"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="city">City *</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={shippingAddress.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="state">State *</label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={shippingAddress.state}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="postalCode">Postal Code *</label>
                                        <input
                                            type="text"
                                            id="postalCode"
                                            name="postalCode"
                                            value={shippingAddress.postalCode}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="country">Country *</label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={shippingAddress.country}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label htmlFor="phone">Phone Number *</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={shippingAddress.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 XXXXXXXXXX"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    className="btn btn-primary btn-continue"
                                    onClick={handleContinueToReview}
                                >
                                    Continue to Review
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="order-review">
                                <h2>Review Your Order</h2>

                                {/* Shipping Address Review */}
                                <div className="review-section">
                                    <div className="section-header">
                                        <h3>Shipping Address</h3>
                                        <button className="btn-link" onClick={() => setStep(1)}>Edit</button>
                                    </div>
                                    <div className="address-display">
                                        <p><strong>{shippingAddress.fullName}</strong></p>
                                        <p>{shippingAddress.addressLine1}</p>
                                        {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                                        <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                                        <p>{shippingAddress.country}</p>
                                        <p>Phone: {shippingAddress.phone}</p>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="review-section">
                                    <h3>Payment Method</h3>
                                    <div className="payment-method">
                                        <div className="payment-option selected">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                                <line x1="1" y1="10" x2="23" y2="10"></line>
                                            </svg>
                                            <div>
                                                <p className="payment-title">Cash on Delivery</p>
                                                <p className="payment-desc">Pay when you receive your order</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Notes */}
                                <div className="review-section">
                                    <h3>Order Notes (Optional)</h3>
                                    <textarea
                                        className="notes-textarea"
                                        placeholder="Any special instructions for your order..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={4}
                                    ></textarea>
                                </div>

                                <button
                                    className="btn btn-primary btn-place-order"
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                >
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="checkout-sidebar">
                        <div className="order-summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-items">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.size}-${item.color}`} className="summary-item">
                                        <div className="item-image">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={60}
                                                height={80}
                                            />
                                        </div>
                                        <div className="item-details">
                                            <p className="item-name">{item.name}</p>
                                            <p className="item-specs">{item.size} / {item.color}</p>
                                            <p className="item-qty">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="item-price">
                                            {CURRENCY.symbol}{item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>{CURRENCY.symbol}{cartTotal}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>FREE</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>{CURRENCY.symbol}{cartTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
