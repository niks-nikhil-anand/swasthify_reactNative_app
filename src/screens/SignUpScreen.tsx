import React, { useState } from 'react';
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
                            <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
                            <Text className="text-gray-500 text-center">
                                Join Swastify for the best healthcare experience
                            </Text>
                        </View>

                        {/* Form Section */}
                        <View className="gap-5">
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
                                        <Text>{showPassword ? '👁️' : '🙈'}</Text>
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
                                onPress={handleSignUp}
                                disabled={isLoading}
                                className="bg-[#0DA96E] py-4 rounded-xl shadow-sm items-center justify-center flex-row mt-4"
                                style={{ elevation: 2 }}
                            >
                                {isLoading && <ActivityIndicator color="white" size="small" className="mr-2" />}
                                <Text className="text-white font-bold text-lg">Create Account</Text>
                            </TouchableOpacity>

                            {/* Sign In Link */}
                            <View className="flex-row justify-center mt-2">
                                <Text className="text-gray-500">Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                                    <Text className="text-[#0DA96E] font-bold">Sign In</Text>
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

export default SignUpScreen;
