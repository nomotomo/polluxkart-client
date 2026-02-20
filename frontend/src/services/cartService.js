// Cart Service - API integration for shopping cart
import API_CONFIG, { getAuthHeaders, getAuthToken } from './apiConfig';

/**
 * Get user's cart
 */
export const getCart = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cart.get}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return transformCart(data);
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

/**
 * Transform API cart to frontend format
 */
const transformCart = (cart) => ({
  id: cart.id,
  items: (cart.items || []).map(item => ({
    id: item.product_id,
    productId: item.product_id,
    name: item.product_name || item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image || item.product_image,
    inStock: item.in_stock !== false,
  })),
  total: cart.total || 0,
  itemCount: cart.item_count || cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
});

/**
 * Add item to cart
 */
export const addToCart = async (productId, quantity = 1) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cart.addItem}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        product_id: productId,
        quantity,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to add to cart');
    }

    const data = await response.json();
    return transformCart(data);
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

/**
 * Update item quantity in cart
 */
export const updateCartItem = async (productId, quantity) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cart.updateItem(productId)}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update cart');
    }

    const data = await response.json();
    return transformCart(data);
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (productId) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cart.removeItem(productId)}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to remove from cart');
    }

    const data = await response.json();
    return transformCart(data);
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

/**
 * Clear entire cart
 */
export const clearCart = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cart.clear}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to clear cart');
    }

    const data = await response.json();
    return transformCart(data);
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Export all functions as a service object
const CartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

export default CartService;
