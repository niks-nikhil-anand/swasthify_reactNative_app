import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    useColorScheme,
} from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import { AuthWrapper } from '../components/auth/AuthWrapper';
import { Phone, ArrowRight } from 'lucide-react-native';

import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

type OTPLoginScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'OTPLogin'>;
};

const OTPLoginScreen = ({ navigation }: OTPLoginScreenProps) => {
    const isDarkMode = useColorScheme() === 'dark';
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!phone) {
            return Alert.alert('Error', 'Please enter your mobile number');
        }
        
        if (phone.length < 10) {
            return Alert.alert('Error', 'Please enter a valid mobile number');
        }

        setIsLoading(true);
        try {
            await authService.sendOtp({ mobile: phone, role: 'PATIENT' });
            navigation.navigate('Otp', { phone: `+91 ${phone}` });
        } catch (error: any) {
            Alert.alert('Error', error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthWrapper
            title="Login with OTP"
            description="Enter your mobile number to receive a verification code."
        >
            <View className="w-full">
                {/* Phone Number Field */}
                <View className="mb-8">
                    <Text className="text-sm font-bold text-slate-900 dark:text-white mb-2">Mobile Number</Text>
                    <View className="flex-row items-center h-14 bg-white dark:bg-slate-900 border-[1.5px] border-slate-100 dark:border-slate-800 rounded-2xl px-4">
                        <View className="mr-3 flex-row items-center">
                            <Phone size={20} color={isDarkMode ? '#CBD5E1' : '#94A3B8'} />
                            <Text className="text-base text-slate-900 dark:text-white ml-2 mr-1">+91</Text>
                            <View className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-2" />
                        </View>
                        <TextInput
                            placeholder="98765 43210"
                            placeholderTextColor={isDarkMode ? '#475569' : '#94A3B8'}
                            value={phone}
                            onChangeText={setPhone}
                            className="flex-1 text-base text-slate-900 dark:text-white"
                            keyboardType="phone-pad"
                            maxLength={10}
                            editable={!isLoading}
                        />
                    </View>
                </View>

                {/* Send OTP Button */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSendOTP}
                    disabled={isLoading}
                    className="bg-primary h-14 rounded-[20px] items-center justify-center shadow-lg shadow-primary/20"
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <View className="flex-row items-center">
                            <Text className="text-white text-lg font-bold mr-2">Send OTP</Text>
                            <ArrowRight size={20} color="white" />
                        </View>
                    )}
                </TouchableOpacity>

                {/* Back to Email Login */}
                <TouchableOpacity 
                    onPress={() => navigation.navigate('SignIn')}
                    className="mt-6 items-center"
                >
                    <Text className="text-sm font-bold text-primary">Login with Email instead</Text>
                </TouchableOpacity>

                {/* Footer */}
                <View className="flex-row justify-center mt-12">
                    <Text className="text-sm text-slate-500 dark:text-slate-400">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text className="text-sm font-bold text-primary">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AuthWrapper>
    );
};

export default OTPLoginScreen;
