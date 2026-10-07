import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, useColorScheme, useWindowDimensions } from 'react-native';
import { ShieldCheck, Clock, RotateCcw, Delete } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';
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
    const isDarkMode = useColorScheme() === 'dark';
    const { width } = useWindowDimensions();
    const { login } = useAuth();
    
    // Get the phone and confirmation object passed from OTPLoginScreen
    const { phone, confirmation: initialConfirmation } = route.params || {};
    const [confirmation, setConfirmation] = useState(initialConfirmation);
    
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
    const slotSize = Math.min(72, Math.max(48, (width - 96) / 6));

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
            if (!confirmation) {
                throw new Error('No confirmation object found. Please try sending OTP again.');
            }

            // Verify with Firebase
            const userCredential = await confirmation.confirm(finalOtp);
            
            if (userCredential.user) {
                // If successful, we get the ID token
                const token = await userCredential.user.getIdToken();
                
                // Sync with backend to get the local session/user info
                try {
                    const response = await authService.verifyOtp({
                        mobile: cleanMobile,
                        otp: finalOtp,
                        role: 'PATIENT',
                        firebaseToken: token
                    });

                    if (response.token && response.user) {
                        await login(response.token, response.user);
                    } else {
                        // Fallback if backend doesn't return user yet
                        await login(token, {
                            id: userCredential.user.uid,
                            email: userCredential.user.email || '',
                            name: userCredential.user.displayName || 'User',
                            mobile: cleanMobile,
                            role: 'PATIENT',
                        });
                    }
                } catch (apiError) {
                    // Even if API fails, we proceed with Firebase session for now
                    await login(token, {
                        id: userCredential.user.uid,
                        email: userCredential.user.email || '',
                        name: userCredential.user.displayName || 'User',
                        mobile: cleanMobile,
                        role: 'PATIENT',
                    });
                }
                
                navigation.navigate('Home');
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
        setIsLoading(true);
        try {
            const phoneNumber = `+91${cleanMobile}`;
            const newConfirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setConfirmation(newConfirmation);
            setOtp(['', '', '', '', '', '']);
            setResendTimer(RESEND_TIMEOUT);
            setCanResend(false);
        } catch (error: any) {
            Alert.alert('Error', error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthWrapper
            title="Verify your number"
            description={`We sent a 6-digit code to +91 ${cleanMobile}.`}
        >
            <View className="w-full">

                {/* OTP Boxes */}
                <View className="flex-row justify-between mt-3">
                    {otp.map((digit, i) => {
                        const isActive = i === activeIndex;
                        const isFilled = digit !== '';
                        return (
                            <View
                                key={i}
                                className={`rounded-[18px] border-[1.5px] items-center justify-center bg-white dark:bg-slate-900 ${isFilled || isActive ? 'border-primary' : 'border-slate-100 dark:border-slate-800'}`}
                                style={[
                                    { width: slotSize, height: 64 },
                                    isActive
                                        ? { shadowColor: '#0DA96E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 10, elevation: 4 }
                                        : { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
                                ]}
                            >
                                <Text className="text-2xl font-extrabold text-slate-900 dark:text-white">{digit}</Text>
                                {/* Blinking cursor on active empty box */}
                                {isActive && !isFilled && (
                                    <View className="w-[2.5px] h-8 bg-primary rounded-full absolute" />
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Resend Timer */}
                <View className="flex-row items-center justify-between mt-7">
                    <View className="flex-row items-center">
                        <Clock size={18} color={isDarkMode ? '#94A3B8' : '#64748B'} strokeWidth={2.2} />
                        {canResend ? (
                            <Text className="text-base font-semibold text-slate-500 dark:text-slate-400 ml-2.5">OTP expired</Text>
                        ) : (
                            <Text className="text-base font-semibold text-slate-500 dark:text-slate-400 ml-2.5">
                                Resend code in <Text className="text-slate-900 dark:text-white font-bold">{formatTimer(resendTimer)}</Text>
                            </Text>
                        )}
                    </View>
                    {canResend && (
                        <TouchableOpacity onPress={handleResend} className="flex-row items-center px-2 py-1 rounded-full active:bg-emerald-50 dark:active:bg-emerald-950/40">
                            <RotateCcw size={16} color="#0DA96E" strokeWidth={2.4} />
                            <Text className="text-base font-bold text-primary ml-1.5">Resend</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                    onPress={() => handleVerify()}
                    disabled={isLoading || !isComplete}
                    activeOpacity={0.86}
                    className={`h-16 rounded-[24px] items-center justify-center mt-8 shadow-lg ${isComplete ? 'bg-primary shadow-primary/25' : 'bg-[#E8EEF6] dark:bg-slate-800 shadow-transparent'}`}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text className={`text-lg font-extrabold ${isComplete ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                            Verify &amp; continue
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Security Notice */}
                <View className="flex-row bg-[#E7F8F0] dark:bg-emerald-950/30 px-5 py-4 rounded-[18px] mt-6 items-start border border-emerald-100 dark:border-emerald-900/60">
                    <ShieldCheck size={24} color="#10B981" strokeWidth={2.3} />
                    <Text className="flex-1 text-[15px] font-extrabold text-emerald-800 dark:text-emerald-300 ml-3.5 leading-6">
                        Never share your OTP. Swasthify will never ask for it on call.
                    </Text>
                </View>

                {/* Numeric Keypad */}
                <View className="flex-row flex-wrap mt-12">
                    {keypad.map((key, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => handleKeyPress(key)}
                            disabled={isLoading || key === ''}
                            activeOpacity={key === '' ? 1 : 0.45}
                            className="w-1/3 h-[74px] items-center justify-center rounded-[22px] active:bg-slate-100 dark:active:bg-slate-800"
                        >
                            {key === '⌫' ? (
                                <Delete size={30} color={isDarkMode ? '#F8FAFC' : '#0F172A'} strokeWidth={2.4} />
                            ) : (
                                <Text className={`text-3xl font-extrabold ${key === '' ? '' : 'text-slate-900 dark:text-white'}`}>
                                    {key}
                                </Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

            </View>
        </AuthWrapper>
    );
};

export default OtpScreen;
