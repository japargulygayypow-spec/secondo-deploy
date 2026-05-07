import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartApi } from '@/lib/api';
import { toast } from 'sonner';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const raw = localStorage.getItem('guest_cart_items');
    return raw ? JSON.parse(raw) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize local cart or fetch if logged in
  useEffect(() => {
    fetchCart();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('guest_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  const fetchCart = async () => {
    setIsLoading(true);
    if (!user) {
      setIsLoading(false);
      return;
    }
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

    if (!user) {
      setCartItems(prev => {
        const idx = prev.findIndex(i => i.id === product.id && i.selectedSize === size);
        if (idx >= 0) { const copy=[...prev]; copy[idx].quantity += 1; return copy; }
        return [...prev, { ...product, quantity: 1, selectedSize: size, price: parseFloat(product.discounted_price || product.price || 0) }];
      });
      toast.success("Added to cart");
      return;
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
    if (!user) { setCartItems(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size))); return; }
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

    if (!user) { setCartItems(prev => prev.map(item => item.id === productId && item.selectedSize === size ? { ...item, quantity } : item)); return; }
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
    if (!user) { setCartItems([]); toast.success("Cart cleared"); return; }
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
