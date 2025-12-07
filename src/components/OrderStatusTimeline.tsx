import React from 'react';
import { ORDER_STATUSES } from '@/lib/orderUtils';
import './OrderStatusTimeline.css';

interface OrderStatusTimelineProps {
    currentStatus: string;
}

export default function OrderStatusTimeline({ currentStatus }: OrderStatusTimelineProps) {
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const isCancelled = currentStatus === 'cancelled';

    if (isCancelled) {
        return (
            <div className="status-timeline cancelled">
                <div className="timeline-item active">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                        <h4>Order Cancelled</h4>
                        <p>This order has been cancelled</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="status-timeline">
            {statusOrder.map((status, index) => {
                const statusInfo = ORDER_STATUSES.find(s => s.value === status);
                const isActive = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (
                    <div
                        key={status}
                        className={`timeline-item ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                    >
                        <div className="timeline-dot" style={{ backgroundColor: isActive ? statusInfo?.color : '#e5e7eb' }}>
                            {isActive && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            )}
                        </div>
                        <div className="timeline-content">
                            <h4>{statusInfo?.label}</h4>
                            <p>{statusInfo?.description}</p>
                        </div>
                        {index < statusOrder.length - 1 && (
                            <div className={`timeline-line ${isActive ? 'active' : ''}`}></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
