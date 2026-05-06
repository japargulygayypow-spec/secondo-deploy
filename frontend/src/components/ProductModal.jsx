import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/LanguageContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ProductModal({ product, children, open: controlledOpen, onOpenChange: controlledOnOpenChange }) {
  const { t, getProductName, getProductDescription, getProductType } = useLanguage();
  const { addToCart } = useCart();
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange = (newOpen) => {
    if (controlledOnOpenChange) {
      controlledOnOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  const [imageError, setImageError] = useState(false);

  // Reset error when active image changes
  useEffect(() => {
    setImageError(false);
  }, [activeImage]);

  const hasDiscount = Number(product.discount) > 0;
  const originalPrice = Number(product.price);
  const calculatedDiscountPrice = originalPrice - (originalPrice * (Number(product.discount) / 100));
  const finalPrice = hasDiscount
    ? (Number(product.discounted_price) || calculatedDiscountPrice)
    : originalPrice;

  const rawImages = product.images || [product.image];
  const images = rawImages.filter(Boolean);
  const hasImages = images.length > 0;

  // Extract sizes from variants
  const variants = product.variants || [];
  const variantSizes = variants.map(v => v.size?.name || v.size).filter(Boolean);
  // Use Set to remove duplicates
  const sizes = variantSizes.length > 0 ? [...new Set(variantSizes)] : [];

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      toast.error(t('selectSizeError') || 'Please select a size');
      return;
    }
    addToCart(product, selectedSize);
    toast.success(`${getProductName(product)} ${selectedSize ? `(${selectedSize}) ` : ''}${t('addToCart').toLowerCase()}`);
  };

  const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) setSelectedSize(null);
    }}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-white border-none shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{getProductName(product)}</DialogTitle>
          <DialogDescription>
            {getProductDescription(product)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 h-full max-h-[90vh] overflow-y-auto md:overflow-hidden">
          {/* Image Gallery */}
          <div className="relative bg-stone-100 aspect-square md:aspect-auto md:h-full group">
            <AnimatePresence mode="wait">
              {hasImages && !imageError ? (
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={getProductName(product)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-100">
                  <ImageIcon className="w-20 h-20 text-stone-300" />
                </div>
              )}
            </AnimatePresence>

            {images.length > 1 && !imageError && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-900 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-900 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${activeImage === idx ? 'bg-amber-500 w-6' : 'bg-white/50 hover:bg-white'
                        }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Discount Badge */}
            {hasDiscount && (
              <div className="absolute top-4 right-4 z-10 bg-red-50 text-red-600 text-sm font-medium px-3 py-1 rounded-full border border-red-100 shadow-sm">
                -{Number(product.discount).toFixed(0)}%
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="mb-8">
              <p className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-2">
                {getProductType(product)}
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-4">
                {getProductName(product)}
              </h2>

              <div className="flex items-center gap-3 mb-6">
                {hasDiscount && (
                  <span className="text-xl text-stone-400 line-through">
                    {Number(product.price).toFixed(2)}tmt
                  </span>
                )}
                <p className="text-2xl font-light text-stone-900">
                  {finalPrice.toFixed(2)}tmt
                </p>
              </div>
              <div className="w-12 h-0.5 bg-amber-500 mb-8" />
              <p className="text-stone-600 leading-relaxed font-light">
                {getProductDescription(product)}
              </p>
            </div>

            <div className="space-y-6">
              {sizes.length > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">{t('size')}</p>
                    <div className="flex gap-2">
                      {sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`w-10 h-10 border rounded flex items-center justify-center text-sm transition-all ${selectedSize === s
                            ? 'border-stone-900 bg-stone-900 text-white'
                            : 'border-stone-200 hover:border-stone-900'
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white h-14 text-lg gap-3 rounded-none"
              >
                <ShoppingCart className="w-5 h-5" />
                {t('addToCart')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog >
  );
}
