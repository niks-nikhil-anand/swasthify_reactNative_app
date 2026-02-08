import React from 'react';
import { View, Text } from 'react-native';

const Step = ({ number, title, description }: { number: string, title: string, description: string }) => (
    <View className="flex-row mb-6 relative">
        <View className="mr-4 items-center">
            <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center z-10">
                <Text className="text-white font-bold">{number}</Text>
            </View>
            {number !== "3" && <View className="w-0.5 bg-blue-200 h-full absolute top-8" />}
        </View>
        <View className="flex-1 pb-2">
            <Text className="text-lg font-bold text-gray-900 mb-1">{title}</Text>
            <Text className="text-gray-500 text-sm leading-5">{description}</Text>
        </View>
    </View>
);

const HowItWorks = () => {
    return (
        <View className="p-6 bg-white">
            <Text className="text-2xl font-bold text-gray-900 mb-8 text-center">How Swasthify Works</Text>

            <View className="px-2">
                <Step
                    number="1"
                    title="Search"
                    description="Find doctors, clinics, or diagnostic centers based on your needs and location."
                />
                <Step
                    number="2"
                    title="Book Appointment"
                    description="Select a convenient time slot and book your appointment instantly."
                />
                <Step
                    number="3"
                    title="Consult"
                    description="Visit the clinic or consult online via video call and get your digital prescription."
                />
            </View>
        </View>
    );
};

export default HowItWorks;
