import apiClient from '../api/apiClient';

export interface Campaign {
    _id?: string;
    id?: string;
    doctorId?: string;
    name?: string;
    title?: string;
    description: string;
    type: string;
    status?: string;
    price: number;
    currency?: string;
    discountPercentage: number;
    location?: {
        city: string;
        state?: string;
        address: string;
        pincode?: string;
        district?: string;
        latitude?: number;
        longitude?: number;
    };
    startDate?: string;
    endDate?: string;
    schedule?: {
        days: string[];
        startTime: string;
        endTime: string;
    };
    dailyLimit?: number;
    hourlyLimit?: number;
    totalCapacity?: number;
    requiredDetails?: string[];
    isVerified: boolean;
    image?: string;
    source: 'doctor' | 'lab';
    doctor?: {
        id: string;
        userId: string;
        bio?: string;
        experienceYears?: number;
        qualification?: string;
        clinicName?: string;
        hospitalName?: string;
        profilePhoto?: string;
        clinicImages?: string[];
        user: {
            name: string;
            email?: string;
        };
        specializations: Array<{
            id: string;
            name: string;
        }>;
    };
    lab?: any;
}

export const publicService = {
    getCampaigns: async (source: 'doctor' | 'lab', limit: number = 3): Promise<Campaign[]> => {
        try {
            const response = await apiClient.get(`/api/public/campaigns?source=${source}&limit=${limit}`);
            const result = response.data;
            return Array.isArray(result) ? result : (result.data || []);
        } catch (error: any) {
            console.error(`Error fetching ${source} campaigns:`, error);
            throw error.response?.data?.message || `Failed to fetch ${source} campaigns`;
        }
    },

    getCampaignById: async (id: string): Promise<Campaign> => {
        try {
            const response = await apiClient.get(`/api/public/campaigns/${id}`);
            const result = response.data;
            return result.data || result;
        } catch (error: any) {
            console.error(`Error fetching campaign ${id}:`, error);
            throw error.response?.data?.message || `Failed to fetch campaign details`;
        }
    }
};
