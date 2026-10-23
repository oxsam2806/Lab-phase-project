export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const getPasswordError = (password: string): string => {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Za-z]/.test(password)) return "Password must contain a letter";
  if (!/\d/.test(password)) return "Password must contain a number";
  return "";
};