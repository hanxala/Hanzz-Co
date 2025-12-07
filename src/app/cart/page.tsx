'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { CURRENCY, getWhatsAppLink } from '@/lib/constants';
import './cart.css';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    const handleCheckout = () => {
        // Create a detailed message for WhatsApp checkout
        const itemsList = cart.map(item =>
            `- ${item.name} (${item.size}, ${item.color}) x${item.quantity}: ${CURRENCY.symbol}${item.price * item.quantity}`
        ).join('\n');

        const message = `Hi Hanzz & Co., I would like to place an order:\n\n${itemsList}\n\nTotal: ${CURRENCY.symbol}${cartTotal}\n\nPlease confirm availability and payment details.`;

        window.open(getWhatsAppLink(message), '_blank');
    };

    if (cart.length === 0) {
        return (
            <div className="cart-empty-state">
                <div className="container">
                    <h1>Your Cart is Empty</h1>
                    <p>Looks like you haven't added any luxury pieces to your collection yet.</p>
                    <Link href="/collections" className="btn btn-primary">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="cart-title">Shopping Cart</h1>

                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={`${item.id}-${item.size}-${item.color}`} className="cart-item">
                                <div className="cart-item-image">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={100}
                                        height={133}
                                        className="item-img"
                                    />
                                </div>
                                <div className="cart-item-details">
                                    <div className="item-header">
                                        <h3 className="item-name">{item.name}</h3>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.id, item.size, item.color)}
                                            aria-label="Remove item"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M18 6L6 18M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="item-price">{CURRENCY.symbol}{item.price}</p>
                                    <div className="item-specs">
                                        <span>Size: {item.size}</span>
                                        <span className="separator">|</span>
                                        <span>Color: {item.color}</span>
                                    </div>
                                    <div className="item-quantity">
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="qty-val">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button className="clear-cart-btn" onClick={clearCart}>
                            Clear Cart
                        </button>
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{CURRENCY.symbol}{cartTotal}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>{CURRENCY.symbol}{cartTotal}</span>
                        </div>

                        <button className="checkout-btn" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>

                        <p className="checkout-note">
                            Checkout is processed securely via WhatsApp. Our team will confirm your order and provide payment details.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
