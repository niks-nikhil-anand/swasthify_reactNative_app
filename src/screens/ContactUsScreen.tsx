import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Footer from '../components/Footer';

const ContactUsScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
                <Text className="text-3xl font-bold text-foreground mb-2 text-center">Contact Us</Text>
                <Text className="text-muted-foreground text-center mb-8">We'd love to hear from you. Send us a message!</Text>

                <View className="space-y-4 mb-8">
                    <View>
                        <Text className="text-foreground mb-2 font-medium">Full Name</Text>
                        <TextInput
                            placeholder="Your Name"
                            className="border border-border rounded-lg p-3 w-full"
                        />
                    </View>

                    <View>
                        <Text className="text-foreground mb-2 font-medium">Email Address</Text>
                        <TextInput
                            placeholder="you@example.com"
                            className="border border-border rounded-lg p-3 w-full"
                            keyboardType="email-address"
                        />
                    </View>

                    <View>
                        <Text className="text-foreground mb-2 font-medium">Message</Text>
                        <TextInput
                            placeholder="How can we help you?"
                            className="border border-border rounded-lg p-3 w-full h-32"
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity className="bg-primary p-4 rounded-lg mt-2">
                        <Text className="text-primary-foreground text-center font-bold text-lg">Send Message</Text>
                    </TouchableOpacity>
                </View>

                <View className="border-t border-border pt-8">
                    <Text className="text-xl font-bold text-foreground mb-4 text-center">Get in Touch</Text>
                    <View className="flex-row justify-center space-x-8">
                        <View className="items-center">
                            <Text className="font-bold text-foreground">Email</Text>
                            <Text className="text-primary">support@swastify.com</Text>
                        </View>
                        <View className="items-center">
                            <Text className="font-bold text-foreground">Phone</Text>
                            <Text className="text-primary">+91 123 456 7890</Text>
                        </View>
                    </View>
                    <View className="items-center mt-4">
                        <Text className="font-bold text-foreground">Address</Text>
                        <Text className="text-muted-foreground text-center">123 Health Street, Tech City, India</Text>
                    </View>
                </View>
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
};

export default ContactUsScreen;
