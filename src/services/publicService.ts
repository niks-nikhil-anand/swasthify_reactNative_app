import apiClient from '../api/apiClient';

export interface Campaign {
    _id?: string;
    id?: string;
    title?: string; // Standardized title
    name?: string;  // Also used in some versions
    description: string;
    image?: string;
    source: 'doctor' | 'lab';
    ctaText?: string;
    ctaLink?: string;
    price: number;
    discountPercentage: number;
    isVerified: boolean;
    type: string;
    location?: {
        city: string;
        address: string;
    };
    doctor?: {
        profilePhoto?: string;
        user: {
            name: string;
        };
        specializations: Array<{ name: string }>;
    };
}

export const publicService = {
    getCampaigns: async (source: 'doctor' | 'lab', limit: number = 3): Promise<Campaign[]> => {
        try {
            const response = await apiClient.get(`/api/public/campaigns?source=${source}&limit=${limit}`);
            // Handle both { data: [...] } and directly [...]
            const result = response.data;
            return Array.isArray(result) ? result : (result.data || []);
        } catch (error: any) {
            console.error(`Error fetching ${source} campaigns:`, error);
            throw error.response?.data?.message || `Failed to fetch ${source} campaigns`;
        }
    }
};
