import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import { AuthWrapper } from '../components/auth/AuthWrapper';
import Feather from 'react-native-vector-icons/Feather';

import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

type SignInScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'SignIn'>;
};

const SignInScreen = ({ navigation }: SignInScreenProps) => {
    const { login } = useAuth();
    
    // View State
    const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        if (loginMethod === 'mobile') {
            if (!otpSent) {
                if (!phone || phone.length < 10) {
                    return Alert.alert('Error', 'Please enter a valid mobile number');
                }
                setIsLoading(true);
                // Simulate Send OTP
                setTimeout(() => {
                    setOtpSent(true);
                    setIsLoading(false);
                }, 1000);
                return;
            } else {
                if (!otp || otp.length < 4) {
                    return Alert.alert('Error', 'Please enter a valid OTP');
                }
                setIsLoading(true);
                // Simulate Verify OTP
                setTimeout(() => {
                    setIsLoading(false);
                    Alert.alert('Notice', 'OTP Verification API not yet hooked up.');
                }, 1000);
                return;
            }
        }

        if (!email || !password) {
            return Alert.alert('Error', 'Please enter both email and password');
        }

        setIsLoading(true);
        try {
            const response = await authService.login({
                email,
                password,
                role: 'PATIENT',
            });

            if (response.token && response.user) {
                await login(response.token, response.user);
                navigation.navigate('Home');
            } else {
                Alert.alert('Error', 'Invalid response from server');
            }
        } catch (error: any) {
            Alert.alert('Login Failed', error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthWrapper
            title={loginMethod === 'email' ? "Welcome Back" : "Mobile Login"}
            description={loginMethod === 'email' ? "Sign in to continue your healthcare journey" : "Enter your mobile number to receive an OTP"}
            showSocial={false}
            backButtonLabel="Don't have an account? Sign Up"
            onBackPress={() => navigation.navigate('SignUp')}
        >
            <View className="gap-y-5">
                {loginMethod === 'email' ? (
                    <>
                        {/* Email Field */}
                        <View>
                            <Text className="text-sm font-bold text-gray-700 mb-2">Email</Text>
                            <TextInput
                                placeholder="name@example.com"
                                placeholderTextColor="#9CA3AF"
                                value={email}
                                onChangeText={setEmail}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!isLoading}
                            />
                        </View>

                        {/* Password Field */}
                        <View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-sm font-bold text-gray-700">Password</Text>
                                <TouchableOpacity disabled={isLoading}>
                                    <Text className="text-sm font-medium text-[#0DA96E]">Forgot?</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="relative">
                                <TextInput
                                    placeholder="••••••••"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 pr-12"
                                    editable={!isLoading}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5"
                                    disabled={isLoading}
                                >
                                    <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleSignIn}
                            disabled={isLoading}
                            className="bg-[#0DA96E] py-4 rounded-xl items-center justify-center flex-row shadow-lg shadow-[#0DA96E]/20 mt-4 active:scale-[0.98]"
                        >
                            {isLoading && <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />}
                            <Text className="text-white font-bold text-lg">Sign In</Text>
                        </TouchableOpacity>

                        {/* Toggle to OTP Logging */}
                        <View className="items-center mt-2">
                            <TouchableOpacity onPress={() => setLoginMethod('mobile')} className="flex-row items-center">
                                <Feather name="smartphone" size={16} color="#4B5563" />
                                <Text className="font-bold text-gray-600 text-sm ml-2">Login via Mobile OTP</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        {/* Mobile OTP Flow */}
                        {!otpSent ? (
                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Mobile Number</Text>
                                <View className="flex-row items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                    <View className="px-4 py-3 border-r border-gray-200">
                                        <Text className="text-gray-900 font-bold">+91</Text>
                                    </View>
                                    <TextInput
                                        placeholder="Enter 10-digit number"
                                        placeholderTextColor="#9CA3AF"
                                        value={phone}
                                        onChangeText={setPhone}
                                        className="flex-1 px-4 py-3 text-gray-900"
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                        editable={!isLoading}
                                    />
                                </View>
                            </View>
                        ) : (
                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Enter OTP</Text>
                                <TextInput
                                    placeholder="Enter 4 or 6 digit code"
                                    placeholderTextColor="#9CA3AF"
                                    value={otp}
                                    onChangeText={setOtp}
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-center tracking-widest text-lg"
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    editable={!isLoading}
                                />
                                <TouchableOpacity 
                                    onPress={() => setOtpSent(false)} 
                                    className="mt-3 self-end"
                                    disabled={isLoading}
                                >
                                    <Text className="text-[#0DA96E] font-medium text-sm">Change Number?</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleSignIn}
                            disabled={isLoading}
                            className="bg-[#0DA96E] py-4 rounded-xl items-center justify-center flex-row shadow-lg shadow-[#0DA96E]/20 mt-2 active:scale-[0.98]"
                        >
                            {isLoading && <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />}
                            <Text className="text-white font-bold text-lg">
                                {otpSent ? 'Verify OTP' : 'Send OTP'}
                            </Text>
                        </TouchableOpacity>

                        <View className="items-center mt-4">
                            <TouchableOpacity onPress={() => { setLoginMethod('email'); setOtpSent(false); }} className="flex-row items-center">
                                <Feather name="mail" size={16} color="#4B5563" />
                                <Text className="font-bold text-gray-600 text-sm ml-2">Back to Email Login</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </AuthWrapper>
    );
};

export default SignInScreen;
