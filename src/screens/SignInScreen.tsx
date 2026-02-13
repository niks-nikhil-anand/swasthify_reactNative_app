import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import Footer from '../components/Footer';

type SignInScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'SignIn'>;
};

const SignInScreen = ({ navigation }: SignInScreenProps) => {
    // Auth States
    const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
    const [emailMode, setEmailMode] = useState<'password' | 'otp'>('password');
    const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false); // for mobile

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    // Timer Logic
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleSendEmailOtp = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsEmailOtpSent(true);
            setTimeLeft(60);
        }, 1000);
    };

    const handleSendMobileOtp = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsOtpSent(true);
            setTimeLeft(60);
        }, 1000);
    };

    const handleSignIn = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigation.navigate('Home');
        }, 1500);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="p-6 pt-12">
                        {/* Header */}
                        <View className="mb-8 items-center">
                            <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
                            <Text className="text-gray-500 text-center">
                                Enter your details to access your account
                            </Text>
                        </View>

                        {/* Login Method Toggle */}
                        <View className="bg-gray-100 p-1.5 rounded-2xl flex-row mb-8">
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    setLoginMethod('email');
                                    setIsOtpSent(false);
                                    setIsEmailOtpSent(false);
                                }}
                                className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${loginMethod === 'email' ? 'bg-white shadow-sm' : ''}`}
                            >
                                <Text className="text-sm mr-2">✉️</Text>
                                <Text className={`text-sm font-bold ${loginMethod === 'email' ? 'text-gray-900' : 'text-gray-500'}`}>Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    setLoginMethod('mobile');
                                    setIsOtpSent(false);
                                    setIsEmailOtpSent(false);
                                }}
                                className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${loginMethod === 'mobile' ? 'bg-white shadow-sm' : ''}`}
                            >
                                <Text className="text-sm mr-2">📱</Text>
                                <Text className={`text-sm font-bold ${loginMethod === 'mobile' ? 'text-gray-900' : 'text-gray-500'}`}>Mobile</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Form Section */}
                        <View className="gap-6">
                            {loginMethod === 'email' ? (
                                <>
                                    {/* Email Login Mode Swapper */}
                                    <View className="flex-row justify-end -mb-4">
                                        <TouchableOpacity
                                            activeOpacity={0.6}
                                            onPress={() => {
                                                setEmailMode(emailMode === 'password' ? 'otp' : 'password');
                                                setIsEmailOtpSent(false);
                                            }}
                                            className="px-2 py-1"
                                        >
                                            <Text className="text-xs text-[#0DA96E] font-bold">
                                                {emailMode === 'password' ? '🔑 Login via OTP' : '🔒 Login via Password'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Email Field */}
                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Email</Text>
                                        <View className="flex-row gap-2">
                                            <TextInput
                                                placeholder="name@example.com"
                                                value={email}
                                                onChangeText={setEmail}
                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                editable={!isLoading && !(emailMode === 'otp' && isEmailOtpSent)}
                                            />
                                            {emailMode === 'otp' && !isEmailOtpSent && (
                                                <TouchableOpacity
                                                    onPress={handleSendEmailOtp}
                                                    disabled={isLoading || !email}
                                                    className="bg-gray-100 px-4 justify-center rounded-xl border border-gray-200"
                                                >
                                                    <Text className="text-gray-700 font-bold text-xs">Get OTP</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>

                                    {/* Password or OTP Input */}
                                    {emailMode === 'password' ? (
                                        <View>
                                            <View className="flex-row justify-between mb-2">
                                                <Text className="text-sm font-bold text-gray-700">Password</Text>
                                                <TouchableOpacity>
                                                    <Text className="text-xs text-[#0DA96E]">Forgot?</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View className="relative">
                                                <TextInput
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChangeText={setPassword}
                                                    secureTextEntry={!showPassword}
                                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 pr-12"
                                                />
                                                <TouchableOpacity
                                                    onPress={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-3.5"
                                                >
                                                    <Text>{showPassword ? '👁️' : '🙈'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ) : (
                                        isEmailOtpSent && (
                                            <View>
                                                <View className="flex-row justify-between mb-2">
                                                    <Text className="text-sm font-bold text-gray-700">Enter OTP</Text>
                                                    <TouchableOpacity onPress={() => setIsEmailOtpSent(false)}>
                                                        <Text className="text-xs text-[#0DA96E]">Change email</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <TextInput
                                                    placeholder="123456"
                                                    value={emailOtp}
                                                    onChangeText={(val) => setEmailOtp(val.replace(/\D/g, '').slice(0, 6))}
                                                    keyboardType="number-pad"
                                                    maxLength={6}
                                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                                                />
                                                <View className="mt-2 items-end">
                                                    {timeLeft > 0 ? (
                                                        <Text className="text-xs text-gray-400">Resend OTP in {timeLeft}s</Text>
                                                    ) : (
                                                        <TouchableOpacity onPress={handleSendEmailOtp}>
                                                            <Text className="text-xs text-[#0DA96E] font-bold">Resend OTP</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                        )
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* Mobile Field */}
                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Mobile Number</Text>
                                        <View className="flex-row gap-2">
                                            <View className="flex-1 flex-row bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                                                <View className="bg-gray-100 px-3 justify-center border-r border-gray-200">
                                                    <Text className="text-sm text-gray-500 font-bold">+91</Text>
                                                </View>
                                                <TextInput
                                                    placeholder="9876543210"
                                                    value={mobile}
                                                    onChangeText={(val) => setMobile(val.replace(/\D/g, '').slice(0, 10))}
                                                    keyboardType="phone-pad"
                                                    maxLength={10}
                                                    className="flex-1 px-4 py-3 text-gray-900"
                                                    editable={!isLoading && !isOtpSent}
                                                />
                                            </View>
                                            {!isOtpSent && (
                                                <TouchableOpacity
                                                    onPress={handleSendMobileOtp}
                                                    disabled={isLoading || mobile.length < 10}
                                                    className="bg-gray-100 px-4 justify-center rounded-xl border border-gray-200"
                                                >
                                                    <Text className="text-gray-700 font-bold text-xs">Get OTP</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>

                                    {/* Mobile OTP Input */}
                                    {isOtpSent && (
                                        <View>
                                            <View className="flex-row justify-between mb-2">
                                                <Text className="text-sm font-bold text-gray-700">Enter OTP</Text>
                                                <TouchableOpacity onPress={() => setIsOtpSent(false)}>
                                                    <Text className="text-xs text-[#0DA96E]">Change number</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TextInput
                                                placeholder="123456"
                                                value={otp}
                                                onChangeText={(val) => setOtp(val.replace(/\D/g, '').slice(0, 6))}
                                                keyboardType="number-pad"
                                                maxLength={6}
                                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                                            />
                                            <View className="mt-2 items-end">
                                                {timeLeft > 0 ? (
                                                    <Text className="text-xs text-gray-400">Resend OTP in {timeLeft}s</Text>
                                                ) : (
                                                    <TouchableOpacity onPress={handleSendMobileOtp}>
                                                        <Text className="text-xs text-[#0DA96E] font-bold">Resend OTP</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    )}
                                </>
                            )}

                            {/* Sign In Button */}
                            <TouchableOpacity
                                onPress={handleSignIn}
                                disabled={isLoading}
                                className="bg-[#0DA96E] py-4 rounded-xl shadow-sm items-center justify-center flex-row"
                                style={{ elevation: 2 }}
                            >
                                {isLoading && <ActivityIndicator color="white" size="small" className="mr-2" />}
                                <Text className="text-white font-bold text-lg">
                                    {loginMethod === 'email'
                                        ? (emailMode === 'otp' ? 'Verify & Sign In' : 'Sign In')
                                        : 'Verify & Sign In'}
                                </Text>
                            </TouchableOpacity>

                            {/* Sign Up Link */}
                            <View className="flex-row justify-center mt-4">
                                <Text className="text-gray-500">Don't have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                    <Text className="text-[#0DA96E] font-bold">Create Account</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View className="mt-auto">
                        <Footer />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignInScreen;
