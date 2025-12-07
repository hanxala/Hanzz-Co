'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationProps {
    children: React.ReactNode;
    animation?: 'fade-up' | 'fade-in' | 'slide-in-right' | 'slide-in-left';
    delay?: number; // in seconds
    duration?: number; // in seconds
    className?: string;
    threshold?: number; // 0 to 1
}

export default function ScrollAnimation({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = 0.8,
    className = '',
    threshold = 0.2
}: ScrollAnimationProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        // Once visible, we can stop observing to keep it visible
                        if (elementRef.current) {
                            observer.unobserve(elementRef.current);
                        }
                    }
                });
            },
            {
                threshold: threshold,
                rootMargin: '0px 0px -50px 0px' // Trigger slightly before bottom
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [threshold]);

    // Base styles for initial state
    const baseStyle: React.CSSProperties = {
        opacity: 0,
        transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`,
        transitionDelay: `${delay}s`,
    };

    // Styles for different animations
    const animationStyles: Record<string, React.CSSProperties> = {
        'fade-up': {
            transform: 'translateY(30px)',
        },
        'fade-in': {
            transform: 'scale(0.95)',
        },
        'slide-in-right': {
            transform: 'translateX(50px)',
        },
        'slide-in-left': {
            transform: 'translateX(-50px)',
        },
    };

    // Active styles when visible
    const visibleStyle: React.CSSProperties = {
        opacity: 1,
        transform: 'translate(0) scale(1)',
    };

    return (
        <div
            ref={elementRef}
            className={`${className}`}
            style={{
                ...baseStyle,
                ...(isVisible ? visibleStyle : animationStyles[animation]),
            }}
        >
            {children}
        </div>
    );
}
