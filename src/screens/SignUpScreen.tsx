import React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const SignUpScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Navbar />
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="p-6">
                <Text className="text-3xl font-bold text-gray-900 mb-8 text-center">Create Account</Text>

                <View className="space-y-4">
                    <View className="flex-row space-x-4">
                        <View className="flex-1">
                            <Text className="text-gray-700 mb-2 font-medium">First Name</Text>
                            <TextInput
                                placeholder="John"
                                className="border border-gray-300 rounded-lg p-3 w-full"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-700 mb-2 font-medium">Last Name</Text>
                            <TextInput
                                placeholder="Doe"
                                className="border border-gray-300 rounded-lg p-3 w-full"
                            />
                        </View>
                    </View>

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

                    <View>
                        <Text className="text-gray-700 mb-2 font-medium">Confirm Password</Text>
                        <TextInput
                            placeholder="••••••••"
                            className="border border-gray-300 rounded-lg p-3 w-full"
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity className="bg-blue-600 p-4 rounded-lg mt-6">
                        <Text className="text-white text-center font-bold text-lg">Sign Up</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-4">
                        <Text className="text-gray-600">Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                            <Text className="text-blue-600 font-bold">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
};

export default SignUpScreen;
