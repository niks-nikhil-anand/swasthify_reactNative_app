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
import { User, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react-native';

import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

type SignUpScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'SignUp'>;
};

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
    const { login } = useAuth();
    
    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async () => {
        if (!name || !email || !password || !phone) {
            return Alert.alert('Error', 'Please fill in all fields');
        }

        if (!agreed) {
            return Alert.alert('Error', 'Please agree to the Terms and Privacy Policy');
        }

        setIsLoading(true);
        try {
            const response = await authService.register({
                name,
                email,
                password,
                role: 'PATIENT',
            });

            Alert.alert('Success', 'Account created! Please Sign In.', [
                { text: 'OK', onPress: () => navigation.navigate('SignIn') }
            ]);
        } catch (error: any) {
            Alert.alert('Registration Failed', error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthWrapper
            title="Create account"
            description="Join Swasthify for the best healthcare experience."
        >
            <View className="w-full">
                {/* Full Name */}
                <View className="mb-4">
                    <Text className="text-sm font-bold text-slate-900 dark:text-white mb-2">Full name</Text>
                    <View className="flex-row items-center h-14 bg-white dark:bg-slate-900 border-[1.5px] border-slate-100 dark:border-slate-800 rounded-2xl px-4">
                        <View className="mr-3">
                            <User size={20} color="#94A3B8" />
                        </View>
                        <TextInput
                            placeholder="Ayan Singh"
                            placeholderTextColor="#94A3B8"
                            value={name}
                            onChangeText={setName}
                            className="flex-1 text-base text-slate-900 dark:text-white"
                            editable={!isLoading}
                        />
                    </View>
                </View>

                {/* Email */}
                <View className="mb-4">
                    <Text className="text-sm font-bold text-slate-900 dark:text-white mb-2">Email</Text>
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

                {/* Mobile */}
                <View className="mb-4">
                    <Text className="text-sm font-bold text-slate-900 dark:text-white mb-2">Mobile number</Text>
                    <View className="flex-row">
                        <View className="flex-row items-center justify-center h-14 w-[84px] bg-white dark:bg-slate-900 border-[1.5px] border-slate-100 dark:border-slate-800 rounded-2xl mr-2">
                            <Text className="text-base font-bold text-slate-900 dark:text-white">🇮🇳 +91</Text>
                        </View>
                        <View className="flex-1 flex-row items-center h-14 bg-white dark:bg-slate-900 border-[1.5px] border-slate-100 dark:border-slate-800 rounded-2xl px-4">
                            <TextInput
                                placeholder="98765 43210"
                                placeholderTextColor="#94A3B8"
                                value={phone}
                                onChangeText={setPhone}
                                className="flex-1 text-base text-slate-900 dark:text-white"
                                keyboardType="phone-pad"
                                editable={!isLoading}
                            />
                        </View>
                    </View>
                </View>

                {/* Password */}
                <View className="mb-4">
                    <Text className="text-sm font-bold text-slate-900 dark:text-white mb-2">Password</Text>
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
                        >
                            {showPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                        </TouchableOpacity>
                    </View>
                    <Text className="text-[12px] text-slate-500 dark:text-slate-400 mt-1.5">Use 8+ chars with letters, numbers & a symbol.</Text>
                </View>

                {/* Terms */}
                <TouchableOpacity 
                    className="flex-row items-start mt-1 mb-5"
                    onPress={() => setAgreed(!agreed)}
                    activeOpacity={0.7}
                >
                    <View className={`w-5 h-5 rounded-md border-[1.5px] items-center justify-center mr-2.5 mt-0.5 ${agreed ? 'bg-primary border-primary' : 'border-slate-100 dark:border-slate-800'}`}>
                        {agreed && <Check size={14} color="#FFFFFF" />}
                    </View>
                    <Text className="flex-1 text-[13px] text-slate-500 dark:text-slate-400 leading-5">
                        I agree to the <Text className="text-primary font-bold">Terms</Text> and <Text className="text-primary font-bold">Privacy Policy</Text>.
                    </Text>
                </TouchableOpacity>

                {/* Submit Button */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSignUp}
                    disabled={isLoading}
                    className="bg-primary h-14 rounded-[20px] items-center justify-center shadow-lg shadow-primary/20"
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text className="text-white text-lg font-bold">Create Account</Text>
                    )}
                </TouchableOpacity>

                {/* Footer */}
                <View className="flex-row justify-center mt-8 mb-4">
                    <Text className="text-sm text-slate-500 dark:text-slate-400">Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <Text className="text-sm font-bold text-primary">Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AuthWrapper>
    );
};

export default SignUpScreen;
