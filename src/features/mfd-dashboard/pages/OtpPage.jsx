import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { authApi } from '../api/authApi';
import { authStorage } from '../utils/authStorage';

const OtpPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ otp });
      authStorage.setSession(res.token, res.user);
      navigate('/mfd-dashboard');
    } catch (err) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Verify Your Identity" subtitle="Enter OTP sent to your registered mobile. Demo OTP: 123456">
      <form onSubmit={onVerify} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-900/60 mb-1">OTP</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full rounded-xl border border-navy-900/15 px-4 py-3 tracking-[0.35em] font-bold"
            placeholder="______"
          />
        </div>
        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div> : null}
        <button disabled={loading} className="w-full rounded-xl bg-gold py-3 font-bold text-navy-900 disabled:opacity-70">
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <div className="flex justify-between text-xs text-navy-900/60">
          <button type="button" className="hover:text-gold">Resend OTP</button>
          <Link to="/mfd/login" className="hover:text-gold">Back to Login</Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default OtpPage;

