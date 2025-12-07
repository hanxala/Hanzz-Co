'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import { useCart } from '@/context/CartContext';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const { cartCount } = useCart();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link href="/" className="logo">
            <span className="logo-text">HANZZ & CO.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/collections" className="nav-link">Collections</Link>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
            {isLoaded && user && (
              <Link href="/profile" className="nav-link">Profile</Link>
            )}
          </nav>

          {/* Actions Section */}
          <div className="actions-section">
            {/* Cart Icon */}
            <Link href="/cart" className="cart-icon-link" aria-label="Cart">
              <div className="cart-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </div>
            </Link>

            {/* Auth Section */}
            <div className="auth-section">
              {isLoaded && (
                user ? (
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonPopoverCard: "user-button-popover"
                      }
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="My Orders"
                        labelIcon={
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                          </svg>
                        }
                        href="/orders"
                      />
                      <UserButton.Link
                        label="Admin Dashboard"
                        labelIcon={
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="9" x2="15" y2="9"></line>
                            <line x1="9" y1="15" x2="15" y2="15"></line>
                          </svg>
                        }
                        href="/admin"
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                ) : (
                  <SignInButton mode="modal">
                    <button className="btn btn-sm btn-outline">Sign In</button>
                  </SignInButton>
                )
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className={`nav-mobile ${isMenuOpen ? 'active' : ''}`}>
        <Link href="/" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>
          Home
        </Link>
        <Link href="/collections" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>
          Collections
        </Link>
        <Link href="/about" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>
          About
        </Link>
        <Link href="/contact" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>
          Contact
        </Link>

        {/* Mobile Auth Links */}
        <div className="auth-section-mobile">
          {isLoaded && user ? (
            <>
              <Link href="/profile" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
              <Link href="/orders" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>
                My Orders
              </Link>
              {/* Note: In a real app we might want a proper Sign Out button here, 
                  but strictly following the request to just add links for now. 
                  The UserButton on desktop handles sign out. 
                  For mobile, users might need to go to Profile or we rely on UserButton if we could embed it.
                  For now, adding the requested links. */}
              <Link href="/admin" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>
                Admin Dashboard
              </Link>
            </>
          ) : (
            <Link href="/sign-in" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
