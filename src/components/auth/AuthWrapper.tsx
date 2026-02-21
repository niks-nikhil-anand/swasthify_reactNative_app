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
            className="flex-1 bg-[#F9FAFB]"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                keyboardShouldPersistTaps="handled"
                className="px-6 py-8"
            >
                <View className={cn("w-full max-w-md mx-auto space-y-6", className)}>
                    <View className="bg-white px-6 py-10 rounded-3xl shadow-lg border border-gray-100">
                        {/* Logo and Header */}
                        <View className="items-center mb-8">
                            <View className="h-24 w-24 items-center justify-center mb-4 bg-gray-50 rounded-2xl">
                                <Image
                                    source={require('../../assets/logo.png')}
                                    className="h-20 w-20"
                                    resizeMode="contain"
                                />
                            </View>
                            <Text className="text-3xl font-bold tracking-tight text-gray-900 text-center">
                                {title}
                            </Text>
                            {description && (
                                <Text className="mt-2 text-sm text-gray-500 text-center">
                                    {description}
                                </Text>
                            )}
                        </View>

                        <View className="gap-y-6">
                            {children}

                            {showSocial && (
                                <>
                                    <View className="relative my-4">
                                        <View className="absolute inset-0 flex items-center justify-center">
                                            <View className="w-full border-t border-gray-200" />
                                        </View>
                                        <View className="relative flex-row justify-center bg-white px-4 self-center">
                                            <Text className="text-xs text-gray-400 font-medium">
                                                Or continue with
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="gap-3">
                                        <TouchableOpacity
                                            onPress={onGoogleClick || signInWithGoogle}
                                            disabled={isGoogleLoading}
                                            className="flex-row w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4 active:bg-gray-50"
                                        >
                                            {isGoogleLoading ? (
                                                <ActivityIndicator size="small" color="#4285F4" />
                                            ) : (
                                                <Image
                                                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                                                    style={{ width: 20, height: 20 }}
                                                />
                                            )}
                                            <Text className="text-sm font-semibold text-gray-700">
                                                {isGoogleLoading ? "Connecting..." : "Continue with Google"}
                                            </Text>
                                        </TouchableOpacity>

                                        <View className="flex-row gap-3">
                                            <TouchableOpacity
                                                onPress={onOtpClick}
                                                className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 active:bg-gray-50"
                                            >
                                                <Feather name="smartphone" size={16} color="#4B5563" />
                                                <Text className="text-xs font-medium text-gray-700">OTP</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={onEmailLinkClick}
                                                className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 active:bg-gray-50"
                                            >
                                                <Feather name="mail" size={16} color="#4B5563" />
                                                <Text className="text-xs font-medium text-gray-700">Email Link</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </>
                            )}

                            {backButtonLabel && (
                                <View className="items-center mt-6">
                                    <TouchableOpacity onPress={onBackPress}>
                                        <Text className="font-bold text-[#0DA96E] text-sm">
                                            {backButtonLabel}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
