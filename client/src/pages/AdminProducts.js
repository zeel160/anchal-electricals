import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from 'react-icons/fa';

const CATS = ['MCB & Circuit Breakers','Cables & Wires','Switches & Sockets','LED Lighting','Control Panels','Fans','Conduits & Accessories','Meters & Instruments','Other'];
const UNITS = ['Pcs', 'Mtr', 'Roll', 'Set', 'Box', 'Kg'];
const EMPTY = { name:'', category:'MCB & Circuit Breakers', brand:'', model:'', description:'', hsnCode:'', price:'', gstRate:18, unit:'Pcs', stock:'', minStock:5, isActive:true };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { fetchProducts(); }, [search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (search) params.search = search;
      const res = await axios.get('/api/products', { params });
      setProducts(res.data.products || []);
    } catch { toast.error('Failed to load products'); }
    setLoading(false);
  };

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowModal(true); };
  const openEdit = (p) => { setForm({ ...p, price: p.price || '', stock: p.stock || '' }); setEditing(p._id); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name || !form.price) return toast.error('Name and price are required');
    try {
      if (editing) { await axios.put(`/api/products/${editing}`, form); toast.success('Product updated'); }
      else { await axios.post('/api/products', form); toast.success('Product added'); }
      setShowModal(false); fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this product?')) return;
    await axios.delete(`/api/products/${id}`);
    toast.success('Product removed');
    fetchProducts();
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <div className="page-header">
        <div><h1>Products</h1><p>Manage your product catalogue</p></div>
        <button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Product</button>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search-bar" style={{ flex: 1, maxWidth: 360 }}>
            <FaSearch className="search-icon" />
            <input className="form-control" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{products.length} products</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Category</th><th>Brand</th><th>Price</th><th>GST</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading...</td></tr>
              ) : products.map((p, i) => (
                <tr key={p._id}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td><strong>{p.name}</strong>{p.model && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.model}</div>}</td>
                  <td><span className="badge badge-info">{p.category}</span></td>
                  <td>{p.brand || '—'}</td>
                  <td style={{ fontWeight: 600 }}>₹{Number(p.price).toLocaleString('en-IN')} <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/{p.unit}</span></td>
                  <td>{p.gstRate}%</td>
                  <td>
                    <span className={`badge ${p.stock === 0 ? 'badge-danger' : p.stock <= p.minStock ? 'badge-warning' : 'badge-success'}`}>
                      {p.stock} {p.unit}
                    </span>
                  </td>
                  <td><span className={`badge ${p.isActive ? 'badge-success' : 'badge-secondary'}`}>{p.isActive ? 'Active' : 'Hidden'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)} title="Edit"><FaEdit /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)} title="Delete"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="btn btn-sm" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="form-row-2">
                <div className="form-group"><label>Product Name *</label><input className="form-control" value={form.name} onChange={f('name')} placeholder="e.g. L&T MCB TPN 63A" /></div>
                <div className="form-group"><label>Brand</label><input className="form-control" value={form.brand} onChange={f('brand')} placeholder="e.g. L&T, Havells" /></div>
              </div>
              <div className="form-row-2">
                <div className="form-group"><label>Category *</label>
                  <select className="form-control" value={form.category} onChange={f('category')}>{CATS.map(c => <option key={c}>{c}</option>)}</select>
                </div>
                <div className="form-group"><label>Model</label><input className="form-control" value={form.model} onChange={f('model')} placeholder="Model number" /></div>
              </div>
              <div className="form-row-3">
                <div className="form-group"><label>Price (₹) *</label><input className="form-control" type="number" value={form.price} onChange={f('price')} placeholder="0.00" /></div>
                <div className="form-group"><label>GST Rate (%)</label>
                  <select className="form-control" value={form.gstRate} onChange={f('gstRate')}>
                    {[5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Unit</label>
                  <select className="form-control" value={form.unit} onChange={f('unit')}>{UNITS.map(u => <option key={u}>{u}</option>)}</select>
                </div>
              </div>
              <div className="form-row-3">
                <div className="form-group"><label>HSN Code</label><input className="form-control" value={form.hsnCode} onChange={f('hsnCode')} placeholder="e.g. 8536" /></div>
                <div className="form-group"><label>Stock</label><input className="form-control" type="number" value={form.stock} onChange={f('stock')} placeholder="0" /></div>
                <div className="form-group"><label>Min Stock</label><input className="form-control" type="number" value={form.minStock} onChange={f('minStock')} /></div>
              </div>
              <div className="form-group"><label>Description</label><textarea className="form-control" rows={3} value={form.description} onChange={f('description')} placeholder="Optional product description" /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editing ? 'Update Product' : 'Add Product'}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .toolbar { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
      `}</style>
    </div>
  );
}
