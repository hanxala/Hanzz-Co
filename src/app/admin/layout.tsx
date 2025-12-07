import { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Admin Dashboard - Hanzz & Co.",
    description: "Admin dashboard for managing Hanzz & Co. products and inquiries",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'auto',
            background: '#f5f5f5',
            zIndex: 9999,
            margin: 0,
            padding: 0
        }}>
            {children}
        </div>
    );
}
