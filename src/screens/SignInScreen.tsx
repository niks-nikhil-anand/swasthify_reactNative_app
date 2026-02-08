import React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const SignInScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Navbar />
            <View className="flex-1 justify-center p-6">
                <Text className="text-3xl font-bold text-gray-900 mb-8 text-center">Welcome Back</Text>

                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-700 mb-2 font-medium">Email Address</Text>
                        <TextInput
                            placeholder="you@example.com"
                            className="border border-gray-300 rounded-lg p-3 w-full"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                        <TextInput
                            placeholder="••••••••"
                            className="border border-gray-300 rounded-lg p-3 w-full"
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity className="bg-blue-600 p-4 rounded-lg mt-6">
                        <Text className="text-white text-center font-bold text-lg">Sign In</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-4">
                        <Text className="text-gray-600">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text className="text-blue-600 font-bold">Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Footer />
        </SafeAreaView>
    );
};

export default SignInScreen;
