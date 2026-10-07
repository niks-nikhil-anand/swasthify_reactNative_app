import React, { useEffect, useRef, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ArrowLeft, Bot, Send, ShieldCheck } from 'lucide-react-native';
import { RootDrawerParamList } from '../navigation/types';
import { ChatMessage, ChatMessageBubble } from '../components/chatbot/ChatMessageBubble';
import { ChatbotSkeleton } from '../components/chatbot/ChatbotSkeleton';
import { chatbotService } from '../services/chatbotService';
import { cn } from '../lib/utils';

type ChatbotScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'Chatbot'>;
};

const fallbackSuggestions = [
    'Book an appointment',
    'Find a doctor',
    'Check health packages',
    'Upload health record',
    'Contact support',
];

const createMessage = (role: ChatMessage['role'], text: string, status: ChatMessage['status'] = 'sent'): ChatMessage => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    status,
    createdAt: new Date().toISOString(),
});

const ChatbotScreen = ({ navigation }: ChatbotScreenProps) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isResponding, setIsResponding] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>(fallbackSuggestions);
    const [areSuggestionsLoading, setAreSuggestionsLoading] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>([
        createMessage('assistant', 'Hi, I am your Swasthify Assistant. Ask me about doctors, appointments, reports, packages, or support.'),
    ]);

    const trimmedInput = input.trim();
    const canSend = trimmedInput.length > 0 && !isResponding;

    useEffect(() => {
        let isMounted = true;

        const loadSuggestions = async () => {
            const apiSuggestions = await chatbotService.getSuggestions();
            if (!isMounted) return;

            setSuggestions(apiSuggestions.length > 0 ? apiSuggestions : fallbackSuggestions);
            setAreSuggestionsLoading(false);
        };

        loadSuggestions();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', scrollToEnd);
        return () => showSubscription.remove();
    }, []);

    const scrollToEnd = () => {
        requestAnimationFrame(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        });
    };

    const sendMessage = async (text: string, retryMessage?: ChatMessage) => {
        const cleanText = text.trim();
        if (!cleanText || isResponding) return;

        const userMessage = retryMessage
            ? { ...retryMessage, status: 'sent' as const, id: retryMessage.id }
            : createMessage('user', cleanText, 'sent');

        setInput('');
        setIsResponding(true);
        setMessages((current) => retryMessage
            ? current.map((message) => message.id === retryMessage.id ? userMessage : message)
            : [...current, userMessage]
        );
        scrollToEnd();

        try {
            const response = await chatbotService.sendMessage({
                message: cleanText,
                conversationId,
            });

            if (response.conversationId) {
                setConversationId(response.conversationId);
            }

            if (response.suggestions && response.suggestions.length > 0) {
                setSuggestions(response.suggestions);
            }

            setMessages((current) => [
                ...current,
                createMessage('assistant', response.reply || 'I am here to help. Could you share a little more detail?'),
            ]);
        } catch (error: any) {
            setMessages((current) => [
                ...current,
                createMessage(
                    'assistant',
                    'I am having trouble connecting to Swasthify Assistant right now. Please try again in a moment, or use the quick prompts below.'
                ),
            ]);
        } finally {
            setIsResponding(false);
            scrollToEnd();
        }
    };

    const handleRetry = (message: ChatMessage) => {
        sendMessage(message.text, message);
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['top', 'left', 'right', 'bottom']}>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                <View className="flex-row items-center px-5 py-4 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 shadow-sm">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-900 items-center justify-center mr-3 border border-slate-200 dark:border-slate-800"
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                    >
                        <ArrowLeft size={21} color="#0F172A" />
                    </TouchableOpacity>

                    <View className="h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 items-center justify-center mr-3 border border-emerald-100 dark:border-emerald-500/20">
                        <Bot size={23} color="#10B981" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-black text-slate-900 dark:text-white">Swasthify Assistant</Text>
                        <View className="flex-row items-center mt-0.5">
                            <View className="h-2 w-2 rounded-full bg-primary mr-2" />
                            <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400">Online to help</Text>
                        </View>
                    </View>
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1 px-5"
                    contentContainerStyle={{ paddingTop: 18, paddingBottom: 24 }}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="interactive"
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={scrollToEnd}
                >
                    <View className="flex-row bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl mb-5 border border-emerald-100 dark:border-emerald-900/60">
                        <ShieldCheck size={19} color="#10B981" />
                        <Text className="flex-1 text-[13px] leading-5 text-emerald-800 dark:text-emerald-300 ml-3">
                            This assistant can guide you through Swasthify services. For emergencies, contact local emergency care immediately.
                        </Text>
                    </View>

                    {messages.map((message) => (
                        <ChatMessageBubble key={message.id} message={message} onRetry={handleRetry} />
                    ))}

                    {messages.length === 1 && (
                        <View className="mb-4">
                            <Text className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3">
                                Quick prompts
                            </Text>
                            {areSuggestionsLoading ? (
                                <View className="flex-row flex-wrap gap-2">
                                    <View className="h-10 w-36 rounded-full bg-slate-200 dark:bg-slate-800" />
                                    <View className="h-10 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
                                    <View className="h-10 w-40 rounded-full bg-slate-200 dark:bg-slate-800" />
                                </View>
                            ) : (
                                <View className="flex-row flex-wrap gap-2">
                                    {suggestions.map((suggestion) => (
                                        <TouchableOpacity
                                            key={suggestion}
                                            onPress={() => sendMessage(suggestion)}
                                            disabled={isResponding}
                                            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                                            activeOpacity={0.8}
                                        >
                                            <Text className="text-sm font-bold text-slate-700 dark:text-slate-200">{suggestion}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    {messages.length > 1 && !isResponding && suggestions.length > 0 && (
                        <View className="mb-4">
                            <View className="flex-row flex-wrap gap-2">
                                {suggestions.slice(0, 3).map((suggestion) => (
                                    <TouchableOpacity
                                        key={suggestion}
                                        onPress={() => sendMessage(suggestion)}
                                        disabled={isResponding}
                                        className="px-3.5 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                                        activeOpacity={0.8}
                                    >
                                        <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{suggestion}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {isResponding && <ChatbotSkeleton />}
                </ScrollView>

                <View className="px-5 pt-3 pb-3 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                    <View
                        className={cn(
                            'flex-row items-end rounded-[24px] px-4 py-2 border',
                            isInputFocused
                                ? 'bg-white dark:bg-slate-900 border-primary shadow-lg shadow-primary/10'
                                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        )}
                    >
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="Ask about appointments, reports, doctors..."
                            placeholderTextColor="#94A3B8"
                            multiline
                            maxLength={600}
                            editable={!isResponding}
                            onFocus={() => {
                                setIsInputFocused(true);
                                scrollToEnd();
                            }}
                            onBlur={() => setIsInputFocused(false)}
                            className="flex-1 max-h-28 min-h-11 text-[15px] leading-5 text-slate-900 dark:text-white py-2.5 pr-3"
                        />
                        <TouchableOpacity
                            onPress={() => sendMessage(trimmedInput)}
                            disabled={!canSend}
                            className={cn(
                                'h-11 w-11 rounded-2xl items-center justify-center mb-0.5',
                                canSend ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-800'
                            )}
                            accessibilityRole="button"
                            accessibilityLabel="Send message"
                            activeOpacity={0.85}
                        >
                            <Send size={18} color={canSend ? '#FFFFFF' : '#94A3B8'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatbotScreen;
