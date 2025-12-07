// Owner/Business Information
export const OWNER_INFO = {
    name: 'Hanzala Khan',
    phone: '+918779603467',
    phoneDisplay: '+91 8779603467',
    email: 'hanzalakhan0913@gmail.com',
    location: 'Mumbai, India',
    whatsappNumber: '918779603467', // Without + for WhatsApp API
};

// Business Details
export const BUSINESS_INFO = {
    name: 'Hanzz & Co.',
    tagline: 'Luxury Fashion & Styling',
    description: 'Elevating luxury fashion through timeless design and exceptional craftsmanship.',
};

// Currency
export const CURRENCY = {
    symbol: '₹',
    code: 'INR',
    name: 'Indian Rupee',
};

// WhatsApp Integration
export const getWhatsAppLink = (message?: string) => {
    const defaultMessage = `Hi ${OWNER_INFO.name}, I'm interested in your luxury fashion collection at ${BUSINESS_INFO.name}.`;
    const encodedMessage = encodeURIComponent(message || defaultMessage);
    return `https://wa.me/${OWNER_INFO.whatsappNumber}?text=${encodedMessage}`;
};

export const getWhatsAppProductLink = (productName: string, productPrice: number) => {
    const message = `Hi ${OWNER_INFO.name}, I'm interested in "${productName}" priced at ${CURRENCY.symbol}${productPrice}. Can you provide more details?`;
    return getWhatsAppLink(message);
};
