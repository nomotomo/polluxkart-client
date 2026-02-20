import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import WishlistService from '../services/wishlistService';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load wishlist from localStorage as fallback
  const loadLocalWishlist = useCallback(() => {
    const savedWishlist = localStorage.getItem('polluxkart-wishlist');
    if (savedWishlist) {
      try {
        const items = JSON.parse(savedWishlist);
        setWishlistItems(items);
        setWishlistIds(new Set(items.map(item => item.id)));
      } catch (e) {
        console.error('Error parsing local wishlist:', e);
        setWishlistItems([]);
        setWishlistIds(new Set());
      }
    }
  }, []);

  // Save wishlist to localStorage
  const saveLocalWishlist = useCallback((items) => {
    localStorage.setItem('polluxkart-wishlist', JSON.stringify(items));
  }, []);

  // Sync wishlist with backend when authenticated
  const syncWishlistWithBackend = useCallback(async () => {
    if (!isAuthenticated) {
      loadLocalWishlist();
      return;
    }

    setIsSyncing(true);
    try {
      const products = await WishlistService.getWishlistProducts();
      setWishlistItems(products || []);
      setWishlistIds(new Set((products || []).map(p => p.id)));
      saveLocalWishlist(products || []);
    } catch (error) {
      console.error('Error syncing wishlist:', error);
      // Fallback to local wishlist
      loadLocalWishlist();
    } finally {
      setIsSyncing(false);
    }
  }, [isAuthenticated, loadLocalWishlist, saveLocalWishlist]);

  // Initial load and sync on auth change
  useEffect(() => {
    syncWishlistWithBackend();
  }, [isAuthenticated, token, syncWishlistWithBackend]);

  const addToWishlist = useCallback(async (product) => {
    // Check if already in wishlist
    if (wishlistIds.has(product.id)) {
      return;
    }

    // Optimistic update
    setWishlistItems(prev => {
      const newItems = [...prev, product];
      saveLocalWishlist(newItems);
      return newItems;
    });
    setWishlistIds(prev => new Set([...prev, product.id]));

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await WishlistService.addToWishlist(product.id);
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        // Revert optimistic update on error
        setWishlistItems(prev => {
          const newItems = prev.filter(item => item.id !== product.id);
          saveLocalWishlist(newItems);
          return newItems;
        });
        setWishlistIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(product.id);
          return newSet;
        });
      }
    }
  }, [isAuthenticated, wishlistIds, saveLocalWishlist]);

  const removeFromWishlist = useCallback(async (productId) => {
    // Optimistic update
    setWishlistItems(prev => {
      const newItems = prev.filter(item => item.id !== productId);
      saveLocalWishlist(newItems);
      return newItems;
    });
    setWishlistIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await WishlistService.removeFromWishlist(productId);
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        // Could revert here, but removal is usually not critical
      }
    }
  }, [isAuthenticated, saveLocalWishlist]);

  const isInWishlist = useCallback((productId) => {
    return wishlistIds.has(productId);
  }, [wishlistIds]);

  const toggleWishlist = useCallback(async (product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
      return false;
    } else {
      await addToWishlist(product);
      return true;
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
    setWishlistIds(new Set());
    saveLocalWishlist([]);
  }, [saveLocalWishlist]);

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isLoading,
        isSyncing,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        wishlistCount,
        syncWishlist: syncWishlistWithBackend,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
