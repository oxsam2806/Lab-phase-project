const CURRENCY = "USD";
const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: CURRENCY });

export const formatPrice = (amount: number) => formatter.format(amount);