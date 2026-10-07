import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    useColorScheme,
} from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import { AuthWrapper } from '../components/auth/AuthWrapper';
import { ArrowRight, LockKeyhole, Phone, ShieldCheck } from 'lucide-react-native';

import { AuthNotice, AuthPrimaryButton } from '../components/auth/AuthFormControls';
import auth from '@react-native-firebase/auth';

type OTPLoginScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'OTPLogin'>;
};

const OTPLoginScreen = ({ navigation }: OTPLoginScreenProps) => {
    const isDarkMode = useColorScheme() === 'dark';
    const [phone, setPhone] = useState('');
    const [hasTouchedPhone, setHasTouchedPhone] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const cleanPhone = phone.replace(/\D/g, '').slice(0, 10);
    const phoneError = cleanPhone.length === 0
        ? 'Enter your mobile number.'
        : cleanPhone.length !== 10
            ? 'Mobile number must be 10 digits.'
            : '';
    const isPhoneValid = cleanPhone.length === 10;

    const handleSendOTP = async () => {
        setHasTouchedPhone(true);

        if (!isPhoneValid) {
            return;
        }

        setIsLoading(true);
        try {
            const phoneNumber = `+91${cleanPhone}`;
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            navigation.navigate('Otp', { 
                phone: `+91 ${cleanPhone}`,
                confirmation: confirmation 
            });
        } catch (error: any) {
            Alert.alert('Error', error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthWrapper
            title="Secure OTP login"
            description="Enter your mobile number and we will send a 6-digit verification code."
        >
            <View className="w-full gap-y-6">
                <View>
                    <Text className="text-sm font-bold text-slate-900 dark:text-white mb-2">Mobile Number</Text>
                    <View className={`flex-row items-center h-14 bg-white dark:bg-slate-900 border-[1.5px] rounded-2xl px-4 ${hasTouchedPhone && phoneError ? 'border-rose-400' : isPhoneValid ? 'border-primary' : 'border-slate-200 dark:border-slate-800'}`}>
                        <View className="mr-3 flex-row items-center">
                            <Phone size={20} color={hasTouchedPhone && phoneError ? '#FB7185' : isPhoneValid ? '#10B981' : isDarkMode ? '#CBD5E1' : '#94A3B8'} />
                            <Text className="text-base text-slate-900 dark:text-white ml-2 mr-1">+91</Text>
                            <View className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-2" />
                        </View>
                        <TextInput
                            placeholder="98765 43210"
                            placeholderTextColor={isDarkMode ? '#475569' : '#94A3B8'}
                            value={cleanPhone}
                            onChangeText={(value) => setPhone(value.replace(/\D/g, '').slice(0, 10))}
                            onBlur={() => setHasTouchedPhone(true)}
                            className="flex-1 text-base text-slate-900 dark:text-white"
                            keyboardType="phone-pad"
                            maxLength={10}
                            editable={!isLoading}
                        />
                    </View>
                    {hasTouchedPhone && phoneError ? (
                        <Text className="text-[12px] text-rose-500 mt-1.5">{phoneError}</Text>
                    ) : (
                        <Text className="text-[12px] text-slate-500 dark:text-slate-400 mt-1.5">No password needed. Use the mobile number linked to your account.</Text>
                    )}
                </View>

                <AuthPrimaryButton
                    label="Send OTP"
                    loadingLabel="Sending"
                    onPress={handleSendOTP}
                    isLoading={isLoading}
                    disabled={!isPhoneValid}
                    icon={<ArrowRight size={20} color="white" />}
                />

                <AuthNotice
                    icon={ShieldCheck}
                    text="Your health data stays protected. We use OTP verification to keep access secure."
                />

                <TouchableOpacity 
                    onPress={() => navigation.navigate('SignIn')}
                    className="items-center"
                    disabled={isLoading}
                >
                    <View className="flex-row items-center">
                        <LockKeyhole size={16} color="#10B981" />
                        <Text className="text-sm font-bold text-primary ml-2">Login with Email instead</Text>
                    </View>
                </TouchableOpacity>

                <View className="flex-row justify-center pt-2">
                    <Text className="text-sm text-slate-600 dark:text-slate-200">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text className="text-sm font-bold text-primary">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AuthWrapper>
    );
};

export default OTPLoginScreen;
