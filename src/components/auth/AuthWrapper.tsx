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
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                keyboardShouldPersistTaps="handled"
                className="px-6 py-8"
            >
                <View className={cn("w-full max-w-md mx-auto", className)}>
                    <View className="px-2 py-4">
                        {/* Logo and Header */}
                        <View className="items-start mb-6">
                            <View className="h-24 w-24 items-center justify-center mb-6 bg-transparent">
                                <Image
                                    source={require('../../assets/logo.png')}
                                    className="h-24 w-24"
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={{ fontSize: 36, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 }}>
                                {title}
                            </Text>
                            {description && (
                                <Text style={{ fontSize: 16, color: '#64748B', marginTop: 6, lineHeight: 24 }}>
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
    );
}
