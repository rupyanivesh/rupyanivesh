import React from 'react';
import { AlertTriangle, Loader2, Inbox } from 'lucide-react';

export const LoadingState = ({ label = 'Loading...' }) => (
  <div className="rounded-2xl border border-navy-900/10 bg-white p-8 text-center">
    <Loader2 className="mx-auto h-6 w-6 animate-spin text-gold" />
    <p className="mt-3 text-sm text-navy-900/70">{label}</p>
  </div>
);

export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
    <AlertTriangle className="mx-auto h-6 w-6 text-red-500" />
    <p className="mt-3 text-sm text-red-700">{message}</p>
    {onRetry ? (
      <button
        onClick={onRetry}
        className="mt-4 rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
      >
        Retry
      </button>
    ) : null}
  </div>
);

export const EmptyState = ({ title = 'No records found', detail = 'Try changing filters or add new data.' }) => (
  <div className="rounded-2xl border border-navy-900/10 bg-[#FAF9F6] p-8 text-center">
    <Inbox className="mx-auto h-6 w-6 text-navy-900/50" />
    <p className="mt-3 text-sm font-semibold text-navy-900">{title}</p>
    <p className="mt-1 text-xs text-navy-900/60">{detail}</p>
  </div>
);

