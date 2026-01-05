// Basket Service - API integration for cart/basket operations
import API_CONFIG from './apiConfig';

/**
 * Get basket for a user
 * @param {string} userName - User identifier
 * @returns {Promise<Object>}
 */
export const getBasket = async (userName) => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.basket.getBasket(userName)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Return empty basket if not found
        return { userName, items: [], totalPrice: 0 };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Basket response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching basket:', error);
    throw error;
  }
};

/**
 * Update/Create basket
 * @param {Object} basket - Basket object with userName, items, totalPrice
 * @returns {Promise<Object>}
 */
export const updateBasket = async (basket) => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.basket.updateBasket}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(basket),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Updated basket:', data);
    return data;
  } catch (error) {
    console.error('Error updating basket:', error);
    throw error;
  }
};

/**
 * Add item to basket
 * @param {string} userName - User identifier
 * @param {Object} product - Product to add
 * @returns {Promise<Object>}
 */
export const addToBasket = async (userName, product) => {
  try {
    // Get current basket
    const currentBasket = await getBasket(userName);
    
    const newItem = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      imageFile: product.imageFile || product.image,
    };

    let items = currentBasket.items ? [...currentBasket.items] : [];
    const existingItem = items.find((i) => i.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push(newItem);
    }

    const basket = {
      userName,
      items,
      totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    };

    return await updateBasket(basket);
  } catch (error) {
    console.error('Error adding to basket:', error);
    throw error;
  }
};

/**
 * Remove item from basket
 * @param {string} userName - User identifier
 * @param {string} productId - Product ID to remove
 * @returns {Promise<Object>}
 */
export const removeFromBasket = async (userName, productId) => {
  try {
    const currentBasket = await getBasket(userName);
    
    const items = currentBasket.items.filter((i) => i.productId !== productId);
    
    const basket = {
      userName,
      items,
      totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    };

    return await updateBasket(basket);
  } catch (error) {
    console.error('Error removing from basket:', error);
    throw error;
  }
};

/**
 * Update item quantity in basket
 * @param {string} userName - User identifier
 * @param {string} productId - Product ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>}
 */
export const updateBasketItemQuantity = async (userName, productId, quantity) => {
  try {
    const currentBasket = await getBasket(userName);
    
    let items = currentBasket.items.map((item) => {
      if (item.productId === productId) {
        return { ...item, quantity };
      }
      return item;
    });

    // Remove item if quantity is 0
    if (quantity <= 0) {
      items = items.filter((i) => i.productId !== productId);
    }

    const basket = {
      userName,
      items,
      totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    };

    return await updateBasket(basket);
  } catch (error) {
    console.error('Error updating basket item:', error);
    throw error;
  }
};

const BasketService = {
  getBasket,
  updateBasket,
  addToBasket,
  removeFromBasket,
  updateBasketItemQuantity,
};

export default BasketService;
