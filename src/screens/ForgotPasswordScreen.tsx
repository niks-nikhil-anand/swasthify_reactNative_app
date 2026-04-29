import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Mail, Info } from 'lucide-react-native';
import { RootDrawerParamList } from '../navigation/types';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { AuthWrapper } from '../components/auth/AuthWrapper';

type ForgotPasswordScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'ForgotPassword'>;
};

const ForgotPasswordScreen = ({ navigation }: ForgotPasswordScreenProps) => {
    return (
        <AuthWrapper
            title="Forgot password?"
            description="No worries — enter your email and we'll send you a reset link."
        >
            <View className="w-full">
                <View className="mt-2">
                    <Text className="text-sm font-bold text-slate-900 dark:text-white mb-2">Email address</Text>
                    <View className="flex-row items-center h-14 bg-white dark:bg-slate-900 border-[1.5px] border-slate-100 dark:border-slate-800 rounded-2xl px-4">
                        <View className="mr-3">
                            <Mail size={20} color="#94A3B8" />
                        </View>
                        <TextInput
                            placeholder="ayan@gmail.com"
                            placeholderTextColor="#94A3B8"
                            className="flex-1 text-base text-slate-900 dark:text-white"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <TouchableOpacity className="bg-primary h-14 rounded-[20px] items-center justify-center mt-6 shadow-lg shadow-primary/20">
                    <Text className="text-white text-lg font-bold">Send reset link</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-sm text-slate-500">Remembered it? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <Text className="text-sm font-bold text-primary">Back to Sign In</Text>
                    </TouchableOpacity>
                </View>

                <View className="h-[1px] bg-slate-100 dark:bg-slate-800 my-8" />

                <View className="flex-row bg-[#FFFBEB] dark:bg-amber-950/20 border border-[#FDE68A] dark:border-amber-900/50 p-4 rounded-[20px]">
                    <View className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 items-center justify-center mr-3">
                        <Info size={18} color="#92400E" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-black text-amber-800 dark:text-amber-200">Trouble accessing email?</Text>
                        <Text className="text-[13px] text-amber-800 dark:text-amber-300 mt-1 leading-[18px]">
                            Try resetting via mobile OTP instead. <Text className="font-black underline">Use phone</Text>
                        </Text>
                    </View>
                </View>
            </View>
        </AuthWrapper>
    );
};

export default ForgotPasswordScreen;
