'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import './profile.css';

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/sign-in');
        }
    }, [isLoaded, user, router]);

    if (!isLoaded) {
        return (
            <div className="profile-loading">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user.imageUrl ? (
                        <Image
                            src={user.imageUrl}
                            alt={user.firstName || 'User'}
                            width={120}
                            height={120}
                            className="avatar-image"
                        />
                    ) : (
                        <div className="avatar-placeholder">
                            {user.firstName?.[0] || user.emailAddresses[0].emailAddress[0]}
                        </div>
                    )}
                </div>
                <div className="profile-info">
                    <h1>{user.firstName} {user.lastName}</h1>
                    <p className="profile-email">{user.emailAddresses[0].emailAddress}</p>
                </div>
            </div>

            <div className="profile-sections">
                <section className="profile-section">
                    <h2>Account Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>First Name</label>
                            <p>{user.firstName || 'Not provided'}</p>
                        </div>
                        <div className="info-item">
                            <label>Last Name</label>
                            <p>{user.lastName || 'Not provided'}</p>
                        </div>
                        <div className="info-item">
                            <label>Email</label>
                            <p>{user.emailAddresses[0].emailAddress}</p>
                        </div>
                        <div className="info-item">
                            <label>Member Since</label>
                            <p>{new Date(user.createdAt!).toLocaleDateString()}</p>
                        </div>
                    </div>
                </section>

                <section className="profile-section">
                    <h2>Order History</h2>
                    <div className="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="9" x2="15" y2="9"></line>
                            <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                        <p>No orders yet</p>
                        <a href="/collections" className="btn btn-primary">Start Shopping</a>
                    </div>
                </section>

                <section className="profile-section">
                    <h2>Preferences</h2>
                    <div className="preferences-grid">
                        <div className="preference-item">
                            <label>Newsletter</label>
                            <p>Subscribed to updates and exclusive offers</p>
                        </div>
                        <div className="preference-item">
                            <label>Style Preferences</label>
                            <p>Not set - <a href="/contact">Book a consultation</a></p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
