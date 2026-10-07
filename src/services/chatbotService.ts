import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://www.swasthify.in';

export type ChatbotSendMessagePayload = {
    message: string;
    conversationId?: string | null;
};

export type ChatbotSendMessageResponse = {
    reply: string;
    conversationId?: string;
    suggestions?: string[];
};

const requestJson = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
    const token = await AsyncStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw data?.error || data?.message || data?.details || 'Unable to reach Swasthify Assistant right now.';
    }

    return data as T;
};

export const chatbotService = {
    sendMessage: async ({
        message,
        conversationId,
    }: ChatbotSendMessagePayload): Promise<ChatbotSendMessageResponse> => {
        try {
            const payload = {
                message,
                conversationId,
                context: {
                    panel: 'patient',
                    source: 'mobile',
                    app: 'swasthify-react-native',
                },
            };

            if (__DEV__) {
                console.log('[chatbot] request payload', payload);
            }

            const response = await requestJson<any>('/api/chatbot', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            return {
                reply: response?.response || response?.reply || response?.message || 'I received your message.',
                conversationId: response?.conversationId || conversationId || undefined,
                suggestions: Array.isArray(response?.suggestions) ? response.suggestions : [],
            };
        } catch (error: any) {
            throw error.response?.data?.error || error.response?.data?.message || 'Unable to reach Swasthify Assistant right now.';
        }
    },

    getSuggestions: async (): Promise<string[]> => {
        try {
            const response = await requestJson<any>('/api/chatbot/suggestions?panel=general');
            const suggestions = response?.suggestions;

            if (!Array.isArray(suggestions)) {
                return [];
            }

            return suggestions
                .map((item: any) => typeof item === 'string' ? item : item?.question)
                .filter((question: unknown): question is string => typeof question === 'string' && question.trim().length > 0);
        } catch {
            return [];
        }
    },
};
