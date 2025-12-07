import { OWNER_INFO, CURRENCY } from './constants';

/**
 * Send WhatsApp notification to admin
 */
export async function sendAdminWhatsAppNotification(message: string): Promise<void> {
    const whatsappUrl = `https://wa.me/${OWNER_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;

    // In a real implementation, you would use a WhatsApp Business API
    // For now, we'll just log it (you can integrate Twilio, WhatsApp Business API, etc.)
    console.log('📱 WhatsApp Notification to Admin:', message);
    console.log('WhatsApp URL:', whatsappUrl);

    // Optional: Open WhatsApp in browser (for development/testing)
    if (typeof window !== 'undefined') {
        // Client-side only
        window.open(whatsappUrl, '_blank');
    }
}

/**
 * Format order notification message
 */
export function formatNewOrderNotification(order: any): string {
    const orderItems = order.items.map((item: any) =>
        `• ${item.productName} (${item.size}, ${item.color}) x${item.quantity} - ${CURRENCY.symbol}${item.price * item.quantity}`
    ).join('\n');

    return `🛍️ *NEW ORDER RECEIVED!*

📦 Order ID: #${order._id.slice(-8).toUpperCase()}
💰 Total Amount: ${CURRENCY.symbol}${order.totalAmount}

*Items:*
${orderItems}

*Shipping Address:*
${order.shippingAddress.fullName}
${order.shippingAddress.addressLine1}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}
📞 ${order.shippingAddress.phone}

💳 Payment: Cash on Delivery

⏰ Ordered: ${new Date(order.createdAt).toLocaleString('en-IN')}

Please process this order promptly!`;
}

/**
 * Format order cancellation notification
 */
export function formatOrderCancellationNotification(order: any): string {
    return `❌ *ORDER CANCELLED*

📦 Order ID: #${order._id.slice(-8).toUpperCase()}
💰 Amount: ${CURRENCY.symbol}${order.totalAmount}

*Customer:*
${order.shippingAddress.fullName}
📞 ${order.shippingAddress.phone}

⏰ Cancelled: ${new Date().toLocaleString('en-IN')}

Please review and process refund if applicable.`;
}

/**
 * Format contact inquiry notification
 */
export function formatContactInquiryNotification(inquiry: any): string {
    return `📧 *NEW CONTACT INQUIRY*

👤 Name: ${inquiry.name}
📧 Email: ${inquiry.email}
📞 Phone: ${inquiry.phone || 'Not provided'}

*Message:*
${inquiry.message}

⏰ Received: ${new Date(inquiry.createdAt).toLocaleString('en-IN')}

Please respond promptly!`;
}

/**
 * Format low stock alert
 */
export function formatLowStockAlert(product: any): string {
    return `⚠️ *LOW STOCK ALERT*

📦 Product: ${product.name}
🏷️ Category: ${product.category}
💰 Price: ${CURRENCY.symbol}${product.price}

Stock is running low. Please restock soon!

⏰ Alert: ${new Date().toLocaleString('en-IN')}`;
}

/**
 * Send notification via WhatsApp Business API (placeholder)
 * In production, integrate with Twilio, WhatsApp Business API, or similar service
 */
export async function sendWhatsAppViaAPI(phoneNumber: string, message: string): Promise<boolean> {
    try {
        // TODO: Integrate with actual WhatsApp Business API
        // Example with Twilio:
        // const response = await fetch('/api/send-whatsapp', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ to: phoneNumber, message })
        // });

        console.log(`Sending WhatsApp to ${phoneNumber}:`, message);
        return true;
    } catch (error) {
        console.error('Failed to send WhatsApp notification:', error);
        return false;
    }
}
