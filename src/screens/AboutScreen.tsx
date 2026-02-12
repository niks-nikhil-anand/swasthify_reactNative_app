import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import Footer from '../components/Footer';

const AboutScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
                <Text className="text-3xl font-bold text-foreground mb-6 text-center">About Swastify</Text>

                <View className="mb-8">
                    <Text className="text-xl font-semibold text-foreground mb-2">Our Mission</Text>
                    <Text className="text-muted-foreground leading-6">
                        At Swastify, our mission is to make healthcare accessible, affordable, and seamless for everyone.
                        We bridge the gap between patients and top-tier medical professionals through technology.
                    </Text>
                </View>

                <View className="mb-8">
                    <Text className="text-xl font-semibold text-foreground mb-2">Who We Are</Text>
                    <Text className="text-muted-foreground leading-6">
                        We are a team of dedicated developers, doctors, and healthcare enthusiasts working together to
                        simplify your medical journey. From booking appointments to managing health records, Swastify is your
                        trusted health companion.
                    </Text>
                </View>

                <View>
                    <Text className="text-xl font-semibold text-foreground mb-4">Our Values</Text>
                    <View className="flex-row flex-wrap justify-between">
                        <View className="w-[48%] bg-primary/10 p-4 rounded-lg mb-4">
                            <Text className="font-bold text-primary mb-1">Integrity</Text>
                            <Text className="text-sm text-muted-foreground">Trust and transparency in every interaction.</Text>
                        </View>
                        <View className="w-[48%] bg-accent/10 p-4 rounded-lg mb-4">
                            <Text className="font-bold text-accent mb-1">Innovation</Text>
                            <Text className="text-sm text-muted-foreground">Leveraging technology for better health outcomes.</Text>
                        </View>
                        <View className="w-[48%] bg-purple-50 p-4 rounded-lg mb-4">
                            <Text className="font-bold text-purple-700 mb-1">Empathy</Text>
                            <Text className="text-sm text-muted-foreground">Understanding and caring for our patients' needs.</Text>
                        </View>
                        <View className="w-[48%] bg-orange-50 p-4 rounded-lg mb-4">
                            <Text className="font-bold text-orange-700 mb-1">Excellence</Text>
                            <Text className="text-sm text-muted-foreground">Striving for the highest quality in service.</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
};

export default AboutScreen;
