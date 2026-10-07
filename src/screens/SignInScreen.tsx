import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import { AuthWrapper } from '../components/auth/AuthWrapper';
import { Eye, EyeOff, Lock, Mail, MessageCircle, ShieldCheck } from 'lucide-react-native';

import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { AuthNotice, AuthPrimaryButton, AuthTextField } from '../components/auth/AuthFormControls';

type SignInScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'SignIn'>;
};

const SignInScreen = ({ navigation }: SignInScreenProps) => {
    const { login } = useAuth();
    
    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
    const [touched, setTouched] = useState({ email: false, password: false });
    const [isLoading, setIsLoading] = useState(false);

    const trimmedEmail = email.trim();
    const emailError = trimmedEmail.length === 0
        ? 'Enter your email address.'
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
            ? ''
            : 'Enter a valid email address.';
    const passwordError = password.length === 0 ? 'Enter your password.' : '';
    const canSubmit = !emailError && !passwordError;

    const handleSignIn = async () => {
        setTouched({ email: true, password: true });

        if (!canSubmit) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.login({
                email: trimmedEmail,
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
            description="Sign in with your email to manage appointments, reports, and care updates."
        >
            <View className="w-full gap-y-5">
                <AuthTextField
                    label="Email address"
                    icon={Mail}
                    placeholder="you@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                    focused={focusedField === 'email'}
                    touched={touched.email}
                    error={emailError}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => {
                        setFocusedField(null);
                        setTouched((prev) => ({ ...prev, email: true }));
                    }}
                />

                <View>
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-sm font-bold text-slate-900 dark:text-white">Password</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} disabled={isLoading}>
                            <Text className="text-[13px] font-bold text-primary">Forgot?</Text>
                        </TouchableOpacity>
                    </View>
                    <AuthTextField
                        label=""
                        icon={Lock}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        editable={!isLoading}
                        focused={focusedField === 'password'}
                        touched={touched.password}
                        error={passwordError}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => {
                            setFocusedField(null);
                            setTouched((prev) => ({ ...prev, password: true }));
                        }}
                        className="pr-12"
                        right={(
                            <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            className="absolute right-4"
                            disabled={isLoading}
                        >
                            {showPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                        </TouchableOpacity>
                        )}
                    />
                </View>

                <AuthPrimaryButton
                    label="Sign In"
                    loadingLabel="Signing in"
                    onPress={handleSignIn}
                    isLoading={isLoading}
                    disabled={!canSubmit}
                    className="mt-1"
                />

                <AuthNotice
                    icon={ShieldCheck}
                    text="We protect your login session and never share personal health information without consent."
                />

                <TouchableOpacity 
                    onPress={() => navigation.navigate('OTPLogin')}
                    className="items-center"
                    disabled={isLoading}
                >
                    <View className="flex-row items-center">
                        <MessageCircle size={16} color="#10B981" />
                        <Text className="text-sm font-bold text-primary ml-2">Login with Mobile OTP</Text>
                    </View>
                </TouchableOpacity>

                <View className="flex-row justify-center pt-1">
                    <Text className="text-sm text-slate-600 dark:text-slate-200">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text className="text-sm font-bold text-primary">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AuthWrapper>
    );
};

export default SignInScreen;
