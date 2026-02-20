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

import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const SignInScreen = ({ navigation }: SignInScreenProps) => {
    const { login } = useAuth();
    // Auth States
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
                role: 'PATIENT', // Defaulting to PATIENT
            });

            if (response.token && response.user) {
                await login(response.token, response.user);
                // Navigation to Home will be handled by auth state change ideally, 
                // but for now we navigate manually or wait for re-render
                // If AppNavigator handles auth state, it might redirect automatically.
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
            title="Welcome Back"
            description="Enter your details to access your account"
            showSocial={false}
            backButtonLabel="Don't have an account? Create one"
            onBackPress={() => navigation.navigate('SignUp')}
        >
            {/* Form Section */}
            <View className="gap-y-4">
                <View>
                    <Text className="text-sm font-bold text-gray-700 mb-2">Email</Text>
                    <TextInput
                        placeholder="name@example.com"
                        value={email}
                        onChangeText={setEmail}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isLoading}
                    />
                </View>

                <View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-sm font-bold text-gray-700">Password</Text>
                        <TouchableOpacity disabled={isLoading}>
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

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSignIn}
                    disabled={isLoading}
                    className="bg-[#0DA96E] py-4 rounded-xl items-center justify-center flex-row shadow-lg shadow-[#0DA96E]/20 mt-2 active:scale-[0.98]"
                >
                    {isLoading && <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />}
                    <Text className="text-white font-bold text-lg">Sign In</Text>
                </TouchableOpacity>
            </View>
        </AuthWrapper>
    );
};

export default SignInScreen;
