import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AlertCircle, RotateCcw } from 'lucide-react-native';
import { cn } from '../../lib/utils';

export type ChatMessage = {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    createdAt: string;
    status?: 'sending' | 'sent' | 'failed';
};

type ChatMessageBubbleProps = {
    message: ChatMessage;
    onRetry?: (message: ChatMessage) => void;
};

export function ChatMessageBubble({ message, onRetry }: ChatMessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <View className={cn('mb-4 flex-row', isUser ? 'justify-end' : 'justify-start')}>
            <View
                className={cn(
                    'max-w-[82%] rounded-2xl px-4 py-3',
                    isUser
                        ? 'bg-primary rounded-br-md'
                        : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-bl-md',
                    message.status === 'failed' ? 'border border-rose-300' : ''
                )}
            >
                <Text
                    className={cn(
                        'text-[15px] leading-6',
                        isUser ? 'text-white font-medium' : 'text-slate-800 dark:text-slate-100'
                    )}
                >
                    {message.text}
                </Text>

                {message.status === 'failed' && (
                    <TouchableOpacity
                        onPress={() => onRetry?.(message)}
                        className="flex-row items-center mt-2"
                        activeOpacity={0.8}
                    >
                        <AlertCircle size={14} color="#FB7185" />
                        <Text className="text-[12px] font-bold text-rose-500 ml-1.5 mr-2">Could not send</Text>
                        <RotateCcw size={13} color="#10B981" />
                        <Text className="text-[12px] font-bold text-primary ml-1">Retry</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
