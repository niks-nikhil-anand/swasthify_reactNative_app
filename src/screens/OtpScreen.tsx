import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ShieldCheck, Clock, RotateCcw } from 'lucide-react-native';
import { RootDrawerParamList } from '../navigation/types';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { AuthWrapper } from '../components/auth/AuthWrapper';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

type OtpScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'Otp'>;
    route: any;
};

const RESEND_TIMEOUT = 30; // seconds

const OtpScreen = ({ navigation, route }: OtpScreenProps) => {
    const { login } = useAuth();
    
    // Get the phone passed from OTPLoginScreen e.g. "+91 9876543210"
    const { phone } = route.params || {};
    
    // Strip "+91 " prefix and spaces → clean 10-digit number for the API
    const cleanMobile = (phone || '').replace(/^\+91\s*/, '').replace(/\s/g, '');

    // OTP state — 6 empty slots
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(RESEND_TIMEOUT);
    const [canResend, setCanResend] = useState(false);

    // Derived values
    const activeIndex = otp.findIndex(d => d === '');  // first empty slot
    const isComplete = otp.every(d => d !== '');        // all 6 filled

    const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

    // ── Countdown Timer ──────────────────────────────────────────────────────
    useEffect(() => {
        if (resendTimer <= 0) {
            setCanResend(true);
            return;
        }
        const timer = setTimeout(() => setResendTimer(t => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendTimer]);

    const formatTimer = (sec: number) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // ── Keypad Press ─────────────────────────────────────────────────────────
    const handleKeyPress = useCallback((key: string) => {
        if (isLoading) return;

        if (key === '⌫') {
            const newOtp = [...otp];
            // Delete the last filled digit
            const lastFilled = newOtp.map((d, i) => (d !== '' ? i : -1)).filter(i => i !== -1).pop();
            if (lastFilled !== undefined) {
                newOtp[lastFilled] = '';
                setOtp(newOtp);
            }
            return;
        }

        if (key === '') return;

        if (activeIndex !== -1) {
            const newOtp = [...otp];
            newOtp[activeIndex] = key;
            setOtp(newOtp);

            // Auto-verify when the last digit is entered
            if (activeIndex === 5) {
                setTimeout(() => handleVerify(newOtp.join('')), 150);
            }
        }
    }, [otp, activeIndex, isLoading]);

    // ── Verify OTP ───────────────────────────────────────────────────────────
    const handleVerify = async (otpCode?: string) => {
        const finalOtp = otpCode ?? otp.join('');

        if (finalOtp.length < 6) {
            return Alert.alert('Incomplete OTP', 'Please enter all 6 digits.');
        }

        setIsLoading(true);
        try {
            const response = await authService.verifyOtp({
                mobile: cleanMobile,
                otp: finalOtp,
                role: 'PATIENT',
            });

            if (response.token && response.user) {
                await login(response.token, response.user);
                navigation.navigate('Home');
            } else {
                Alert.alert('Error', 'Invalid response from server. Please try again.');
                setOtp(['', '', '', '', '', '']);
            }
        } catch (error: any) {
            Alert.alert('Verification Failed', error.toString());
            setOtp(['', '', '', '', '', '']);
        } finally {
            setIsLoading(false);
        }
    };

    // ── Resend OTP ────────────────────────────────────────────────────────────
    const handleResend = async () => {
        if (!canResend) return;
        try {
            await authService.sendOtp({ mobile: cleanMobile, role: 'PATIENT' });
            setOtp(['', '', '', '', '', '']);
            setResendTimer(RESEND_TIMEOUT);
            setCanResend(false);
        } catch (error: any) {
            Alert.alert('Error', error.toString());
        }
    };

    return (
        <AuthWrapper
            title="Verify your number"
            description={`We sent a 6-digit code to +91 ${cleanMobile}.`}
        >
            <View className="w-full">

                {/* OTP Boxes */}
                <View className="flex-row justify-between mt-2">
                    {otp.map((digit, i) => {
                        const isActive = i === activeIndex;
                        const isFilled = digit !== '';
                        return (
                            <View
                                key={i}
                                className={`w-[44px] h-16 rounded-2xl border-[1.5px] items-center justify-center bg-white dark:bg-slate-900 ${isFilled || isActive ? 'border-primary' : 'border-slate-100 dark:border-slate-800'}`}
                                style={isActive ? { shadowColor: '#0EA968', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 } : {}}
                            >
                                <Text className="text-2xl font-extrabold text-slate-900 dark:text-white">{digit}</Text>
                                {/* Blinking cursor on active empty box */}
                                {isActive && !isFilled && (
                                    <View className="w-[2px] h-7 bg-primary absolute" />
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Resend Timer */}
                <View className="flex-row items-center justify-between mt-6">
                    <View className="flex-row items-center">
                        <Clock size={15} color="#64748B" />
                        {canResend ? (
                            <Text className="text-sm text-slate-500 ml-2">OTP expired</Text>
                        ) : (
                            <Text className="text-sm text-slate-500 ml-2">
                                Resend code in <Text className="text-slate-900 dark:text-white font-bold">{formatTimer(resendTimer)}</Text>
                            </Text>
                        )}
                    </View>
                    {canResend && (
                        <TouchableOpacity onPress={handleResend} className="flex-row items-center">
                            <RotateCcw size={14} color="#0EA968" />
                            <Text className="text-sm font-bold text-primary ml-1">Resend</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                    onPress={() => handleVerify()}
                    disabled={isLoading || !isComplete}
                    className={`h-14 rounded-[20px] items-center justify-center mt-8 shadow-lg ${isComplete ? 'bg-primary shadow-primary/20' : 'bg-slate-200 dark:bg-slate-800'}`}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text className={`text-lg font-bold ${isComplete ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                            Verify &amp; continue
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Security Notice */}
                <View className="flex-row bg-[#E6F6EF] dark:bg-emerald-950/20 p-4 rounded-2xl mt-6 items-start">
                    <ShieldCheck size={20} color="#0EA968" />
                    <Text className="flex-1 text-[13px] text-emerald-800 dark:text-emerald-200 ml-3 leading-5">
                        Never share your OTP. Swasthify will never ask for it on call.
                    </Text>
                </View>

                {/* Numeric Keypad */}
                <View className="flex-row flex-wrap mt-8">
                    {keypad.map((key, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => handleKeyPress(key)}
                            disabled={isLoading || key === ''}
                            activeOpacity={key === '' ? 1 : 0.4}
                            className="w-1/3 h-14 items-center justify-center"
                        >
                            <Text className={`text-2xl font-bold ${key === '' ? '' : 'text-slate-900 dark:text-white'}`}>
                                {key}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </View>
        </AuthWrapper>
    );
};

export default OtpScreen;
