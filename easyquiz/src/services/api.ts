export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const getLoggedUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('easyquiz_user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};