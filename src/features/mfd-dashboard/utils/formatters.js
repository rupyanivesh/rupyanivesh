export const formatINR = (value = 0, fractionDigits = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: fractionDigits,
  }).format(value);

export const formatNumber = (value = 0) =>
  new Intl.NumberFormat('en-IN').format(value);

export const formatPercent = (value = 0, fractionDigits = 1) =>
  `${Number(value).toFixed(fractionDigits)}%`;

