import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { ChevronLeft, Mail, Lock, Info } from 'lucide-react-native';
import { RootDrawerParamList } from '../navigation/types';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type ForgotPasswordScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'ForgotPassword'>;
};

const ForgotPasswordScreen = ({ navigation }: ForgotPasswordScreenProps) => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 pt-3">
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    className="w-11 h-11 rounded-xl border border-[#F1F5F9] items-center justify-center"
                >
                    <ChevronLeft size={24} color="#0F172A" />
                </TouchableOpacity>
            </View>

            <View className="flex-1 px-6 pt-6">
                <View className="w-16 h-16 rounded-[20px] bg-[#E6F6EF] items-center justify-center mb-6">
                    <Lock size={32} color="#0EA968" />
                </View>

                <Text className="text-[32px] font-black text-[#0F172A] tracking-tighter">Forgot password?</Text>
                <Text className="text-base text-[#64748B] mt-2 leading-6">
                    No worries — enter your email and we'll send you a reset link.
                </Text>

                <View className="mt-8">
                    <Text className="text-sm font-bold text-[#0F172A] mb-2">Email address</Text>
                    <View className="flex-row items-center h-14 bg-white border-[1.5px] border-[#F1F5F9] rounded-2xl px-4">
                        <View className="mr-3">
                            <Mail size={20} color="#94A3B8" />
                        </View>
                        <TextInput
                            placeholder="ayan@gmail.com"
                            placeholderTextColor="#94A3B8"
                            className="flex-1 text-base text-[#0F172A]"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <TouchableOpacity className="bg-[#0EA968] h-14 rounded-[20px] items-center justify-center mt-6 shadow-lg shadow-[#0EA968]/20">
                    <Text className="text-white text-lg font-bold">Send reset link</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-sm text-[#64748B]">Remembered it? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <Text className="text-sm font-bold text-[#0EA968]">Back to Sign In</Text>
                    </TouchableOpacity>
                </View>

                <View className="h-[1px] bg-[#F1F5F9] my-8" />

                <View className="flex-row bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-[20px]">
                    <View className="w-8 h-8 rounded-xl bg-white items-center justify-center mr-3">
                        <Info size={18} color="#92400E" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-black color-[#92400E]">Trouble accessing email?</Text>
                        <Text className="text-[13px] color-[#92400E] mt-1 leading-[18px]">
                            Try resetting via mobile OTP instead. <Text className="font-black underline">Use phone</Text>
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;
