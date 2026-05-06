import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartApi } from '@/lib/api';
import { toast } from 'sonner';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize local cart or fetch if logged in
  useEffect(() => {
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const data = await cartApi.getCart();
      if (data && Array.isArray(data.items)) {
        const transformedItems = data.items
          .filter(item => item && item.product) // Filter out invalid items
          .map(item => ({
            ...item.product,
            price: parseFloat(item.product.discounted_price || item.product.price || 0),
            quantity: item.quantity,
            selectedSize: item.variant?.size?.name || item.variant?.size || null,
            variantId: item.variant?.id,
            cartItemId: item.id,
          }));
        setCartItems(transformedItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product, size = null) => {
    let variantId = null;
    if (size && product.variants) {
      const variant = product.variants.find(v =>
        (v.size?.name === size) || (v.size === size)
      );
      if (variant) variantId = variant.id;
    }

    try {
      await cartApi.addToCart(product.id, variantId, 1);
      toast.success("Added to cart");
      await fetchCart();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add item to cart");
    }
  };

  const removeFromCart = async (productId, size = null) => {
    const itemToRemove = cartItems.find(item => item.id === productId && item.selectedSize === size);
    if (itemToRemove?.cartItemId) {
      try {
        await cartApi.removeItem(itemToRemove.cartItemId);
        fetchCart();
        toast.success("Item removed");
      } catch (e) {
        toast.error("Failed to remove item");
      }
    }
  };

  const updateQuantity = async (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    const itemToUpdate = cartItems.find(item => item.id === productId && item.selectedSize === size);
    if (itemToUpdate?.cartItemId) {
      try {
        await cartApi.updateItem(itemToUpdate.cartItemId, quantity);
        fetchCart();
      } catch (e) {
        toast.error("Failed to update quantity");
      }
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (e) {
      toast.error("Failed to clear cart");
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
