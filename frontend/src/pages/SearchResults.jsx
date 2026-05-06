import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/components/LanguageContext';
import { productApi } from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { t, language } = useLanguage();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setProducts([]);
                return;
            }
            setIsLoading(true);
            try {
                const results = await productApi.searchProducts(query, language);
                // Transform results to match ProductGrid expectations (name mapping)
                const transformedResults = results.map(p => ({
                    ...p,
                    name: p.title,
                    name_en: p.title_en,
                    name_ru: p.title_ru,
                    name_tk: p.title_tk,
                    // Ensure images array exists for ProductGrid
                    images: p.images || (p.image ? [p.image] : []),
                }));
                setProducts(transformedResults);
            } catch (error) {
                console.error('Search failed:', error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query, language]);

    return (
        <div className="min-h-screen bg-white pt-20"> {/* pt-20 for navbar spacing */}
            <section className="py-12 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-light text-stone-900 mb-4"
                    >
                        {t('searchResults')}
                    </motion.h1>
                    <p className="text-stone-500">
                        "{query}"
                    </p>
                    <div className="w-20 h-0.5 bg-amber-500 mx-auto mt-4" />
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-stone-300" />
                    </div>
                ) : products.length > 0 ? (
                    <ProductGrid products={products} isLoading={false} />
                ) : (
                    <div className="text-center py-20 text-stone-400">
                        <p>{t('noSearchResults')} "{query}"</p>
                    </div>
                )}
            </section>
            <Footer />
        </div>
    );
}
