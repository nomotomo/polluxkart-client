// Wishlist Service - API integration for wishlist
import API_CONFIG, { getAuthHeaders, getAuthToken } from './apiConfig';

/**
 * Get user's wishlist
 */
export const getWishlist = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.wishlist.get}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      items: data.product_ids || [],
    };
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

/**
 * Get wishlist with full product details
 */
export const getWishlistProducts = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.wishlist.products}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Transform products to frontend format
    return (data || []).map(product => ({
      id: product.id,
      name: product.name,
      category: product.category_name || 'General',
      price: product.price,
      originalPrice: product.original_price || null,
      rating: product.rating || 0,
      reviews: product.review_count || 0,
      image: product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      images: product.images || [],
      inStock: product.stock > 0,
      stock: product.stock,
      brand: product.brand || '',
    }));
  } catch (error) {
    console.error('Error fetching wishlist products:', error);
    throw error;
  }
};

/**
 * Add item to wishlist
 */
export const addToWishlist = async (productId) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.wishlist.addItem}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_id: productId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to add to wishlist');
    }

    const data = await response.json();
    return { items: data.product_ids || [] };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

/**
 * Remove item from wishlist
 */
export const removeFromWishlist = async (productId) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.wishlist.removeItem(productId)}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to remove from wishlist');
    }

    const data = await response.json();
    return { items: data.product_ids || [] };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

/**
 * Check if product is in wishlist
 */
export const isInWishlist = async (productId) => {
  const token = getAuthToken();
  if (!token) {
    return false;
  }

  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.wishlist.check(productId)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.in_wishlist || false;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};

// Export all functions as a service object
const WishlistService = {
  getWishlist,
  getWishlistProducts,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
};

export default WishlistService;
