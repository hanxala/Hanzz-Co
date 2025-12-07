// Order utility functions for validation, status management, and tracking

export interface OrderStatus {
    value: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    label: string;
    color: string;
    description: string;
}

export const ORDER_STATUSES: OrderStatus[] = [
    {
        value: 'pending',
        label: 'Pending',
        color: '#f59e0b',
        description: 'Order received and awaiting processing'
    },
    {
        value: 'processing',
        label: 'Processing',
        color: '#3b82f6',
        description: 'Order is being prepared'
    },
    {
        value: 'shipped',
        label: 'Shipped',
        color: '#8b5cf6',
        description: 'Order has been shipped'
    },
    {
        value: 'delivered',
        label: 'Delivered',
        color: '#10b981',
        description: 'Order has been delivered'
    },
    {
        value: 'cancelled',
        label: 'Cancelled',
        color: '#ef4444',
        description: 'Order has been cancelled'
    }
];

export const PAYMENT_METHODS = {
    COD: {
        value: 'cod',
        label: 'Cash on Delivery',
        description: 'Pay when you receive your order'
    }
};

export const SHIPPING_CARRIERS = [
    { value: 'fedex', label: 'FedEx', trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=' },
    { value: 'ups', label: 'UPS', trackingUrl: 'https://www.ups.com/track?tracknum=' },
    { value: 'dhl', label: 'DHL', trackingUrl: 'https://www.dhl.com/en/express/tracking.html?AWB=' },
    { value: 'usps', label: 'USPS', trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=' },
    { value: 'other', label: 'Other', trackingUrl: '' }
];

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `HZ${timestamp}${random}`;
}

/**
 * Get order status details
 */
export function getOrderStatus(status: string): OrderStatus | undefined {
    return ORDER_STATUSES.find(s => s.value === status);
}

/**
 * Check if status transition is valid
 */
export function isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const newIndex = statusOrder.indexOf(newStatus);

    // Can always cancel
    if (newStatus === 'cancelled') return true;

    // Cannot change from cancelled or delivered
    if (currentStatus === 'cancelled' || currentStatus === 'delivered') return false;

    // Can only move forward or stay same
    return newIndex >= currentIndex;
}

/**
 * Generate tracking URL
 */
export function getTrackingUrl(carrier: string, trackingNumber: string): string {
    const carrierInfo = SHIPPING_CARRIERS.find(c => c.value === carrier);
    if (!carrierInfo || !carrierInfo.trackingUrl) return '';
    return `${carrierInfo.trackingUrl}${trackingNumber}`;
}

/**
 * Validate shipping address
 */
export interface ShippingAddress {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
}

export function validateShippingAddress(address: Partial<ShippingAddress>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!address.fullName || address.fullName.trim().length < 2) {
        errors.push('Full name is required');
    }

    if (!address.addressLine1 || address.addressLine1.trim().length < 5) {
        errors.push('Address line 1 is required');
    }

    if (!address.city || address.city.trim().length < 2) {
        errors.push('City is required');
    }

    if (!address.state || address.state.trim().length < 2) {
        errors.push('State is required');
    }

    if (!address.postalCode || address.postalCode.trim().length < 3) {
        errors.push('Postal code is required');
    }

    if (!address.country || address.country.trim().length < 2) {
        errors.push('Country is required');
    }

    if (!address.phone || address.phone.trim().length < 10) {
        errors.push('Valid phone number is required');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Format order date
 */
export function formatOrderDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Calculate estimated delivery date
 */
export function getEstimatedDelivery(orderDate: Date, status: string): string {
    const deliveryDays = 5; // Standard delivery time
    const estimated = new Date(orderDate);
    estimated.setDate(estimated.getDate() + deliveryDays);

    if (status === 'delivered') {
        return 'Delivered';
    }

    return `Est. ${estimated.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}
