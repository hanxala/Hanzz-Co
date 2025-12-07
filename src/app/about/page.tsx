import Image from 'next/image';
import type { Metadata } from 'next';
import './about.css';

export const metadata: Metadata = {
    title: 'About Us - Hanzz & Co.',
    description: 'Learn about Hanzz & Co.\'s commitment to luxury fashion, exceptional craftsmanship, and timeless design.',
};

export default function About() {
    return (
        <>
            {/* Page Hero */}
            <section className="page-hero">
                <div className="hero-image-wrapper">
                    <Image
                        src="/hero_about.png"
                        alt="About Hanzz & Co."
                        fill
                        priority
                        className="hero-image"
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="hero-overlay"></div>
                </div>
                <div className="page-hero-content">
                    <h1 className="page-hero-title">Our Story</h1>
                    <p className="page-hero-description">
                        A legacy of excellence in luxury fashion
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="section">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-image-wrapper">
                            <Image
                                src="/about_atelier_1764223290100.png"
                                alt="Hanzz & Co. Atelier"
                                width={700}
                                height={600}
                                className="about-image"
                            />
                        </div>
                        <div className="about-content">
                            <h2 className="about-title">Crafting Timeless Elegance</h2>
                            <div className="divider" style={{ margin: 'var(--space-lg) 0' }}></div>
                            <p className="about-text">
                                Founded on the principles of exceptional craftsmanship and timeless design,
                                Hanzz & Co. has become synonymous with luxury fashion that transcends trends
                                and seasons.
                            </p>
                            <p className="about-text">
                                Our journey began with a simple vision: to create clothing that not only
                                looks exceptional but makes the wearer feel extraordinary. Every piece in
                                our collection is a testament to this commitment.
                            </p>
                            <p className="about-text">
                                From our atelier to your wardrobe, we ensure that each garment meets the
                                highest standards of quality and design. Our team of expert craftspeople
                                brings decades of experience to every stitch, every seam, every detail.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section section-dark">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">Our Core Values</h2>
                        <div className="divider"></div>
                        <p className="section-description" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="values-grid">
                        <div className="value-item">
                            <div className="value-number">01</div>
                            <h3 className="value-title">Excellence</h3>
                            <p className="value-description">
                                We never compromise on quality. Every piece must meet our exacting standards
                                before it reaches you.
                            </p>
                        </div>

                        <div className="value-item">
                            <div className="value-number">02</div>
                            <h3 className="value-title">Sustainability</h3>
                            <p className="value-description">
                                We source responsibly and create pieces designed to last, reducing waste
                                and environmental impact.
                            </p>
                        </div>

                        <div className="value-item">
                            <div className="value-number">03</div>
                            <h3 className="value-title">Innovation</h3>
                            <p className="value-description">
                                While honoring traditional craftsmanship, we embrace modern techniques
                                to push boundaries.
                            </p>
                        </div>

                        <div className="value-item">
                            <div className="value-number">04</div>
                            <h3 className="value-title">Authenticity</h3>
                            <p className="value-description">
                                We stay true to our vision and values, creating fashion that reflects
                                genuine artistry and passion.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">Meet Our Team</h2>
                        <div className="divider"></div>
                        <p className="section-description">
                            The talented individuals behind Hanzz & Co.
                        </p>
                    </div>

                    <div className="team-grid">
                        <div className="team-member">
                            <div className="team-image-wrapper">
                                <div className="team-image-placeholder">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            </div>
                            <h3 className="team-name">Creative Director</h3>
                            <p className="team-role">Design & Vision</p>
                        </div>

                        <div className="team-member">
                            <div className="team-image-wrapper">
                                <div className="team-image-placeholder">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            </div>
                            <h3 className="team-name">Master Tailor</h3>
                            <p className="team-role">Craftsmanship</p>
                        </div>

                        <div className="team-member">
                            <div className="team-image-wrapper">
                                <div className="team-image-placeholder">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            </div>
                            <h3 className="team-name">Head Stylist</h3>
                            <p className="team-role">Personal Styling</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta">
                <div className="container">
                    <div className="text-center">
                        <h2 className="cta-title">Experience the Hanzz & Co. Difference</h2>
                        <p className="cta-description">
                            Visit our showroom or book a private consultation
                        </p>
                        <a href="/contact" className="btn btn-primary">
                            Get in Touch
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
