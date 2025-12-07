'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import Modal from '@/components/admin/Modal';
import Toast from '@/components/admin/Toast';
import { CURRENCY } from '@/lib/constants';
import './admin.css';

interface Inquiry {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    service: string;
    message: string;
    status: string;
    createdAt: string;
}

interface Product {
    _id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    images: string[];
    sizes?: string[];
    colors?: string[];
    inStock: boolean;
    featured: boolean;
}

interface Stats {
    products: {
        total: number;
        inStock: number;
        featured: number;
        outOfStock: number;
    };
    inquiries: {
        total: number;
        new: number;
        contacted: number;
        resolved: number;
    };
}

export default function AdminDashboard() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [activeView, setActiveView] = useState<'dashboard' | 'products' | 'inquiries' | 'create'>('dashboard');
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [editProductModal, setEditProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'product' | 'inquiry', id: string } | null>(null);

    // Toast state
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    });

    // Search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/sign-in');
        }
    }, [isLoaded, user, router]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch all data in parallel
            const [inquiriesRes, productsRes, statsRes] = await Promise.all([
                fetch('/api/inquiries'),
                fetch('/api/products'),
                fetch('/api/admin/stats')
            ]);

            if (inquiriesRes.ok) {
                const data = await inquiriesRes.json();
                setInquiries(data.data || []);
            }

            if (productsRes.ok) {
                const data = await productsRes.json();
                setProducts(data.data || []);
            }

            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showToast('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type, isVisible: true });
    };

    const handleDeleteProduct = async (id: string) => {
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                showToast('Product deleted successfully', 'success');
                fetchData();
                setDeleteConfirmModal(false);
                setItemToDelete(null);
            } else {
                showToast(data.error || 'Failed to delete product', 'error');
            }
        } catch (error) {
            showToast('Failed to delete product', 'error');
        }
    };

    const handleDeleteInquiry = async (id: string) => {
        try {
            const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                showToast('Inquiry deleted successfully', 'success');
                fetchData();
                setDeleteConfirmModal(false);
                setItemToDelete(null);
            } else {
                showToast(data.error || 'Failed to delete inquiry', 'error');
            }
        } catch (error) {
            showToast('Failed to delete inquiry', 'error');
        }
    };

    const handleUpdateInquiryStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/inquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            const data = await res.json();

            if (data.success) {
                showToast('Status updated successfully', 'success');
                fetchData();
            } else {
                showToast(data.error || 'Failed to update status', 'error');
            }
        } catch (error) {
            showToast('Failed to update status', 'error');
        }
    };

    const handleToggleFeatured = async (id: string, currentValue: boolean) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured: !currentValue })
            });

            const data = await res.json();

            if (data.success) {
                showToast('Product updated successfully', 'success');
                fetchData();
            } else {
                showToast(data.error || 'Failed to update product', 'error');
            }
        } catch (error) {
            showToast('Failed to update product', 'error');
        }
    };

    const handleToggleStock = async (id: string, currentValue: boolean) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inStock: !currentValue })
            });

            const data = await res.json();

            if (data.success) {
                showToast('Stock status updated', 'success');
                fetchData();
            } else {
                showToast(data.error || 'Failed to update stock', 'error');
            }
        } catch (error) {
            showToast('Failed to update stock', 'error');
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const filteredInquiries = inquiries.filter(inquiry => {
        const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (!isLoaded || !user) {
        return (
            <div className="admin-loading">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h1>HANZZ & CO.</h1>
                    <p>Admin Panel</p>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveView('dashboard')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        Dashboard
                    </button>
                    <button
                        className={`nav-item ${activeView === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveView('products')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        Products ({products.length})
                    </button>
                    <button
                        className={`nav-item ${activeView === 'inquiries' ? 'active' : ''}`}
                        onClick={() => setActiveView('inquiries')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Inquiries ({inquiries.length})
                    </button>
                    <button
                        className={`nav-item ${activeView === 'create' ? 'active' : ''}`}
                        onClick={() => setActiveView('create')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Create Product
                    </button>
                </nav>

                {/* Back to Website */}
                <div className="sidebar-footer">
                    <a href="/" className="back-to-website">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Website
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Dashboard View */}
                {activeView === 'dashboard' && stats && (
                    <div className="dashboard-view">
                        <h2>Dashboard Overview</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon products">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.products.total}</h3>
                                    <p>Total Products</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon stock">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.products.inStock}</h3>
                                    <p>In Stock</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon featured">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.products.featured}</h3>
                                    <p>Featured</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon inquiries">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.inquiries.total}</h3>
                                    <p>Total Inquiries</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon new">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.inquiries.new}</h3>
                                    <p>New Inquiries</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon resolved">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.inquiries.resolved}</h3>
                                    <p>Resolved</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products View */}
                {activeView === 'products' && (
                    <div className="products-view">
                        <div className="view-header">
                            <h2>Products Management</h2>
                            <div className="view-actions">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="menswear">Menswear</option>
                                    <option value="womenswear">Womenswear</option>
                                    <option value="accessories">Accessories</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading-state">Loading products...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="empty-state">No products found</div>
                        ) : (
                            <div className="data-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Featured</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product) => (
                                            <tr key={product._id}>
                                                <td>{product.name}</td>
                                                <td><span className="category-badge">{product.category}</span></td>
                                                <td>{CURRENCY.symbol}{product.price}</td>
                                                <td>
                                                    <button
                                                        className={`toggle-btn ${product.inStock ? 'active' : ''}`}
                                                        onClick={() => handleToggleStock(product._id, product.inStock)}
                                                    >
                                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        className={`toggle-btn ${product.featured ? 'active' : ''}`}
                                                        onClick={() => handleToggleFeatured(product._id, product.featured)}
                                                    >
                                                        {product.featured ? '⭐ Featured' : 'Not Featured'}
                                                    </button>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() => {
                                                                setItemToDelete({ type: 'product', id: product._id });
                                                                setDeleteConfirmModal(true);
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Inquiries View */}
                {activeView === 'inquiries' && (
                    <div className="inquiries-view">
                        <div className="view-header">
                            <h2>Inquiries Management</h2>
                            <div className="view-actions">
                                <input
                                    type="text"
                                    placeholder="Search inquiries..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="all">All Status</option>
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading-state">Loading inquiries...</div>
                        ) : filteredInquiries.length === 0 ? (
                            <div className="empty-state">No inquiries found</div>
                        ) : (
                            <div className="inquiries-list">
                                {filteredInquiries.map((inquiry) => (
                                    <div key={inquiry._id} className="inquiry-item">
                                        <div className="inquiry-header">
                                            <div>
                                                <h3>{inquiry.name}</h3>
                                                <p className="inquiry-email">{inquiry.email}</p>
                                            </div>
                                            <select
                                                value={inquiry.status}
                                                onChange={(e) => handleUpdateInquiryStatus(inquiry._id, e.target.value)}
                                                className={`status-select ${inquiry.status}`}
                                            >
                                                <option value="new">New</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="resolved">Resolved</option>
                                            </select>
                                        </div>
                                        <div className="inquiry-body">
                                            <p><strong>Service:</strong> {inquiry.service}</p>
                                            {inquiry.phone && <p><strong>Phone:</strong> {inquiry.phone}</p>}
                                            <p><strong>Message:</strong> {inquiry.message}</p>
                                            <p className="inquiry-date">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="inquiry-actions">
                                            <button
                                                className="btn-delete"
                                                onClick={() => {
                                                    setItemToDelete({ type: 'inquiry', id: inquiry._id });
                                                    setDeleteConfirmModal(true);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Create Product View */}
                {activeView === 'create' && (
                    <div className="create-view">
                        <h2>Create New Product</h2>
                        <ProductForm onSuccess={() => {
                            fetchData();
                            showToast('Product created successfully!', 'success');
                        }} />
                    </div>
                )}
            </main>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteConfirmModal}
                onClose={() => {
                    setDeleteConfirmModal(false);
                    setItemToDelete(null);
                }}
                title="Confirm Delete"
            >
                <p>Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.</p>
                <div className="modal-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            setDeleteConfirmModal(false);
                            setItemToDelete(null);
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => {
                            if (itemToDelete) {
                                if (itemToDelete.type === 'product') {
                                    handleDeleteProduct(itemToDelete.id);
                                } else {
                                    handleDeleteInquiry(itemToDelete.id);
                                }
                            }
                        }}
                    >
                        Delete
                    </button>
                </div>
            </Modal>

            {/* Toast Notification */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast({ ...toast, isVisible: false })}
            />
        </div>
    );
}
