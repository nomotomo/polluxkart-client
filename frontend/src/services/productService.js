// Product Service - API integration for catalog operations
import { API_CONFIG, apiFetch } from './apiConfig';

/**
 * Fetch all products with pagination, filtering, sorting, and search
 * @param {Object} params - Query parameters
 * @returns {Promise<{products: Array, total: number, page: number, page_size: number, total_pages: number}>}
 */
export const getProducts = async ({
  page = 1,
  pageSize = 12,
  categoryId = null,
  brand = null,
  search = null,
  minPrice = null,
  maxPrice = null,
  sortBy = 'default',
  inStockOnly = false,
} = {}) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('page_size', pageSize.toString());
  
  if (categoryId) params.append('category_id', categoryId);
  if (brand) params.append('brand', brand);
  if (search) params.append('search', search);
  if (minPrice !== null) params.append('min_price', minPrice.toString());
  if (maxPrice !== null) params.append('max_price', maxPrice.toString());
  if (sortBy && sortBy !== 'default') params.append('sort_by', sortBy);
  if (inStockOnly) params.append('in_stock_only', 'true');

  const endpoint = `${API_CONFIG.endpoints.products.list}?${params.toString()}`;
  
  try {
    const response = await apiFetch(endpoint, {
      method: 'GET',
      includeAuth: false,
    });
    
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>}
 */
export const getProductById = async (id) => {
  try {
    return await apiFetch(API_CONFIG.endpoints.products.single(id), {
      method: 'GET',
      includeAuth: false,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Fetch all categories
 * @returns {Promise<Array>}
 */
export const getCategories = async () => {
  try {
    return await apiFetch(API_CONFIG.endpoints.products.categories, {
      method: 'GET',
      includeAuth: false,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetch all brands
 * @returns {Promise<Array>}
 */
export const getBrands = async () => {
  try {
    return await apiFetch(API_CONFIG.endpoints.products.brands, {
      method: 'GET',
      includeAuth: false,
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

/**
 * Fetch reviews for a product
 * @param {string} productId - Product ID
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @returns {Promise<Array>}
 */
export const getProductReviews = async (productId, page = 1, pageSize = 10) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('page_size', pageSize.toString());
  
  const endpoint = `${API_CONFIG.endpoints.products.reviews(productId)}?${params.toString()}`;
  
  try {
    return await apiFetch(endpoint, {
      method: 'GET',
      includeAuth: false,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

/**
 * Add a review to a product
 * @param {string} productId - Product ID
 * @param {Object} reviewData - {rating, title?, comment?}
 * @returns {Promise<Object>}
 */
export const addProductReview = async (productId, reviewData) => {
  try {
    return await apiFetch(API_CONFIG.endpoints.products.reviews(productId), {
      method: 'POST',
      body: JSON.stringify({ ...reviewData, product_id: productId }),
    });
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Legacy function names for backward compatibility
export const getAllProducts = async (
  page = 1,
  size = 12,
  brandId = null,
  typeId = null,
  sort = 'default',
  search = null
) => {
  // Map old sort values to new API format
  const sortMap = {
    'default': 'default',
    'priceAsc': 'price_asc',
    'priceDesc': 'price_desc',
    'name': 'name_asc',
  };
  
  const result = await getProducts({
    page,
    pageSize: size,
    categoryId: typeId,
    brand: brandId,
    search,
    sortBy: sortMap[sort] || sort,
  });
  
  // Transform response to legacy format
  return {
    data: result.products,
    count: result.total,
  };
};

export const getAllBrands = async () => {
  const brands = await getBrands();
  // Transform to legacy format with id/name
  return brands.map((brand, index) => ({
    id: brand,
    name: brand,
  }));
};

export const getAllTypes = async () => {
  const categories = await getCategories();
  // Transform to legacy format
  return categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    count: cat.product_count || 0,
  }));
};

const ProductService = {
  getProducts,
  getProductById,
  getCategories,
  getBrands,
  getProductReviews,
  addProductReview,
  // Legacy methods
  getAllProducts,
  getAllBrands,
  getAllTypes,
};

export default ProductService;
