import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useBanners } from '@/hooks/useBanners';
import HeroSection from '@/components/HeroSection';
import BannerCarousel from '@/components/BannerCarousel';
import CollectionCard from '@/components/CollectionCard';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';


import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import ProductModal from '@/components/ProductModal';

export default function Home() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: discountData, isLoading: discountLoading } = useProducts({ discounted: 'true' });
  const { data: newArrivalsData, isLoading: newArrivalsLoading } = useProducts({ ordering: '-created_at' });
  const { data: allCategories, isLoading: categoriesLoading } = useCategories();
  const { data: banners, isLoading: bannersLoading } = useBanners();
  const { data: singleProduct } = useProduct(id);

  const discountProducts = discountData?.products || [];
  const newArrivals = newArrivalsData?.products || [];

  const displayedDiscount = discountProducts.slice(0, 4);
  const displayedNewArrivals = newArrivals.slice(0, 4);

  // Mappings for known categories with custom images
  const categoryConfig = {
    'man': { link: 'Men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80', transKey: 'menCollection' },
    'women': { link: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', transKey: 'womenCollection' },
    'children': { link: 'Kids', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80', transKey: 'kidsCollection' },
    'home': { link: 'home', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', transKey: 'homeCollection' }
  };

  // Generate placeholder image based on category name
  const getPlaceholderImage = (categoryName) => {
    const seed = categoryName.toLowerCase().replace(/\s+/g, '-');
    return `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80&auto=format&fit=crop`;
  };

  // Capitalize first letter for link generation
  const capitalizeSlug = (slug) => {
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  const collections = (allCategories || [])
    .filter(c => c.parent === null)
    .sort((a, b) => a.id - b.id)
    .map(c => {
      const config = categoryConfig[c.slug];

      if (config) {
        // Use predefined config for known categories
        return {
          title: c.name,
          image: config.image,
          link: config.link,
          id: c.id
        };
      } else {
        // Auto-generate for new categories
        return {
          title: c.name,
          image: getPlaceholderImage(c.name),
          link: capitalizeSlug(c.slug),
          id: c.id
        };
      }
    });

  // Fallback if API hasn't loaded yet or returns nothing (to avoid empty section on first load dev)
  if (collections.length === 0 && !categoriesLoading) {
    // Keep static as fallback? Or just empty.
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Banner Carousel or Hero Section */}
      {!bannersLoading && banners && banners.length > 0 ? (
        <BannerCarousel banners={banners} />
      ) : (
        <HeroSection />
      )}

      {/* Collections */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-stone-900 mb-4">
            {t('exploreCollection')}
          </h2>
          <div className="w-16 sm:w-20 h-0.5 bg-amber-500 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {collections.map((collection, index) => (
            <CollectionCard key={collection.link} {...collection} index={index} />
          ))}
        </div>
      </section>

      {/* Discount Products */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-8 sm:mb-12"
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-stone-900">
              {t('discountProducts')}
            </h2>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
          </motion.div>

          {!discountLoading && displayedDiscount && displayedDiscount.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              {displayedDiscount.map((product, index) => (
                <div key={product.id} className="w-[calc(50%-6px)] sm:w-[calc(50%-12px)] md:w-[calc(25%-18px)]">
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-stone-500 py-10">
              {discountLoading ? t('loading') : t('noProducts')}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-8 sm:mb-12"
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-stone-900">
              {t('newArrivals')}
            </h2>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
          </motion.div>

          {!newArrivalsLoading && displayedNewArrivals && displayedNewArrivals.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              {displayedNewArrivals.map((product, index) => (
                <div key={product.id} className="w-[calc(50%-6px)] sm:w-[calc(50%-12px)] md:w-[calc(25%-18px)]">
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-stone-500 py-10">
              {newArrivalsLoading ? t('loading') : t('noProducts')}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Product Modal overlay for direct links */}
      {singleProduct && (
        <ProductModal
          product={singleProduct}
          open={!!id}
          onOpenChange={(open) => !open && navigate('/')}
        />
      )}
    </div>
  );
}
