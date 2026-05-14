import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { ShieldCheck, Clock } from 'lucide-react-native';
import { RootDrawerParamList } from '../navigation/types';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { AuthWrapper } from '../components/auth/AuthWrapper';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { ActivityIndicator, Alert } from 'react-native';

const { width } = Dimensions.get('window');

type OtpScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'Otp'>;
    route: any;
};

const OtpScreen = ({ navigation, route }: OtpScreenProps) => {
    const { login } = useAuth();
    const { phone } = route.params || { phone: '+91 98765 43210' };
    const [otp, setOtp] = useState(['4', '8', '3', '2', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const activeIndex = 4;

    const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

    const handleVerify = async () => {
        setIsLoading(true);
        try {
            const response = await authService.verifyOtp({ phone, otp: otp.join('') });
            
            if (response.token && response.user) {
                await login(response.token, response.user);
                navigation.navigate('Home');
            } else {
                Alert.alert('Error', 'Invalid response from server');
            }
        } catch (error: any) {
            Alert.alert('Verification Failed', error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthWrapper
            title="Verify your number"
            description={`We sent a 6-digit code to ${phone}.`}
        >
            <View className="w-full">
                <View className="flex-row justify-between mt-2">
                    {otp.map((digit, i) => (
                        <View
                            key={i}
                            className={`w-[44px] h-16 rounded-2xl border-[1.5px] items-center justify-center bg-white dark:bg-slate-900 ${digit || i === activeIndex ? 'border-primary' : 'border-slate-100 dark:border-slate-800'}`}
                            style={i === activeIndex ? { shadowColor: '#0EA968', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 } : {}}
                        >
                            <Text className="text-2xl font-extrabold text-slate-900 dark:text-white">{digit}</Text>
                            {i === activeIndex && <View className="w-[2px] h-7 bg-primary absolute" />}
                        </View>
                    ))}
                </View>

                <View className="flex-row items-center mt-6">
                    <Clock size={16} color="#64748B" />
                    <Text className="text-sm text-slate-500 ml-2">
                        Resend code in <Text className="text-slate-900 dark:text-white font-bold">00:24</Text>
                    </Text>
                </View>

                <TouchableOpacity 
                    onPress={handleVerify}
                    disabled={isLoading}
                    className="bg-primary h-14 rounded-[20px] items-center justify-center mt-8 shadow-lg shadow-primary/20"
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text className="text-white text-lg font-bold">Verify & continue</Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row bg-[#E6F6EF] dark:bg-emerald-950/20 p-4 rounded-2xl mt-6 items-start">
                    <ShieldCheck size={20} color="#0EA968" />
                    <Text className="flex-1 text-[13px] text-emerald-800 dark:text-emerald-200 ml-3 leading-5">
                        Never share your OTP. Swasthify will never ask for it on call.
                    </Text>
                </View>

                {/* Numeric Keypad */}
                <View className="flex-row flex-wrap mt-10">
                    {keypad.map((key, i) => (
                        <TouchableOpacity key={i} className="w-1/3 h-14 items-center justify-center">
                            <Text className="text-2xl font-bold text-slate-900 dark:text-white">{key}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </AuthWrapper>
    );
};

export default OtpScreen;
