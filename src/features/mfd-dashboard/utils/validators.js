export const validateRequired = (value, label) => {
  if (!String(value || '').trim()) return `${label} is required.`;
  return '';
};

export const validatePositiveNumber = (value, label) => {
  const n = Number(value);
  if (!value || Number.isNaN(n) || n <= 0) {
    return `${label} must be greater than 0.`;
  }
  return '';
};

export const validateGoalForm = (form) => {
  return (
    validateRequired(form.clientName, 'Client name') ||
    validateRequired(form.goalName, 'Goal name') ||
    validatePositiveNumber(form.targetAmount, 'Target amount') ||
    validatePositiveNumber(form.years, 'Years to goal')
  );
};

export const validateOrderForm = (form) => {
  return (
    validateRequired(form.client, 'Client') ||
    validateRequired(form.folio, 'Folio') ||
    validateRequired(form.scheme, 'Scheme') ||
    validatePositiveNumber(form.amount, 'Amount')
  );
};

