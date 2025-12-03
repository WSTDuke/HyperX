export const formatCurrency = (amount) => {
    if (amount === 0) return "Free";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};