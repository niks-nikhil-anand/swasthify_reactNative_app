import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Smartphone, ChevronLeft, ShieldCheck, Clock } from 'lucide-react-native';
import { RootDrawerParamList } from '../navigation/types';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const { width } = Dimensions.get('window');

type OtpScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'Otp'>;
    route: any;
};

const OtpScreen = ({ navigation, route }: OtpScreenProps) => {
    const { phone } = route.params || { phone: '+91 98765 43210' };
    const [otp, setOtp] = useState(['4', '8', '3', '2', '', '']);
    const activeIndex = 4;

    const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

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
                <Text className="text-[32px] font-black text-[#0F172A] tracking-tighter">Verify your number</Text>
                <Text className="text-base text-[#64748B] mt-2 leading-6">
                    We sent a 6-digit code to <Text className="text-[#0F172A] font-bold">{phone}</Text>.{' '}
                    <Text className="text-[#0EA968] font-bold">Edit</Text>
                </Text>

                <View className="flex-row justify-between mt-8">
                    {otp.map((digit, i) => (
                        <View
                            key={i}
                            className={`w-[44px] h-16 rounded-2xl border-[1.5px] items-center justify-center bg-white ${digit || i === activeIndex ? 'border-[#0EA968]' : 'border-[#F1F5F9]'}`}
                            style={i === activeIndex ? { shadowColor: '#0EA968', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 } : {}}
                        >
                            <Text className="text-2xl font-extrabold text-[#0F172A]">{digit}</Text>
                            {i === activeIndex && <View className="w-[2px] h-7 bg-[#0EA968] absolute" />}
                        </View>
                    ))}
                </View>

                <View className="flex-row items-center mt-6">
                    <Clock size={16} color="#64748B" />
                    <Text className="text-sm text-[#64748B] ml-2">
                        Resend code in <Text className="text-[#0F172A] font-bold">00:24</Text>
                    </Text>
                </View>

                <TouchableOpacity className="bg-[#0EA968] h-14 rounded-[20px] items-center justify-center mt-8 shadow-lg shadow-[#0EA968]/20">
                    <Text className="text-white text-lg font-bold">Verify & continue</Text>
                </TouchableOpacity>

                <View className="flex-row bg-[#E6F6EF] p-4 rounded-2xl mt-6 items-start">
                    <ShieldCheck size={20} color="#0EA968" />
                    <Text className="flex-1 text-[13px] color-[#065F46] ml-3 leading-5">
                        Never share your OTP. Swasthify will never ask for it on call.
                    </Text>
                </View>
            </View>

            <View className="flex-row flex-wrap px-6 pb-5">
                {keypad.map((key, i) => (
                    <TouchableOpacity key={i} className="w-1/3 h-14 items-center justify-center">
                        <Text className="text-2xl font-semibold text-[#0F172A]">{key}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
};

export default OtpScreen;
