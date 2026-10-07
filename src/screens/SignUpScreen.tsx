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
import { Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react-native';

import { authService } from '../services/authService';
import { AuthCheckbox, AuthNotice, AuthPrimaryButton, AuthTextField } from '../components/auth/AuthFormControls';

type SignUpScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'SignUp'>;
};

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(true);
    const [focusedField, setFocusedField] = useState<'name' | 'email' | 'phone' | 'password' | null>(null);
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        phone: false,
        password: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const mobile = phone.replace(/\D/g, '').slice(0, 10);
    const nameError = trimmedName.length === 0 ? 'Enter your full name.' : '';
    const emailError = trimmedEmail.length === 0
        ? 'Enter your email address.'
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
            ? ''
            : 'Enter a valid email address.';
    const phoneError = mobile.length === 0
        ? 'Enter your mobile number.'
        : mobile.length !== 10
            ? 'Mobile number must be 10 digits.'
            : '';
    const passwordError = password.length === 0
        ? 'Create a password.'
        : password.length < 8
            ? 'Use at least 8 characters.'
            : '';
    const canSubmit = !nameError && !emailError && !phoneError && !passwordError && agreed;

    const handleSignUp = async () => {
        setTouched({ name: true, email: true, phone: true, password: true });

        if (!canSubmit) {
            if (!agreed) {
                return Alert.alert('Terms required', 'Please agree to the Terms and Privacy Policy.');
            }
            return;
        }

        if (!agreed) {
            return Alert.alert('Error', 'Please agree to the Terms and Privacy Policy');
        }

        setIsLoading(true);
        try {
            await authService.register({
                name: trimmedName,
                email: trimmedEmail,
                mobile,
                phone: mobile,
                password,
                role: 'PATIENT',
            });

            Alert.alert('Success', 'Account created! Please Sign In.', [
                { text: 'OK', onPress: () => navigation.navigate('OTPLogin') }
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
            description="Set up a secure patient account for appointments, records, and care updates."
        >
            <View className="w-full gap-y-4">
                <AuthTextField
                    label="Full name"
                    icon={User}
                    placeholder="Ayan Singh"
                    value={name}
                    onChangeText={setName}
                    editable={!isLoading}
                    focused={focusedField === 'name'}
                    touched={touched.name}
                    error={nameError}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => {
                        setFocusedField(null);
                        setTouched((prev) => ({ ...prev, name: true }));
                    }}
                />

                <AuthTextField
                    label="Email"
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
                    <Text className="text-sm font-bold text-slate-900 dark:text-white mb-2">Mobile number</Text>
                    <View className="flex-row items-center">
                        <View className="flex-row items-center justify-center h-14 w-[84px] bg-white dark:bg-slate-900 border-[1.5px] border-slate-200 dark:border-slate-800 rounded-2xl mr-2">
                            <Text className="text-base font-bold text-slate-900 dark:text-white">+91</Text>
                        </View>
                        <AuthTextField
                            label=""
                            icon={Phone}
                            containerClassName="flex-1"
                            placeholder="98765 43210"
                            value={mobile}
                            onChangeText={(value) => setPhone(value.replace(/\D/g, '').slice(0, 10))}
                            keyboardType="phone-pad"
                            maxLength={10}
                            editable={!isLoading}
                            focused={focusedField === 'phone'}
                            touched={touched.phone}
                            error={phoneError}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => {
                                setFocusedField(null);
                                setTouched((prev) => ({ ...prev, phone: true }));
                            }}
                            className="min-w-0"
                        />
                    </View>
                </View>

                <AuthTextField
                    label="Password"
                    icon={Lock}
                    placeholder="Create a password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                    focused={focusedField === 'password'}
                    touched={touched.password}
                    error={passwordError}
                    helperText="Use 8+ characters with letters and numbers."
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

                <AuthCheckbox
                    checked={agreed}
                    onPress={() => setAgreed(!agreed)}
                    disabled={isLoading}
                >
                    I agree to the <Text className="text-primary font-bold">Terms</Text> and <Text className="text-primary font-bold">Privacy Policy</Text>.
                </AuthCheckbox>

                <AuthPrimaryButton
                    label="Create Account"
                    loadingLabel="Creating"
                    onPress={handleSignUp}
                    isLoading={isLoading}
                    disabled={!canSubmit}
                />

                <AuthNotice
                    icon={ShieldCheck}
                    text="Basic details only for signup. You can add health information later from your profile."
                />

                <View className="flex-row justify-center mt-2 mb-4">
                    <Text className="text-sm text-slate-600 dark:text-slate-200">Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('OTPLogin')}>
                        <Text className="text-sm font-bold text-primary">Login with OTP</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AuthWrapper>
    );
};

export default SignUpScreen;
