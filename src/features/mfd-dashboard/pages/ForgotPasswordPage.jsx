import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { authApi } from '../api/authApi';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await authApi.requestPasswordReset({ email });
      setSuccess(res.message);
    } catch (err) {
      setError(err.message || 'Unable to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Your Password" subtitle="We will send a secure reset link to your registered email.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-900/60 mb-1">Registered Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-navy-900/15 px-4 py-3"
            placeholder="Enter your registered email"
          />
        </div>
        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div> : null}
        {success ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{success}</div> : null}
        <button disabled={loading} className="w-full rounded-xl bg-gold py-3 font-bold text-navy-900 disabled:opacity-70">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        <div className="text-center">
          <Link to="/mfd/login" className="text-xs text-navy-900/60 hover:text-gold">Back to Login</Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;

