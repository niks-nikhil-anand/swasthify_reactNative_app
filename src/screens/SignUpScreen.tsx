import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import { AuthWrapper } from '../components/auth/AuthWrapper';
import Feather from 'react-native-vector-icons/Feather';

type SignUpScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'SignUp'>;
};

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigation.navigate('SignIn');
        }, 1500);
    };

    return (
        <AuthWrapper
            title="Create Account"
            description="Join Swastify for the best healthcare experience"
            showSocial={false}
            backButtonLabel="Already have an account? Sign In"
            onBackPress={() => navigation.navigate('SignIn')}
        >
            {/* Form Section */}
            <View className="gap-y-5">
                {/* Full Name */}
                <View>
                    <Text className="text-sm font-bold text-gray-700 mb-2">Full Name</Text>
                    <TextInput
                        placeholder="John Doe"
                        value={name}
                        onChangeText={setName}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                        editable={!isLoading}
                    />
                </View>

                {/* Email */}
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

                {/* Password */}
                <View>
                    <Text className="text-sm font-bold text-gray-700 mb-2">Password</Text>
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
                            activeOpacity={0.7}
                            onPress={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-3.5"
                        >
                            <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Confirm Password */}
                <View>
                    <Text className="text-sm font-bold text-gray-700 mb-2">Confirm Password</Text>
                    <TextInput
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={true}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                        editable={!isLoading}
                    />
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSignUp}
                    disabled={isLoading}
                    className="bg-[#0DA96E] py-4 rounded-xl items-center justify-center flex-row shadow-lg shadow-[#0DA96E]/20 mt-4 active:scale-[0.98]"
                >
                    {isLoading && <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />}
                    <Text className="text-white font-bold text-lg">Create Account</Text>
                </TouchableOpacity>
            </View>
        </AuthWrapper>
    );
};

export default SignUpScreen;
