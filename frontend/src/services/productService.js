// Product Service - API integration for catalog operations
import API_CONFIG, { getAuthHeaders } from './apiConfig';

/**
 * Fetch all products with pagination, filtering, sorting, and search
 */
export const getAllProducts = async (
  page = 1,
  pageSize = 12,
  categoryId = null,
  brand = null,
  sortBy = 'default',
  search = null,
  minPrice = null,
  maxPrice = null,
  inStockOnly = false
) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());
    
    if (categoryId) params.append('category_id', categoryId);
    if (brand) params.append('brand', brand);
    if (search) params.append('search', search);
    if (minPrice !== null) params.append('min_price', minPrice.toString());
    if (maxPrice !== null) params.append('max_price', maxPrice.toString());
    if (inStockOnly) params.append('in_stock_only', 'true');
    
    // Map frontend sort values to backend format
    const sortMap = {
      'default': 'default',
      'price-asc': 'price_asc',
      'price-desc': 'price_desc',
      'rating': 'rating',
      'newest': 'newest',
    };
    params.append('sort_by', sortMap[sortBy] || 'default');

    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products.list}?${params.toString()}`;
    console.log('Fetching products from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Products response:', data);
    
    // Transform API response to match frontend expectations
    return {
      data: (data.products || []).map(transformProduct),
      count: data.total || 0,
      page: data.page || 1,
      pageSize: data.page_size || pageSize,
      totalPages: data.total_pages || 1,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Transform API product to frontend format
 */
const transformProduct = (product) => ({
  id: product.id,
  name: product.name,
  category: product.category_name || product.category?.name || 'General',
  categoryId: product.category_id,
  price: product.price,
  originalPrice: product.original_price || null,
  rating: product.rating || 0,
  reviews: product.review_count || 0,
  image: product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  images: product.images || [],
  description: product.description || '',
  features: product.features || [],
  inStock: product.stock > 0,
  stock: product.stock,
  brand: product.brand || '',
  badge: product.badge || null,
  sku: product.sku || '',
  _original: product,
});

/**
 * Fetch all categories
 */
export const getAllCategories = async () => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products.categories}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Categories response:', data);
    
    // Transform to expected format
    return (data || []).map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
      description: cat.description || '',
      image: cat.image || null,
      count: cat.product_count || 0,
      subcategories: cat.subcategories || [],
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Alias for backward compatibility
export const getAllTypes = getAllCategories;

/**
 * Fetch all brands
 */
export const getAllBrands = async () => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products.brands}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Brands response:', data);
    
    // Backend returns array of strings
    return (data || []).map((brand, index) => ({
      id: `brand-${index}`,
      name: brand,
    }));
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

/**
 * Fetch single product by ID
 */
export const getProductById = async (id) => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products.getById(id)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Product response:', data);
    return transformProduct(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Fetch product reviews
 */
export const getProductReviews = async (productId, page = 1, pageSize = 10) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());
    
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products.reviews(productId)}?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

/**
 * Add a product review (requires auth)
 */
export const addProductReview = async (productId, rating, comment) => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products.reviews(productId)}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rating, comment }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to add review');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Export all functions as a service object
const ProductService = {
  getAllProducts,
  getAllCategories,
  getAllTypes,
  getAllBrands,
  getProductById,
  getProductReviews,
  addProductReview,
};

export default ProductService;
