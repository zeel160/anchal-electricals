import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaBolt, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo"><FaBolt /></div>
          <h2>ANCHAL ELECTRICALS</h2>
          <p>Admin Portal</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="admin@anchalelectricals.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input className="form-control" type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Your password" required style={{ paddingRight: 40 }} />
              <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowPass(!showPass)}>
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>
        <p className="login-footer">Anchal Electricals © 2026 | GSTIN: 24AHWPG6193R1ZA</p>
      </div>
      <style>{`
        .login-page { min-height: 100vh; background: var(--secondary); display: flex; align-items: center; justify-content: center; padding: 20px; }
        .login-card { background: white; border-radius: var(--radius); padding: 40px; width: 100%; max-width: 400px; box-shadow: var(--shadow-lg); }
        .login-header { text-align: center; margin-bottom: 32px; }
        .login-logo { width: 64px; height: 64px; background: var(--primary); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; margin: 0 auto 16px; }
        .login-header h2 { font-size: 20px; color: var(--secondary); letter-spacing: 1px; }
        .login-header p { color: var(--text-muted); font-size: 14px; }
        .login-footer { text-align: center; margin-top: 24px; font-size: 12px; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
