import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { authApi } from '../api/authApi';

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await authApi.signup(form);
      setSuccess(res.message);
      setTimeout(() => navigate('/mfd/login'), 1200);
    } catch (err) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create MFD Account"
      subtitle="Sign up to connect and access the MFD dashboard."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-900/60 mb-1">
            Full Name
          </label>
          <input
            value={form.fullName}
            onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
            className="w-full rounded-xl border border-navy-900/15 px-4 py-3"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-900/60 mb-1">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="w-full rounded-xl border border-navy-900/15 px-4 py-3"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-900/60 mb-1">
            Password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            className="w-full rounded-xl border border-navy-900/15 px-4 py-3"
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-900/60 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((p) => ({ ...p, confirmPassword: e.target.value }))
            }
            className="w-full rounded-xl border border-navy-900/15 px-4 py-3"
            placeholder="Re-enter password"
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            {success}
          </div>
        ) : null}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-gold py-3 font-bold text-navy-900 disabled:opacity-70"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="text-center text-xs text-navy-900/60">
          Already have an account?{' '}
          <Link to="/mfd/login" className="font-semibold hover:text-gold">
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;

