import { useState } from 'react';
import { CURRENCY } from '@/lib/constants';

interface ProductFormProps {
    onSuccess: () => void;
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'menswear',
        price: '',
        sizes: '',
        colors: '',
        inStock: true,
        featured: false,
        images: '/collection_menswear_1764223166571.png' // Default image
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
                colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
                images: [formData.images]
            };

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            const data = await res.json();

            if (data.success) {
                alert('Product created successfully!');
                // Reset form
                setFormData({
                    name: '',
                    description: '',
                    category: 'menswear',
                    price: '',
                    sizes: '',
                    colors: '',
                    inStock: true,
                    featured: false,
                    images: '/collection_menswear_1764223166571.png'
                });
                onSuccess();
            } else {
                setError(data.error || 'Failed to create product');
            }
        } catch (err) {
            console.error('Error creating product:', err);
            setError('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <h3>Add New Product</h3>

            {error && <div className="error-message">{error}</div>}

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="name">Product Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="menswear">Menswear</option>
                        <option value="womenswear">Womenswear</option>
                        <option value="accessories">Accessories</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="price">Price ({CURRENCY.symbol}) *</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="images">Image Path</label>
                    <input
                        type="text"
                        id="images"
                        name="images"
                        value={formData.images}
                        onChange={handleChange}
                        placeholder="/collection_menswear_1764223166571.png"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="sizes">Sizes (comma-separated)</label>
                    <input
                        type="text"
                        id="sizes"
                        name="sizes"
                        value={formData.sizes}
                        onChange={handleChange}
                        placeholder="S, M, L, XL"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="colors">Colors (comma-separated)</label>
                    <input
                        type="text"
                        id="colors"
                        name="colors"
                        value={formData.colors}
                        onChange={handleChange}
                        placeholder="Black, Navy, Gray"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="inStock"
                            checked={formData.inStock}
                            onChange={handleChange}
                        />
                        In Stock
                    </label>
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                        />
                        Featured Product
                    </label>
                </div>
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
            >
                {loading ? 'Creating...' : 'Create Product'}
            </button>
        </form>
    );
}
