import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import CartService from '../services/cartService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load cart from localStorage as fallback
  const loadLocalCart = useCallback(() => {
    const savedCart = localStorage.getItem('polluxkart-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing local cart:', e);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage
  const saveLocalCart = useCallback((items) => {
    localStorage.setItem('polluxkart-cart', JSON.stringify(items));
  }, []);

  // Sync cart with backend when authenticated
  const syncCartWithBackend = useCallback(async () => {
    if (!isAuthenticated) {
      loadLocalCart();
      return;
    }

    setIsSyncing(true);
    try {
      const response = await CartService.getCart();
      setCartItems(response.items || []);
      saveLocalCart(response.items || []);
    } catch (error) {
      console.error('Error syncing cart:', error);
      // Fallback to local cart
      loadLocalCart();
    } finally {
      setIsSyncing(false);
    }
  }, [isAuthenticated, loadLocalCart, saveLocalCart]);

  // Initial load and sync on auth change
  useEffect(() => {
    syncCartWithBackend();
  }, [isAuthenticated, token, syncCartWithBackend]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    // Optimistic update
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      let newItems;
      if (existingItem) {
        newItems = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prev, { ...product, quantity }];
      }
      saveLocalCart(newItems);
      return newItems;
    });

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        const response = await CartService.addToCart(product.id, quantity);
        setCartItems(response.items || []);
        saveLocalCart(response.items || []);
      } catch (error) {
        console.error('Error adding to cart:', error);
        // Keep local state, it will sync later
      }
    }
  }, [isAuthenticated, saveLocalCart]);

  const removeFromCart = useCallback(async (productId) => {
    // Optimistic update
    setCartItems(prev => {
      const newItems = prev.filter(item => item.id !== productId);
      saveLocalCart(newItems);
      return newItems;
    });

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        const response = await CartService.removeFromCart(productId);
        setCartItems(response.items || []);
        saveLocalCart(response.items || []);
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    }
  }, [isAuthenticated, saveLocalCart]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    // Optimistic update
    setCartItems(prev => {
      const newItems = prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      saveLocalCart(newItems);
      return newItems;
    });

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        const response = await CartService.updateCartItem(productId, quantity);
        setCartItems(response.items || []);
        saveLocalCart(response.items || []);
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }
  }, [isAuthenticated, removeFromCart, saveLocalCart]);

  const clearCart = useCallback(async () => {
    setCartItems([]);
    saveLocalCart([]);

    if (isAuthenticated) {
      try {
        await CartService.clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  }, [isAuthenticated, saveLocalCart]);

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0),
    0
  );

  const cartCount = cartItems.reduce(
    (count, item) => count + (item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        isSyncing,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        syncCart: syncCartWithBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
