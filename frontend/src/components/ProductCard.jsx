import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/LanguageContext';
import { useCart } from '@/context/CartContext';
import ProductModal from '@/components/ProductModal';

export default function ProductCard({ product, index }) {
  const { t, getProductName, getProductType, getProductDescription } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  if (!product) return null;

  const hasDiscount = Number(product.discount) > 0;
  const originalPrice = Number(product.price);
  const calculatedDiscountPrice = originalPrice - (originalPrice * (Number(product.discount) / 100));
  const finalPrice = hasDiscount
    ? (Number(product.discounted_price) || calculatedDiscountPrice)
    : originalPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white rounded-xl overflow-hidden border border-stone-100 hover:shadow-xl transition-all duration-500"
    >
      <ProductModal product={product}>
        <div className="cursor-pointer">
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
            {!imageError && product.image ? (
              <img
                src={product.image}
                alt={getProductName(product)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-100">
                <ImageIcon className="w-12 h-12 text-stone-300" />
              </div>
            )}

            {/* Overlay Actions - Hidden on mobile, shown on hover for desktop */}
            <div className="absolute inset-0 bg-black/20 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              <div className="rounded-full bg-white text-stone-900 w-10 h-10 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors duration-300 shadow-lg">
                <Eye className="w-5 h-5" />
              </div>
            </div>

            {/* Discount Badge */}
            {hasDiscount && (
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-red-50 text-red-600 text-[10px] font-medium px-2 py-0.5 rounded-full border border-red-100">
                -{Number(product.discount).toFixed(0)}%
              </div>
            )}

            {product.featured && (
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-amber-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded uppercase tracking-wider shadow-sm">
                {t('featured')}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4">
            <div className="mb-1 sm:mb-2">
              <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-0.5 sm:mb-1">
                {getProductType(product)}
              </p>
              <h3 className="text-xs sm:text-sm font-medium text-stone-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                {getProductName(product)}
              </h3>
              <p className="text-[11px] text-stone-500 line-clamp-2">{getProductDescription(product)}</p>
            </div>

            <div className="flex items-center justify-between mt-2 sm:mt-4">
              <div className="flex flex-col">
                {hasDiscount && (
                  <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                    {Number(product.price).toFixed(2)}tmt
                  </span>
                )}
                <p className="text-sm sm:text-lg font-light text-stone-900">
                  {finalPrice.toFixed(2)}tmt
                </p>
              </div>
              <Button onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                variant="ghost"
                size="sm"
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 font-medium text-[10px] sm:text-xs gap-1 sm:gap-2 h-7 sm:h-9 px-2 sm:px-3"
              >
                <ShoppingCart className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                <span className="hidden xs:inline">{t('addToCart')}</span>
              </Button>
            </div>
          </div>
        </div>
      </ProductModal>
    </motion.div>
  );
}