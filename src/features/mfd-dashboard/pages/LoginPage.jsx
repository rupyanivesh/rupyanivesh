import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { authApi } from '../api/authApi';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', remember: true });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.login(form);
      navigate('/mfd/otp');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Login to MFD Dashboard" subtitle="Use demo credentials: admin@rupyanivesh.in / Admin@123">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-900/60 mb-1">Username / Email</label>
          <input
            value={form.username}
            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
            className="w-full rounded-xl border border-navy-900/15 px-4 py-3"
            placeholder="Enter your username or email"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-900/60 mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            className="w-full rounded-xl border border-navy-900/15 px-4 py-3"
            placeholder="Enter your password"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-navy-900/60">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(e) => setForm((p) => ({ ...p, remember: e.target.checked }))}
            />
            Remember me
          </label>
          <Link to="/mfd/forgot-password" className="hover:text-gold">Forgot Password?</Link>
        </div>
        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div> : null}
        <button disabled={loading} className="w-full rounded-xl bg-gold py-3 font-bold text-navy-900 disabled:opacity-70">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="text-center text-xs text-navy-900/60">
          New here?{' '}
          <Link to="/mfd/signup" className="font-semibold hover:text-gold">
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
