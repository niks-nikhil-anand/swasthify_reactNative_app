import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Image } from 'react-native';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <Navbar />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
                <Text className="text-3xl font-bold text-gray-900 mb-6 text-center">About Swastify</Text>

                <View className="mb-8">
                    <Text className="text-xl font-semibold text-gray-800 mb-2">Our Mission</Text>
                    <Text className="text-gray-600 leading-6">
                        At Swastify, our mission is to make healthcare accessible, affordable, and seamless for everyone.
                        We bridge the gap between patients and top-tier medical professionals through technology.
                    </Text>
                </View>

                <View className="mb-8">
                    <Text className="text-xl font-semibold text-gray-800 mb-2">Who We Are</Text>
                    <Text className="text-gray-600 leading-6">
                        We are a team of dedicated developers, doctors, and healthcare enthusiasts working together to
                        simplify your medical journey. From booking appointments to managing health records, Swastify is your
                        trusted health companion.
                    </Text>
                </View>

                <View>
                    <Text className="text-xl font-semibold text-gray-800 mb-4">Our Values</Text>
                    <View className="flex-row flex-wrap justify-between">
                        <View className="w-[48%] bg-blue-50 p-4 rounded-lg mb-4">
                            <Text className="font-bold text-blue-700 mb-1">Integrity</Text>
                            <Text className="text-sm text-gray-600">Trust and transparency in every interaction.</Text>
                        </View>
                        <View className="w-[48%] bg-green-50 p-4 rounded-lg mb-4">
                            <Text className="font-bold text-green-700 mb-1">Innovation</Text>
                            <Text className="text-sm text-gray-600">Leveraging technology for better health outcomes.</Text>
                        </View>
                        <View className="w-[48%] bg-purple-50 p-4 rounded-lg mb-4">
                            <Text className="font-bold text-purple-700 mb-1">Empathy</Text>
                            <Text className="text-sm text-gray-600">Understanding and caring for our patients' needs.</Text>
                        </View>
                        <View className="w-[48%] bg-orange-50 p-4 rounded-lg mb-4">
                            <Text className="font-bold text-orange-700 mb-1">Excellence</Text>
                            <Text className="text-sm text-gray-600">Striving for the highest quality in service.</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
};

export default AboutScreen;
