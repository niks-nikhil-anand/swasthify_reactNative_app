import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionSheetIOS } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { cn } from '../../lib/utils';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

interface AuthWrapperProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    backButtonLabel?: string;
    onBackPress?: () => void;
    showSocial?: boolean;
    onGoogleClick?: () => void;
    onOtpClick?: () => void;
    onEmailLinkClick?: () => void;
    className?: string;
    role?: string;
    redirectTo?: string;
}

export function AuthWrapper({
    children,
    title,
    description,
    backButtonLabel,
    onBackPress,
    showSocial,
    onGoogleClick,
    onOtpClick,
    onEmailLinkClick,
    className,
    role = "patient",
    redirectTo = "Home"
}: AuthWrapperProps) {
    const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth({ role, redirectTo });

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    className="px-6"
                    showsVerticalScrollIndicator={false}
                >
                    <View className={cn("w-full max-w-md mx-auto pt-6 pb-10", className)}>
                        <View className="px-2">
                        {/* Logo and Header */}
                        <View className="items-start mb-6">
                            <View className="h-24 w-24 items-center justify-center mb-6 bg-transparent">
                                <Image
                                    source={require('../../assets/logo.png')}
                                    className="h-24 w-24"
                                    resizeMode="contain"
                                />
                            </View>
                            <Text className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                                {title}
                            </Text>
                            {description && (
                                <Text className="text-base text-slate-500 dark:text-slate-300 mt-2 leading-6">
                                    {description}
                                </Text>
                            )}
                        </View>

                        <View className="gap-y-6 mt-4">
                            {children}
                        </View>
                    </View>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
