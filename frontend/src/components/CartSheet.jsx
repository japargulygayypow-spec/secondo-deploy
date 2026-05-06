import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/components/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { ShoppingBag, X, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { orderApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function CartSheet({ children }) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { t, getProductName } = useLanguage();
  const { data: allProducts } = useProducts();
  const { user } = useAuth();
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    phone: '',
    addressDetail: '',
    note: ''
  });

  React.useEffect(() => {
    if (isCheckout && user) {
      orderApi.getPrefill().then(data => {
        if (data) {
          setFormData(prev => ({
            ...prev,
            fullName: data.full_name || '',
            phone: data.phone_number || '',
            address: data.address || '',
            addressDetail: data.address_detail || '',
          }));
        }
      }).catch(console.error);
    }
  }, [isCheckout, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Sanitize phone number: remove non-digits and limit to 8 digits
    const sanitizedPhone = formData.phone.replace(/\D/g, '').slice(0, 8);

    try {
      await orderApi.checkout({
        full_name: formData.fullName,
        phone_number: sanitizedPhone,
        address: formData.address,
        address_detail: formData.addressDetail || '',
        note: formData.note || ''
      });
      toast.success(t('orderSuccess'));
      await clearCart();
      setIsCheckout(false);
      setFormData({ fullName: '', email: '', address: '', phone: '', addressDetail: '', note: '' });
    } catch (error) {
      console.error("Checkout Error:", error);
      if (error.data) {
        console.error("Validation Errors:", error.data);
        // Optional: Display specific first error
        const msg = Object.values(error.data).flat().join(', ');
        toast.error(msg || 'Order failed. Please check your data.');
      } else {
        toast.error('Order failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet onOpenChange={(open) => !open && setIsCheckout(false)}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-full bg-white">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            {t('cart')}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Manage your shopping cart items and proceed to checkout.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          <AnimatePresence mode="wait">
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-stone-500 gap-4"
              >
                <ShoppingBag className="w-12 h-12 opacity-20" />
                <p>{t('emptyCart')}</p>
              </motion.div>
            ) : isCheckout ? (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium text-stone-900">{t('checkout')}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">{t('fullName')}</label>
                    <Input
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder={t('fullName')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Email</label>
                    <Input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">{t('phone')}</label>
                    <Input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="65123456 (8 digits)"
                      maxLength={8}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">{t('address')}</label>
                    <Input
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder={t('address')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Address Detail (Apt, Floor)</label>
                    <Input
                      name="addressDetail"
                      value={formData.addressDetail}
                      onChange={handleInputChange}
                      placeholder="Apartment, Suite, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Note</label>
                    <Input
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      placeholder="Instructions for delivery..."
                    />
                  </div>

                  <div className="pt-6 border-t mt-8">
                    <div className="flex justify-between text-lg font-bold text-stone-900 mb-6">
                      <span>{t('total')}</span>
                      <span>{cartTotal.toFixed(2)}tmt</span>
                    </div>
                    <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 text-lg">
                      {t('orderNow')}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full mt-2"
                      onClick={() => setIsCheckout(false)}
                    >
                      Back to Cart
                    </Button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="cart"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {cartItems.map((item) => {
                  // Fallback to finding full product details if cart item is missing name/translations
                  const fullProduct = allProducts?.products?.find(p => p.id === item.id) || item;

                  return (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 group">
                      <div className="w-20 h-24 bg-stone-100 rounded-md overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium text-stone-900">{getProductName(fullProduct) || item.name || t('loading')}</h4>
                              {item.selectedSize && (
                                <p className="text-xs text-amber-600 font-bold mt-1 uppercase tracking-wider">
                                  {t('size')}: {item.selectedSize}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.selectedSize)}
                              className="text-stone-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-stone-500 mt-1">${(Number(item.price) || 0).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center border rounded hover:bg-stone-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center border rounded hover:bg-stone-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!isCheckout && cartItems.length > 0 && (
          <div className="border-t pt-6 pb-8 space-y-4">
            <div className="flex justify-between text-lg font-bold text-stone-900">
              <span>{t('total')}</span>
              <span>{cartTotal.toFixed(2)}tmt

              </span>
            </div>
            <Button
              onClick={() => setIsCheckout(true)}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white h-12 text-lg"
            >
              {t('checkout')}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
