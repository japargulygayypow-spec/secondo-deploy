import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import { useLanguage } from '@/components/LanguageContext';

export const useCategories = () => {
    const { language } = useLanguage();
    return useQuery({
        queryKey: ['categories', language],
        queryFn: async () => {
            const data = await productApi.getCategories(language);
            return Array.isArray(data) ? data : [];
        }
    });
};
