import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';

interface ServiceCardProps {
    title: string;
    description: string;
    icon: ImageSourcePropType;
}

interface WideServiceCardProps extends ServiceCardProps { }

const ServiceCard = ({ title, description, icon }: ServiceCardProps) => (
    <View
        className="bg-white dark:bg-slate-800 p-4 rounded-[24px] border border-gray-100 dark:border-slate-700 mb-3 w-[48.5%]"
        style={{ elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }}
    >
        <View className="w-14 h-14 items-center justify-center mb-3.5">
            <Image source={icon} className="w-14 h-14" resizeMode="contain" />
        </View>
        <Text className="text-[15px] font-bold text-[#111827] dark:text-white mb-1.5 leading-5" numberOfLines={2}>
            {title}
        </Text>
        <Text className="text-[#6B7280] dark:text-gray-400 text-[12px] leading-[18px] mb-4" numberOfLines={3}>
            {description}
        </Text>
        <TouchableOpacity className="flex-row items-center bg-[#0DA96E] py-2 px-3 rounded-xl self-start">
            <Text className="text-white font-semibold text-[11px]">Book Now</Text>
            <Text className="ml-1 text-white text-[11px]">→</Text>
        </TouchableOpacity>
    </View>
);

const WideServiceCard = ({ title, description, icon }: WideServiceCardProps) => (
    <View
        className="bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-gray-100 dark:border-slate-700 mb-3 w-full flex-row items-center"
        style={{ elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }}
    >
        <View className="w-20 h-20 items-center justify-center mr-4 flex-shrink-0">
            <Image source={icon} className="w-20 h-20" resizeMode="contain" />
        </View>
        <View className="flex-1">
            <Text className="text-[16px] font-bold text-[#111827] dark:text-white mb-1.5 leading-5">
                {title}
            </Text>
            <Text className="text-[#6B7280] dark:text-gray-400 text-[12px] leading-[18px] mb-4">
                {description}
            </Text>
            <TouchableOpacity className="flex-row items-center bg-[#0DA96E] py-2 px-4 rounded-xl self-start">
                <Text className="text-white font-semibold text-[11px]">Book Now</Text>
                <Text className="ml-1 text-white text-[11px]">→</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const IntegratedServices = () => {
    return (
        <View className="px-4 py-10 bg-white dark:bg-card">
            <View className="mb-8">
                <View className="flex-row flex-wrap items-center mb-3">
                    <View className="bg-[#D1F2E2] dark:bg-[#064E3B] px-2.5 py-1 rounded-lg mr-2">
                        <Text className="text-[#0DA96E] dark:text-[#48C496] text-2xl font-bold">Integrated Healthcare</Text>
                    </View>
                    <Text className="text-2xl font-bold text-[#111827] dark:text-white">Services</Text>
                </View>
                <Text className="text-[#6B7280] dark:text-gray-400 text-sm leading-[22px] max-w-[95%]">
                    Access world-class medical expertise and surgical care through one unified platform.
                </Text>
            </View>

            {/* Full-width Doctor Near Me card */}
            <WideServiceCard
                title="Doctor Near Me"
                description="Locate and book the best doctors in your neighborhood for in-clinic consultations."
                icon={require('../../public/images/icons/doctor_location_3d.png')}
            />

            {/* Bottom row — two half-width cards */}
            <View className="flex-row flex-wrap justify-between">
                <ServiceCard
                    title="Video Consultation"
                    description="Connect with top specialists from the comfort of your home via secure video calls."
                    icon={require('../../public/images/icons/video_consult.png')}
                />
                <ServiceCard
                    title="Lab Tests"
                    description="Book tests online & get sample collection from home."
                    icon={require('../../public/images/icons/lab_tests_new.png')}
                />
            </View>
        </View>
    );
};

export default IntegratedServices;
