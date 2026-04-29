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
import { Mail, Lock, Eye, EyeOff, Smartphone } from 'lucide-react-native';

import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

type SignInScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'SignIn'>;
};

const SignInScreen = ({ navigation }: SignInScreenProps) => {
    const { login } = useAuth();
    
    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
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
            title="Welcome back"
            description="Sign in to continue your healthcare journey."
        >
            <View className="w-full">
                {/* Email Field */}
                <View className="mb-5">
                    <Text className="text-sm font-bold text-slate-900 dark:text-white mb-2">Email or phone</Text>
                    <View className="flex-row items-center h-14 bg-white dark:bg-slate-900 border-[1.5px] border-slate-100 dark:border-slate-800 rounded-2xl px-4">
                        <View className="mr-3">
                            <Mail size={20} color="#94A3B8" />
                        </View>
                        <TextInput
                            placeholder="ayan@gmail.com"
                            placeholderTextColor="#94A3B8"
                            value={email}
                            onChangeText={setEmail}
                            className="flex-1 text-base text-slate-900 dark:text-white"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!isLoading}
                        />
                    </View>
                </View>

                {/* Password Field */}
                <View className="mb-5">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-sm font-bold text-slate-900 dark:text-white">Password</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text className="text-[13px] font-bold text-primary">Forgot?</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center h-14 bg-white dark:bg-slate-900 border-[1.5px] border-slate-100 dark:border-slate-800 rounded-2xl px-4">
                        <View className="mr-3">
                            <Lock size={20} color="#94A3B8" />
                        </View>
                        <TextInput
                            placeholder="••••••••"
                            placeholderTextColor="#94A3B8"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            className="flex-1 text-base text-slate-900 dark:text-white pr-12"
                            editable={!isLoading}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            className="absolute right-4"
                            disabled={isLoading}
                        >
                            {showPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Sign In Button */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSignIn}
                    disabled={isLoading}
                    className="bg-primary h-14 rounded-[20px] items-center justify-center mt-2.5 shadow-lg shadow-primary/20"
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text className="text-white text-lg font-bold">Sign In</Text>
                    )}
                </TouchableOpacity>

                {/* OR Divider */}
                <View className="flex-row items-center my-6">
                    <View className="flex-1 h-[1.5px] bg-slate-100 dark:bg-slate-800" />
                    <Text className="mx-3 text-[12px] font-bold text-slate-400">OR</Text>
                    <View className="flex-1 h-[1.5px] bg-slate-100 dark:bg-slate-800" />
                </View>

                {/* Mobile OTP Button */}
                <TouchableOpacity
                    className="flex-row items-center justify-center h-14 rounded-[20px] border-[1.5px] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                    onPress={() => navigation.navigate('Otp', { phone: '' })}
                >
                    <Smartphone size={20} color="#0F172A" />
                    <Text className="ml-2.5 text-base font-bold text-slate-900 dark:text-white">Continue with Mobile OTP</Text>
                </TouchableOpacity>

                {/* Footer */}
                <View className="flex-row justify-center mt-8">
                    <Text className="text-sm text-slate-500">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text className="text-sm font-bold text-primary">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AuthWrapper>
    );
};

export default SignInScreen;
