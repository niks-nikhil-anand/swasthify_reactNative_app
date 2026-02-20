import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';

interface ServiceCardProps {
    title: string;
    description: string;
    icon: ImageSourcePropType;
    iconBg: string;
}

const ServiceCard = ({ title, description, icon, iconBg }: ServiceCardProps) => (
    <View
        className="bg-white dark:bg-slate-800 p-4 rounded-[24px] border border-gray-100 dark:border-slate-700 shadow-sm mb-3 w-[48.5%]"
        style={{ elevation: 2 }}
    >
        <View className={`w-10 h-10 ${iconBg} rounded-xl items-center justify-center mb-3 overflow-hidden`}>
            <Image source={icon} className="w-8 h-8" resizeMode="contain" />
        </View>
        <Text className="text-sm font-bold text-[#111827] dark:text-white mb-1 leading-4" numberOfLines={2}>
            {title}
        </Text>
        <Text className="text-[#6B7280] dark:text-gray-400 text-[10px] leading-4 mb-4" numberOfLines={3}>
            {description}
        </Text>

        <TouchableOpacity className="flex-row items-center border border-gray-100 dark:border-slate-700 py-2 px-3 rounded-lg self-start">
            <Text className="text-[#111827] dark:text-gray-200 font-semibold text-[10px]">Book Now</Text>
            <Text className="ml-1 text-gray-400 dark:text-slate-500 text-[10px]">→</Text>
        </TouchableOpacity>
    </View>
);

const IntegratedServices = () => {
    const services = [
        {
            title: "Doctor Near Me",
            description: "Locate and book best doctors in your neighborhood.",
            icon: require('../../public/images/icons/doctor_location.png'),
            iconBg: "bg-green-50",
        },
        {
            title: "Lab Tests",
            description: "Book tests online & get sample collection from home.",
            icon: require('../../public/images/icons/lab_tests_new.png'),
            iconBg: "bg-purple-50",
        },
        {
            title: "Surgeries",
            description: "Expert surgical care with end-to-end assistance.",
            icon: require('../../public/images/icons/surgeries.png'),
            iconBg: "bg-orange-50",
        },
        {
            title: "Video Consultation",
            description: "Connect with top specialists from the comfort of your home via secure video calls.",
            icon: require('../../public/images/icons/video_consultation_new.png'),
            iconBg: "bg-blue-50",
        }
    ];

    return (
        <View className="px-4 py-10 bg-white dark:bg-card">
            <View className="mb-8">
                <View className="flex-row flex-wrap items-center">
                    <View className="bg-[#D1F2E2] dark:bg-[#064E3B] px-2 py-1 rounded-md mr-1.5">
                        <Text className="text-[#0DA96E] dark:text-[#48C496] text-xl font-bold">Integrated Healthcare</Text>
                    </View>
                    <Text className="text-xl font-bold text-[#111827] dark:text-white">Services for Every Need</Text>
                </View>
                <Text className="text-[#6B7280] dark:text-gray-400 mt-3 text-sm leading-5 max-w-[95%]">
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
