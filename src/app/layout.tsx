import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { CartProvider } from "@/context/CartContext";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hanzz & Co. - Luxury Fashion & Styling",
  description: "Elevating luxury fashion through timeless design and exceptional craftsmanship. Discover our exclusive collections of premium clothing and accessories.",
  keywords: "luxury fashion, designer clothing, high-end fashion, premium styling, Hanzz & Co",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
          <CartProvider>
            <Header />
            <main style={{ paddingTop: '80px' }}>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
