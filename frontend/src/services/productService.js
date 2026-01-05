// Product Service - API integration for catalog operations
import API_CONFIG from './apiConfig';

/**
 * Fetch all products with pagination, filtering, sorting, and search
 * @param {number} page - Current page number
 * @param {number} size - Page size
 * @param {string|null} brandId - Filter by brand ID
 * @param {string|null} typeId - Filter by type/category ID
 * @param {string|null} sort - Sort option (default, priceAsc, priceDesc, name)
 * @param {string|null} search - Search term
 * @returns {Promise<{data: Array, count: number}>}
 */
export const getAllProducts = async (
  page = 1,
  size = 12,
  brandId = null,
  typeId = null,
  sort = 'default',
  search = null
) => {
  try {
    const params = new URLSearchParams();
    params.append('pageIndex', page.toString());
    params.append('pageSize', size.toString());
    
    if (brandId) params.append('BrandId', brandId);
    if (typeId) params.append('TypeId', typeId);
    if (sort && sort !== 'default') params.append('sort', sort);
    if (search) params.append('search', search);

    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.catalog.getAllProducts}?${params.toString()}`;
    
    console.log('Fetching products from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Products response:', data);
    
    return {
      data: data.data || data,
      count: data.count || data.length || 0,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch all brands
 * @returns {Promise<Array>}
 */
export const getAllBrands = async () => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.catalog.getAllBrands}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Brands response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

/**
 * Fetch all types/categories
 * @returns {Promise<Array>}
 */
export const getAllTypes = async () => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.catalog.getAllTypes}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Types response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching types:', error);
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
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.catalog.getProductById(id)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Product response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Export all functions as a service object for convenience
const ProductService = {
  getAllProducts,
  getAllBrands,
  getAllTypes,
  getProductById,
};

export default ProductService;
