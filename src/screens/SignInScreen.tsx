import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import { AuthWrapper } from '../components/auth/AuthWrapper';
import Feather from 'react-native-vector-icons/Feather';

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
        if (!email) return Alert.alert('Error', 'Please enter your email');
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsEmailOtpSent(true);
            setTimeLeft(60);
        }, 1000);
    };

    const handleSendMobileOtp = () => {
        if (mobile.length < 10) return Alert.alert('Error', 'Please enter a valid mobile number');
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
        <AuthWrapper
            title="Welcome Back"
            description="Enter your details to access your account"
            showSocial={true}
            backButtonLabel="Don't have an account? Create one"
            onBackPress={() => navigation.navigate('SignUp')}
            onOtpClick={() => {
                setLoginMethod('mobile');
                setIsOtpSent(false);
            }}
            onEmailLinkClick={() => {
                setLoginMethod('email');
                setEmailMode('otp');
                setIsEmailOtpSent(false);
            }}
        >
            {/* Login Method Toggle */}
            <View className="bg-gray-100 p-1 rounded-2xl flex-row mb-6">
                <TouchableOpacity
                    onPress={() => setLoginMethod('email')}
                    className={`flex-1 py-3 rounded-xl items-center justify-center ${loginMethod === 'email' ? 'bg-white shadow-sm' : ''}`}
                >
                    <Text className={`text-sm font-bold ${loginMethod === 'email' ? 'text-gray-900' : 'text-gray-500'}`}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setLoginMethod('mobile')}
                    className={`flex-1 py-3 rounded-xl items-center justify-center ${loginMethod === 'mobile' ? 'bg-white shadow-sm' : ''}`}
                >
                    <Text className={`text-sm font-bold ${loginMethod === 'mobile' ? 'text-gray-900' : 'text-gray-500'}`}>Mobile</Text>
                </TouchableOpacity>
            </View>

            {/* Form Section */}
            <View className="space-y-4">
                {loginMethod === 'email' ? (
                    <>
                        <View className="flex-row justify-end -mb-2">
                            <TouchableOpacity
                                onPress={() => {
                                    setEmailMode(emailMode === 'password' ? 'otp' : 'password');
                                    setIsEmailOtpSent(false);
                                }}
                            >
                                <Text className="text-xs text-[#0DA96E] font-bold">
                                    {emailMode === 'password' ? 'Login via OTP' : 'Login via Password'}
                                </Text>
                            </TouchableOpacity>
                        </View>

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
                                />
                                {emailMode === 'otp' && !isEmailOtpSent && (
                                    <TouchableOpacity
                                        onPress={handleSendEmailOtp}
                                        className="bg-gray-100 px-4 justify-center rounded-xl border border-gray-200"
                                    >
                                        <Text className="text-gray-700 font-bold text-xs">Get OTP</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

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
                                        {showPassword ? <Feather name="eye-off" size={20} color="#9CA3AF" /> : <Feather name="eye" size={20} color="#9CA3AF" />}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            isEmailOtpSent && (
                                <View>
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Enter OTP</Text>
                                    <TextInput
                                        placeholder="123456"
                                        value={emailOtp}
                                        onChangeText={setEmailOtp}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                                    />
                                    <View className="mt-2 flex-row justify-between items-center">
                                        <TouchableOpacity onPress={() => setIsEmailOtpSent(false)}>
                                            <Text className="text-xs text-gray-500">Change email</Text>
                                        </TouchableOpacity>
                                        {timeLeft > 0 ? (
                                            <Text className="text-xs text-gray-400">Resend in {timeLeft}s</Text>
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
                                        onChangeText={setMobile}
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                        className="flex-1 px-4 py-3 text-gray-900"
                                    />
                                </View>
                                {!isOtpSent && (
                                    <TouchableOpacity
                                        onPress={handleSendMobileOtp}
                                        className="bg-gray-100 px-4 justify-center rounded-xl border border-gray-200"
                                    >
                                        <Text className="text-gray-700 font-bold text-xs">Get OTP</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {isOtpSent && (
                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Enter OTP</Text>
                                <TextInput
                                    placeholder="123456"
                                    value={otp}
                                    onChangeText={setOtp}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                                />
                                <View className="mt-2 flex-row justify-between items-center">
                                    <TouchableOpacity onPress={() => setIsOtpSent(false)}>
                                        <Text className="text-xs text-gray-500">Change number</Text>
                                    </TouchableOpacity>
                                    {timeLeft > 0 ? (
                                        <Text className="text-xs text-gray-400">Resend in {timeLeft}s</Text>
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

                <TouchableOpacity
                    onPress={handleSignIn}
                    disabled={isLoading}
                    className="bg-[#0DA96E] py-4 rounded-xl items-center justify-center flex-row shadow-lg shadow-[#0DA96E]/20 mt-4 active:scale-[0.98]"
                >
                    {isLoading && <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />}
                    <Text className="text-white font-bold text-lg">
                        {loginMethod === 'email'
                            ? (emailMode === 'otp' ? 'Verify & Sign In' : 'Sign In')
                            : 'Verify & Sign In'}
                    </Text>
                </TouchableOpacity>
            </View>
        </AuthWrapper>
    );
};

export default SignInScreen;
