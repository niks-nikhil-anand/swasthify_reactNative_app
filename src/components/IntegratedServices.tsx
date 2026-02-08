import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const ServiceCard = ({ title, description, icon }: { title: string, description: string, icon: string }) => (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 m-1 min-w-[150px]">
        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mb-3">
            {/* Placeholder for Icon - using Text for now */}
            <Text className="text-xl">{icon}</Text>
        </View>
        <Text className="font-bold text-gray-900 mb-1">{title}</Text>
        <Text className="text-xs text-gray-500">{description}</Text>
    </View>
);

const IntegratedServices = () => {
    return (
        <View className="p-4 bg-gray-50">
            <View className="mb-4">
                <Text className="text-2xl font-bold text-gray-900 leading-tight">
                    Integrated Healthcare Services for Every Need
                </Text>
                <Text className="text-gray-600 mt-2 text-sm">
                    Access world-class medical expertise, advanced diagnostics, and surgical care – all through one unified platform.
                </Text>
            </View>

            <View className="flex-row flex-wrap justify-between">
                <ServiceCard
                    title="Online Consult"
                    description="Connect with top doctors via video call."
                    icon="🩺"
                />
                <ServiceCard
                    title="In-Clinic Visit"
                    description="Book appointments at nearby clinics."
                    icon="🏥"
                />
                <ServiceCard
                    title="Lab Tests"
                    description="Sample collection from your home."
                    icon="🧪"
                />
                <ServiceCard
                    title="Surgeries"
                    description="Safe and trusted surgical care."
                    icon="💊"
                />
            </View>
        </View>
    );
};

export default IntegratedServices;
