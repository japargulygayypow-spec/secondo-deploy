const BASE_URL = import.meta.env.VITE_API_URL || '';

const getTokens = () => {
    const tokens = localStorage.getItem('auth_tokens');
    return tokens ? JSON.parse(tokens) : null;
};

const setTokens = (tokens) => {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
};

const clearTokens = () => {
    localStorage.removeItem('auth_tokens');
};

const refreshAccessToken = async () => {
    const tokens = getTokens();
    if (!tokens || !tokens.refresh) return null;

    try {
        const response = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: tokens.refresh }),
        });

        if (response.ok) {
            const data = await response.json();
            // Use the new access token, keep old refresh if not returned
            const newTokens = { ...tokens, access: data.access, refresh: data.refresh || tokens.refresh };
            setTokens(newTokens);
            return data.access;
        } else {
            clearTokens();
            return null;
        }
    } catch (error) {
        console.error('Failed to refresh token', error);
        clearTokens();
        return null;
    }
};

const apiRequest = async (endpoint, options = {}) => {
    let tokens = getTokens();
    let headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (tokens && tokens.access) {
        headers['Authorization'] = `Bearer ${tokens.access}`;
    }

    const config = {
        credentials: 'include',
        ...options,
        headers,
    };

    let response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (response.status === 401 && tokens) {
        // Attempt refresh
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
            headers['Authorization'] = `Bearer ${newAccessToken}`;
            response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
        } else {
            // Refresh failed, logout required (handled by caller or context)
            // We can throw or return 401
            // window.location.href = '/login'; // Optional: force redirect or let context handle
        }
    }

    return response;
};

export const authApi = {
    login: async (credentials) => {
        const response = await fetch(`${BASE_URL}/api/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (response.ok) {
            setTokens(data);
        }
        return { data, ok: response.ok, status: response.status };
    },

    register: async (userData) => {
        const response = await fetch(`${BASE_URL}/api/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return response.json();
    },

    getProfile: async () => {
        const response = await apiRequest('/api/auth/profile/', { method: 'GET' });
        if (response.ok) return response.json();
        throw new Error('Failed to fetch profile');
    },

    logout: () => {
        clearTokens();
    },

    isAuthenticated: () => !!getTokens(),
};

export const productApi = {
    getProducts: async (lang = 'en', params = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value);
            }
        });
        const queryString = queryParams.toString();
        const url = `${BASE_URL}/api/catalog/products/${queryString ? '?' + queryString : ''}`;

        const response = await fetch(url, {
            headers: { 'Accept-Language': lang }
        }); // Public
        const data = await response.json();

        // Handle paginated response from DRF
        if (data && data.results) {
            return {
                results: data.results,
                count: data.count,
                next: data.next,
                previous: data.previous
            };
        }

        // Fallback for non-paginated response
        const results = Array.isArray(data) ? data : [];
        return { results, count: results.length, next: null, previous: null };
    },
    getCategories: async (lang = 'en') => {
        const response = await fetch(`${BASE_URL}/api/catalog/categories/`, {
            headers: { 'Accept-Language': lang }
        }); // Public
        return response.json();
    },
    getProduct: async (id, lang = 'en') => {
        const response = await fetch(`${BASE_URL}/api/catalog/products/${id}/`, {
            headers: { 'Accept-Language': lang }
        });
        return response.json();
    },
    searchProducts: async (query, lang = 'en') => {
        const response = await fetch(`${BASE_URL}/api/catalog/search/?q=${encodeURIComponent(query)}`, {
            headers: { 'Accept-Language': lang }
        }); // Public
        return response.json();
    }
};


export const cartApi = {
    getCart: async () => {
        const response = await apiRequest('/api/cart/'); // Handles auth header if present
        if (response.ok) return response.json();
        return null;
    },
    addToCart: async (productId, variantId, quantity = 1) => {
        const response = await apiRequest('/api/cart/add_item/', {
            method: 'POST',
            body: JSON.stringify({ product_id: productId, variant_id: variantId, quantity }),
        });
        return response.json();
    },
    updateItem: async (itemId, quantity) => {
        const response = await apiRequest(`/api/cart-items/${itemId}/`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
        });
        return response.json();
    },
    removeItem: async (itemId) => {
        const response = await apiRequest(`/api/cart-items/${itemId}/`, {
            method: 'DELETE',
        });
        return response.ok;
    },
    clearCart: async () => {
        const response = await apiRequest(`/api/cart/clear/`, {
            method: 'DELETE',
        });
        return response.ok;
    }
};

export const orderApi = {
    getPrefill: async () => {
        const response = await apiRequest('/api/orders/prefill/');
        if (response.ok) return response.json();
        return {};
    },
    checkout: async (orderData) => {
        const response = await apiRequest('/api/orders/checkout/', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
        const data = await response.json();
        if (response.ok) return data;
        const error = new Error('Checkout failed');
        error.data = data; // Attach full error data
        throw error;
    }
};

export const bannerApi = {
    getBanners: async () => {
        const response = await fetch(`${BASE_URL}/api/banners/`); // Public endpoint
        return response.json();
    }
};

export default apiRequest;
