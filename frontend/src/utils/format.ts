export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
};

export const formatDate = (value: string | number | Date): string => {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString('pt-BR');
};
