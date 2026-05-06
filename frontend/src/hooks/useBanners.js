import { useQuery } from '@tanstack/react-query';
import { bannerApi } from '@/lib/api';

export const useBanners = () => {
    return useQuery({
        queryKey: ['banners_v2'], // Force refresh
        queryFn: async () => {
            const data = await bannerApi.getBanners();
            return Array.isArray(data) ? data : [];
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    });
};
