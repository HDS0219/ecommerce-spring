/*
  WEB PAGE TO TEST API
  (NEEDS BACK END WORKING TOGETHER)
*/

import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import type { Product, ProductRequestDto } from '../types/product';

type ProductCategory = 'ELETRONICS' | 'CLOTHING' | 'HOME_GOODS' | 'BOOKS';
type ProductStatus = 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED';

const emptyForm: ProductRequestDto = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: 'ELETRONICS',
  status: 'DRAFT',
  image: '',
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductRequestDto>(emptyForm);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  async function fetchProducts(p: number) {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.getAll(p);
      setProducts(result.data);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      stock: product.stock,
      category: product.category,
      status: product.status,
      image: product.image ?? '',
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleField(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await productService.update(editingId, form);
      } else {
        await productService.create(form);
      }
      closeModal();
      fetchProducts(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving product');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    try {
      await productService.delete(id);
      fetchProducts(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting product');
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Products</h1>
        <button onClick={openCreate}>+ New Product</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Product table */}
      {!loading && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Name</th>
              <th style={{ padding: '8px' }}>Price</th>
              <th style={{ padding: '8px' }}>Stock</th>
              <th style={{ padding: '8px' }}>Category</th>
              <th style={{ padding: '8px' }}>Status</th>
              <th style={{ padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{product.name}</td>
                <td style={{ padding: '8px' }}>${product.price.toFixed(2)}</td>
                <td style={{ padding: '8px' }}>{product.stock}</td>
                <td style={{ padding: '8px' }}>{product.category}</td>
                <td style={{ padding: '8px' }}>{product.status}</td>
                <td style={{ padding: '8px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => openEdit(product)}>Edit</button>
                  <button onClick={() => handleDelete(product.id)} style={{ color: 'red' }}>Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '1rem' }}>
        <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
        <span>{page + 1} / {totalPages}</span>
        <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            background: '#fff', borderRadius: '8px', padding: '2rem',
            width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            <h2 style={{ margin: 0 }}>{editingId ? 'Edit Product' : 'New Product'}</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label>
                Name *
                <input name="name" value={form.name} onChange={handleField} required style={{ display: 'block', width: '100%' }} />
              </label>

              <label>
                Description
                <textarea name="description" value={form.description} onChange={handleField} style={{ display: 'block', width: '100%' }} />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label>
                  Price *
                  <input name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={handleField} required style={{ display: 'block', width: '100%' }} />
                </label>
                <label>
                  Stock *
                  <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleField} required style={{ display: 'block', width: '100%' }} />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label>
                  Category *
                  <select name="category" value={form.category} onChange={handleField} style={{ display: 'block', width: '100%' }}>
                    {(['ELETRONICS', 'CLOTHING', 'HOME_GOODS', 'BOOKS'] as ProductCategory[]).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Status *
                  <select name="status" value={form.status} onChange={handleField} style={{ display: 'block', width: '100%' }}>
                    {(['DRAFT', 'ACTIVE', 'OUT_OF_STOCK', 'DISCONTINUED'] as ProductStatus[]).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Image URL
                <input name="image" value={form.image} onChange={handleField} style={{ display: 'block', width: '100%' }} />
              </label>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={closeModal}>Cancel</button>
                <button type="submit">{editingId ? 'Save' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}