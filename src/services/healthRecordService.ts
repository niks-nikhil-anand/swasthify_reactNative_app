import apiClient from '../api/apiClient';

export interface HealthRecord {
    id: string;
    title: string;
    description?: string | null;
    category?: string;
    fileUrl: string;
    sizeMb: number;
    createdAt: string;
}

export interface UploadHealthRecordPayload {
    file: {
        uri: string;
        name: string;
        type: string;
    };
    title: string;
    description?: string;
    category?: string;
}

export const healthRecordService = {
    /**
     * Fetch all health records for the authenticated patient
     */
    getHealthRecords: async (): Promise<{ documents: HealthRecord[] }> => {
        try {
            const response = await apiClient.get('/api/me/health-records');
            return response.data;
        } catch (error: any) {
            console.error('Error fetching health records:', error);
            throw error.response?.data?.message || 'Failed to fetch health records';
        }
    },

    /**
     * Upload a new health record
     */
    uploadHealthRecord: async (payload: UploadHealthRecordPayload): Promise<HealthRecord> => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: payload.file.uri,
                name: payload.file.name,
                type: payload.file.type,
            } as any);
            formData.append('title', payload.title);
            if (payload.description) formData.append('description', payload.description);
            if (payload.category) formData.append('category', payload.category);

            const response = await apiClient.post('/api/me/health-records', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            console.error('Error uploading health record:', error);
            throw error.response?.data?.message || 'Failed to upload health record';
        }
    },
};
