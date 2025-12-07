import Image from 'next/image';
import Link from 'next/link';
import ScrollAnimation from '@/components/ScrollAnimation';
import './page.css';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-image-wrapper">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            poster="/hero_luxury_fashion_1764223147250.png"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            {/* Fallback image if video fails or not supported */}
            <Image
              src="/hero_luxury_fashion_1764223147250.png"
              alt="Luxury Fashion"
              fill
              priority
              className="hero-image"
              style={{ objectFit: 'cover' }}
            />
          </video>
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <ScrollAnimation animation="fade-up" delay={0.2}>
            <h1 className="hero-title">
              Timeless Elegance
              <span className="hero-subtitle">Redefined</span>
            </h1>
          </ScrollAnimation>
          <ScrollAnimation animation="fade-up" delay={0.4}>
            <p className="hero-description">
              Discover our exclusive collection of luxury fashion and styling
            </p>
          </ScrollAnimation>
          <ScrollAnimation animation="fade-up" delay={0.6}>
            <div className="hero-cta">
              <Link href="/collections" className="btn btn-primary">
                Explore Collections
              </Link>
              <Link href="/about" className="btn btn-outline-light">
                Our Story
              </Link>
            </div>
          </ScrollAnimation>
        </div>
        <div className="hero-scroll">
          <span>Scroll to Explore</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="section">
        <div className="container">
          <ScrollAnimation animation="fade-up">
            <div className="section-header text-center">
              <h2 className="section-title">Featured Collections</h2>
              <div className="divider"></div>
              <p className="section-description">
                Curated selections that embody sophistication and style
              </p>
            </div>
          </ScrollAnimation>

          <div className="collections-grid">
            <ScrollAnimation animation="fade-up" delay={0.1}>
              <Link href="/collections?category=menswear" className="collection-card">
                <div className="collection-image-wrapper">
                  <Image
                    src="/collection_menswear_1764223166571.png"
                    alt="Men's Collection"
                    width={600}
                    height={800}
                    className="collection-image"
                  />
                  <div className="collection-overlay">
                    <h3 className="collection-title">Men's Collection</h3>
                    <p className="collection-subtitle">Sophisticated Tailoring</p>
                    <span className="collection-cta">Shop Now →</span>
                  </div>
                </div>
              </Link>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={0.2}>
              <Link href="/collections?category=womenswear" className="collection-card">
                <div className="collection-image-wrapper">
                  <Image
                    src="/collection_womenswear_1764223196318.png"
                    alt="Women's Collection"
                    width={600}
                    height={800}
                    className="collection-image"
                  />
                  <div className="collection-overlay">
                    <h3 className="collection-title">Women's Collection</h3>
                    <p className="collection-subtitle">Elegant Designs</p>
                    <span className="collection-cta">Shop Now →</span>
                  </div>
                </div>
              </Link>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={0.3}>
              <Link href="/collections?category=accessories" className="collection-card">
                <div className="collection-image-wrapper">
                  <Image
                    src="/accessories_collection_1764223263858.png"
                    alt="Accessories Collection"
                    width={600}
                    height={800}
                    className="collection-image"
                  />
                  <div className="collection-overlay">
                    <h3 className="collection-title">Accessories</h3>
                    <p className="collection-subtitle">Premium Details</p>
                    <span className="collection-cta">Shop Now →</span>
                  </div>
                </div>
              </Link>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="story-grid">
            <ScrollAnimation animation="slide-in-left">
              <div className="story-content">
                <h2 className="story-title">Crafting Excellence Since Day One</h2>
                <div className="divider" style={{ margin: 'var(--space-lg) 0' }}></div>
                <p className="story-text">
                  At Hanzz & Co., we believe that luxury is not just about what you wear,
                  but how it makes you feel. Our commitment to exceptional craftsmanship
                  and timeless design has made us a destination for those who appreciate
                  the finer things in life.
                </p>
                <p className="story-text">
                  Each piece in our collection is carefully curated to ensure the highest
                  quality materials and impeccable attention to detail. From our atelier
                  to your wardrobe, we deliver an experience that transcends fashion.
                </p>
                <Link href="/about" className="btn btn-secondary mt-lg">
                  Discover Our Story
                </Link>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slide-in-right" delay={0.2}>
              <div className="story-image-wrapper">
                <Image
                  src="/about_atelier_1764223290100.png"
                  alt="Hanzz & Co. Atelier"
                  width={700}
                  height={600}
                  className="story-image"
                />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section">
        <div className="container">
          <ScrollAnimation animation="fade-up">
            <div className="section-header text-center">
              <h2 className="section-title">The Hanzz & Co. Promise</h2>
              <div className="divider"></div>
            </div>
          </ScrollAnimation>

          <div className="values-grid">
            <ScrollAnimation animation="fade-up" delay={0.1}>
              <div className="value-card">
                <div className="value-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3 className="value-title">Premium Quality</h3>
                <p className="value-description">
                  Only the finest materials and fabrics, sourced from the world's most prestigious suppliers.
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={0.2}>
              <div className="value-card">
                <div className="value-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3 className="value-title">Timeless Design</h3>
                <p className="value-description">
                  Classic silhouettes that transcend trends, ensuring your investment lasts for years.
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={0.3}>
              <div className="value-card">
                <div className="value-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h3 className="value-title">Personal Service</h3>
                <p className="value-description">
                  Dedicated styling consultations to help you find pieces that perfectly suit your aesthetic.
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <ScrollAnimation animation="fade-up">
            <div className="cta-content text-center">
              <h2 className="cta-title">Ready to Elevate Your Style?</h2>
              <p className="cta-description">
                Book a private styling consultation with our expert team
              </p>
              <Link href="/contact" className="btn btn-primary">
                Schedule Consultation
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </>
  );
}
