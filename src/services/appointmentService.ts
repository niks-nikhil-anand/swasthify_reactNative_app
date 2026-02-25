import apiClient from '../api/apiClient';

export interface ReserveAppointmentPayload {
    type: 'DOCTOR' | 'LAB';
    organizerId: string;
    date: string;
    timeSlot: string;
}

export interface VerifyPaymentPayload {
    appointmentId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export const appointmentService = {
    /**
     * Step 1: Create Appointment (Reserved State)
     */
    reserveAppointment: async (payload: ReserveAppointmentPayload) => {
        try {
            const response = await apiClient.post('/api/appointments', payload);
            const raw = response.data;
            console.log('[reserveAppointment] raw response:', JSON.stringify(raw));
            // Handle various API response shapes:
            // { data: { id } } | { appointment: { id } } | { result: { id } } | { id } directly
            return raw.data || raw.appointment || raw.result || raw;
        } catch (error: any) {
            console.error('Error reserving appointment:', error?.response?.data || error);
            throw error.response?.data?.message || 'Failed to reserve appointment';
        }
    },

    /**
     * Step 2: Create Razorpay Order
     */
    createRazorpayOrder: async (appointmentId: string) => {
        try {
            const response = await apiClient.post('/api/payments/create-order', {
                appointmentId,
            });
            return response.data.data || response.data;
        } catch (error: any) {
            console.error('Error creating Razorpay order:', error);
            throw error.response?.data?.message || 'Failed to create payment order';
        }
    },

    /**
     * Step 3: Verify Payment (Post-Payment)
     */
    verifyPayment: async (payload: VerifyPaymentPayload) => {
        try {
            const response = await apiClient.post('/api/payments/verify', payload);
            return response.data;
        } catch (error: any) {
            console.error('Error verifying payment:', error);
            throw error.response?.data?.message || 'Payment verification failed';
        }
    },

    /**
     * Get appointments for the logged-in patient
     */
    getMyAppointments: async () => {
        try {
            const response = await apiClient.get('/api/me/appointments');
            return response.data;
        } catch (error: any) {
            console.error('Error fetching patient appointments:', error);
            throw error.response?.data?.message || 'Failed to fetch appointments';
        }
    },

    /**
     * Cancel an appointment
     */
    cancelAppointment: async (appointmentId: string, reason?: string) => {
        try {
            const response = await apiClient.post('/api/appointments/cancel', {
                appointmentId,
                ...(reason ? { reason } : {}),
            });
            return response.data;
        } catch (error: any) {
            console.error('Error cancelling appointment:', error);
            throw error.response?.data?.message || 'Failed to cancel appointment';
        }
    },
};
