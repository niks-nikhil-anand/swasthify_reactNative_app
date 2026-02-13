import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ServiceCardProps {
    title: string;
    description: string;
    icon: string;
    iconBg: string;
}

const ServiceCard = ({ title, description, icon, iconBg }: ServiceCardProps) => (
    <View
        className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm mb-3 w-[48.5%]"
        style={{ elevation: 2 }}
    >
        <View className={`w-10 h-10 ${iconBg} rounded-xl items-center justify-center mb-3`}>
            <Text className="text-xl">{icon}</Text>
        </View>
        <Text className="text-sm font-bold text-[#111827] mb-1 leading-4" numberOfLines={2}>
            {title}
        </Text>
        <Text className="text-[#6B7280] text-[10px] leading-4 mb-4" numberOfLines={3}>
            {description}
        </Text>

        <TouchableOpacity className="flex-row items-center border border-gray-100 py-2 px-3 rounded-lg self-start">
            <Text className="text-[#111827] font-semibold text-[10px]">Book Now</Text>
            <Text className="ml-1 text-gray-400 text-[10px]">→</Text>
        </TouchableOpacity>
    </View>
);

const IntegratedServices = () => {
    const services = [
        {
            title: "Doctor Near Me",
            description: "Locate and book best doctors in your neighborhood.",
            icon: "📍",
            iconBg: "bg-green-50",
        },
        {
            title: "Lab Tests",
            description: "Book tests online & get sample collection from home.",
            icon: "🔬",
            iconBg: "bg-purple-50",
        },
        {
            title: "Surgeries",
            description: "Expert surgical care with end-to-end assistance.",
            icon: "🩺",
            iconBg: "bg-orange-50",
        },
        {
            title: "Video Consult",
            description: "Connect with specialists from comfort of your home.",
            icon: "📹",
            iconBg: "bg-blue-50",
        }
    ];

    return (
        <View className="px-4 py-10 bg-white">
            <View className="mb-8">
                <View className="flex-row flex-wrap items-center">
                    <View className="bg-[#D1F2E2] px-2 py-1 rounded-md mr-1.5">
                        <Text className="text-[#0DA96E] text-xl font-bold">Integrated Healthcare</Text>
                    </View>
                    <Text className="text-xl font-bold text-[#111827]">Services for Every Need</Text>
                </View>
                <Text className="text-[#6B7280] mt-3 text-sm leading-5 max-w-[95%]">
                    Access world-class medical expertise and surgical care through one unified platform.
                </Text>
            </View>

            <View className="flex-row flex-wrap justify-between">
                {services.map((service, index) => (
                    <ServiceCard key={index} {...service} />
                ))}
            </View>
        </View>
    );
};

export default IntegratedServices;
