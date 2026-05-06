import React, { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useLanguage } from '@/components/LanguageContext';
import CategoryFilter from '@/components/CategoryFilter';
import ProductGrid from '@/components/ProductGrid';
import Pagination from '@/components/Pagination';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function Women() {
  const { t, language, getProductType } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState('all');

  const { data: productsData, isLoading } = useProducts({ page: currentPage, category_id: 2 });
  const { data: categories } = useCategories();

  // Reset filter and page when language changes
  React.useEffect(() => {
    setSelectedType('all');
    setCurrentPage(1);
  }, [language]);

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedType]);

  const products = productsData?.products || [];
  const totalCount = productsData?.count || 0;
  const pageSize = 24; // Should match backend StandardResultsSetPagination.page_size
  const totalPages = Math.ceil(totalCount / pageSize);

  const womenProducts = products;

  const filteredProducts = womenProducts.filter(p => {
    return selectedType === 'all' || (getProductType(p) || '').toLowerCase() === selectedType.toLowerCase();
  });

  const uniqueTypes = [...new Set(womenProducts.map(p => getProductType(p)).filter(Boolean))];
  const womenClothingTypes = uniqueTypes.length > 0 ? uniqueTypes : ['dress', 'skirt', 'blouse'];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80"
            alt="Women's Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-light text-white mb-4">
            {t('womenCollection')}
          </h1>
          <div className="w-20 h-0.5 bg-amber-500 mx-auto" />
        </motion.div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <CategoryFilter
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            availableTypes={womenClothingTypes}
          />
        </div>

        <ProductGrid products={filteredProducts} isLoading={isLoading} />

        {!isLoading && filteredProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalCount}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}