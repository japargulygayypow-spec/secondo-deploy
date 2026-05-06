import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import { useLanguage } from '@/components/LanguageContext';

export const useProducts = (params = {}) => {
    const { language } = useLanguage();
    return useQuery({
        queryKey: ['products', language, params],
        queryFn: async () => {
            try {
                return await productApi.getProducts(language, params);
            } catch (e) {
                console.error(e);
                return { results: [], count: 0, next: null, previous: null };
            }
        },
        select: (apiResponse) => {
            const apiResults = apiResponse?.results || [];
            const validResults = Array.isArray(apiResults) ? apiResults.filter(item => item !== null && item !== undefined) : [];
            const products = validResults.map(p => ({
                id: p.id,
                name: p.title,
                name_en: p.title_en,
                name_ru: p.title_ru,
                name_tk: p.title_tk,
                description: p.description,
                description_en: p.description_en,
                description_ru: p.description_ru,
                description_tk: p.description_tk,
                price: parseFloat(p.price),
                image: p.image,
                images: p.images || (p.image ? [p.image] : []),
                category: p.category?.name?.toLowerCase() || 'men',
                categoryId: p.category?.id,
                categoryObj: p.category,
                type: p.category?.name || 'Product',
                type_en: p.category?.name_en,
                type_ru: p.category?.name_ru,
                type_tk: p.category?.name_tk,
                variants: p.variants || [],
                featured: true,
                discount: p.discount,
                discounted_price: p.discounted_price,
            }));

            return {
                products,
                count: apiResponse?.count || 0,
                next: apiResponse?.next,
                previous: apiResponse?.previous
            };
        }
    });
};
