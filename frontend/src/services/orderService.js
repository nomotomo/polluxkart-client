// Order Service - API integration for orders
import API_CONFIG, { getAuthHeaders, getAuthToken } from './apiConfig';

/**
 * Create a new order
 */
export const createOrder = async (orderData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.orders.create}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        shipping_address: orderData.shippingAddress,
        billing_address: orderData.billingAddress || orderData.shippingAddress,
        payment_method: orderData.paymentMethod || 'cod',
        notes: orderData.notes || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create order');
    }

    const data = await response.json();
    return transformOrder(data);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Transform API order to frontend format
 */
const transformOrder = (order) => ({
  id: order.id,
  orderNumber: order.order_number,
  status: order.status,
  items: (order.items || []).map(item => ({
    id: item.product_id,
    productId: item.product_id,
    name: item.product_name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
  })),
  subtotal: order.subtotal || 0,
  shippingCost: order.shipping_cost || 0,
  tax: order.tax || 0,
  total: order.total || 0,
  shippingAddress: order.shipping_address,
  billingAddress: order.billing_address,
  paymentMethod: order.payment_method,
  paymentStatus: order.payment_status,
  createdAt: order.created_at,
  updatedAt: order.updated_at,
});

/**
 * Get user's orders
 */
export const getOrders = async (page = 1, pageSize = 10, status = null) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());
    if (status) params.append('status', status);
    
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.orders.list}?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      orders: (data.orders || []).map(transformOrder),
      total: data.total || 0,
      page: data.page || 1,
      pageSize: data.page_size || pageSize,
      totalPages: data.total_pages || 1,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.orders.getById(orderId)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return transformOrder(data);
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

/**
 * Cancel an order
 */
export const cancelOrder = async (orderId) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.orders.cancel(orderId)}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to cancel order');
    }

    const data = await response.json();
    return transformOrder(data);
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

// Export all functions as a service object
const OrderService = {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
};

export default OrderService;
