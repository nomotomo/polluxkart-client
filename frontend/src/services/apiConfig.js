// API Configuration for PolluxKart
// Uses environment variable for the backend URL

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  endpoints: {
    // Authentication
    auth: {
      register: '/api/auth/register',
      login: '/api/auth/login',
      me: '/api/auth/me',
    },
    // Products
    products: {
      list: '/api/products',
      categories: '/api/products/categories',
      brands: '/api/products/brands',
      getById: (id) => `/api/products/${id}`,
      reviews: (id) => `/api/products/${id}/reviews`,
    },
    // Cart
    cart: {
      get: '/api/cart',
      addItem: '/api/cart/items',
      updateItem: (productId) => `/api/cart/items/${productId}`,
      removeItem: (productId) => `/api/cart/items/${productId}`,
      clear: '/api/cart',
    },
    // Wishlist
    wishlist: {
      get: '/api/wishlist',
      products: '/api/wishlist/products',
      addItem: '/api/wishlist/items',
      removeItem: (productId) => `/api/wishlist/items/${productId}`,
      check: (productId) => `/api/wishlist/check/${productId}`,
    },
    // Orders
    orders: {
      list: '/api/orders',
      create: '/api/orders',
      getById: (id) => `/api/orders/${id}`,
      cancel: (id) => `/api/orders/${id}/cancel`,
    },
    // Payments
    payments: {
      createRazorpay: (orderId) => `/api/payments/razorpay/create/${orderId}`,
      verifyRazorpay: '/api/payments/razorpay/verify',
    },
    // Inventory
    inventory: {
      get: (productId) => `/api/inventory/${productId}`,
      available: (productId) => `/api/inventory/${productId}/available`,
    },
    // Orders
    orders: {
      list: '/orders',
      create: '/orders',
      single: (id) => `/orders/${id}`,
      byNumber: (number) => `/orders/number/${number}`,
      cancel: (id) => `/orders/${id}/cancel`,
    },
    // Payments
    payments: {
      createOrder: '/payments/create-order',
      verify: '/payments/verify',
    },
    // Health
    health: '/health',
  },
};

// Helper to get auth token
export const getAuthToken = () => {
  const user = localStorage.getItem('polluxkart-user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      return parsed.token;
    } catch {
      return null;
    }
  }
  return null;
};

// Helper to create headers with auth
export const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export default API_CONFIG;
