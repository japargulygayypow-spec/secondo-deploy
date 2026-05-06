import React from 'react';
import ProductCard from './ProductCard';
import { useLanguage } from './LanguageContext';
import { Loader2 } from 'lucide-react';

export default function ProductGrid({ products, isLoading }) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
        <span className="ml-3 text-stone-500">{t('loading')}</span>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500 text-lg">{t('noProducts')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}