import { useQuery } from '@tanstack/react-query';
import { productApi } from '../lib/api';

export const useProduct = (id) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.getProduct(id),
        enabled: !!id,
    });
};
