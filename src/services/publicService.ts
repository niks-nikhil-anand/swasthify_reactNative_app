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
    schedule?: Array<{
        days: string[];
        startTime: string;
        endTime: string;
    }>;
    dailyLimit?: number;
    hourlyLimit?: number;
    totalCapacity?: number;
    requiredDetails?: string[];
    isVerified: boolean;
    image?: string;
    source: 'doctor' | 'lab';
    testsIncluded?: string[];
    reportTime?: string;
    healthConcern?: string[];
    testCategory?: string[];
    isFreeHomeSampleCollection?: boolean;
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
    lab?: {
        id: string;
        description?: string;
        profilePhoto?: string;
        user: {
            name: string;
            email?: string;
            phone?: string;
        };
    };
}

export interface ContactTicket {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export const publicService = {
    getCampaigns: async (params: {
        source: 'doctor' | 'lab';
        limit?: number;
        page?: number;
        search?: string;
        specialization?: string;
        sortBy?: string;
    }): Promise<Campaign[]> => {
        try {
            const { source, limit = 10, page = 1, search, specialization, sortBy } = params;
            let url = `/api/public/campaigns?source=${source}&limit=${limit}&page=${page}`;

            if (search) url += `&search=${encodeURIComponent(search)}`;
            if (specialization) url += `&specialization=${encodeURIComponent(specialization)}`;
            if (sortBy) url += `&sortBy=${sortBy}`;

            const response = await apiClient.get(url);
            const result = response.data;
            return Array.isArray(result) ? result : (result.data || []);
        } catch (error: any) {
            console.error(`Error fetching ${params.source} campaigns:`, error);
            throw error.response?.data?.message || `Failed to fetch ${params.source} campaigns`;
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
    },

    createContactTicket: async (data: ContactTicket): Promise<any> => {
        try {
            const response = await apiClient.post('/api/tickets', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating contact ticket:', error);
            throw error.response?.data?.message || 'Failed to send inquiry. Please try again later.';
        }
    }
};
