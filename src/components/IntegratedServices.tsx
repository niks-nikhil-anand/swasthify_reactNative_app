import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootDrawerParamList } from '../navigation/types';

interface ServiceCardProps {
    title: string;
    description: string;
    icon: ImageSourcePropType;
    onPress?: () => void;
}

interface WideServiceCardProps extends ServiceCardProps { }

const ServiceCard = ({ title, description, icon, onPress }: ServiceCardProps) => (
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
        <TouchableOpacity
            className="flex-row items-center bg-[#0DA96E] py-2 px-3 rounded-xl self-start"
            onPress={onPress}
        >
            <Text className="text-white font-semibold text-[11px]">Book Now</Text>
            <Text className="ml-1 text-white text-[11px]">→</Text>
        </TouchableOpacity>
    </View>
);

const WideServiceCard = ({ title, description, icon, onPress }: WideServiceCardProps) => (
    <View
        className="bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700 mb-3 w-full flex-row overflow-hidden"
        style={{ elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, minHeight: 160 }}
    >
        {/* Left — text content */}
        <View className="flex-1 p-5 justify-center">
            <Text className="text-[16px] font-bold text-[#111827] dark:text-white mb-1.5 leading-5">
                {title}
            </Text>
            <Text className="text-[#6B7280] dark:text-gray-400 text-[12px] leading-[18px] mb-4">
                {description}
            </Text>
            <TouchableOpacity
                className="flex-row items-center bg-[#0DA96E] py-2 px-4 rounded-xl self-start"
                onPress={onPress}
            >
                <Text className="text-white font-semibold text-[11px]">Book Now</Text>
                <Text className="ml-1 text-white text-[11px]">→</Text>
            </TouchableOpacity>
        </View>

        {/* Right — full-height image */}
        <Image
            source={icon}
            style={{ width: 140 }}
            className="h-full"
            resizeMode="cover"
        />
    </View>
);


const IntegratedServices = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootDrawerParamList>>();

    return (
        <View className="px-4 py-10 bg-white dark:bg-card">
            <View className="mb-8">
                <View className="flex-row flex-wrap items-center mb-3">
                    <View className="bg-[#D1F2E2] dark:bg-[#064E3B] px-2.5 py-1 rounded-lg mr-2">
                        <Text className="section-heading-highlight dark:text-[#48C496]">Integrated Healthcare</Text>
                    </View>
                    <Text className="section-heading dark:text-white">Services</Text>
                </View>
                <Text className="section-description dark:text-gray-400 max-w-[95%]">
                    Access world-class medical expertise and surgical care through one unified platform.
                </Text>
            </View>

            {/* Full-width Doctor Near Me card */}
            <WideServiceCard
                title="Doctor Near Me"
                description="Locate and book the best doctors in your neighborhood for in-clinic consultations."
                icon={require('../../public/images/nearBy_doctor.png')}
                onPress={() => navigation.navigate('Doctors')}
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
                    onPress={() => navigation.navigate('Labs')}
                />
            </View>
        </View>
    );
};

export default IntegratedServices;
