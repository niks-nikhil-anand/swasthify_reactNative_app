import React from 'react';
import { View, Text, Image } from 'react-native';

const Step = ({ title, description, icon, isLast }: { title: string, description: string, icon: any, isLast?: boolean }) => (
    <View className={`flex-1 items-center px-1 ${!isLast ? 'mr-0' : ''}`}>
        <View className="relative items-center mb-4">
            <View
                className="w-16 h-16 bg-white rounded-full items-center justify-center border border-gray-100 shadow-sm overflow-hidden"
                style={{ elevation: 2 }}
            >
                <Image
                    source={icon}
                    className="w-10 h-10"
                    resizeMode="contain"
                />
            </View>
            {!isLast && (
                <View
                    className="absolute top-8 -right-12 w-24 h-[1px] bg-gray-100"
                    style={{ zIndex: -1 }}
                />
            )}
        </View>
        <Text className="section-heading dark:text-white mb-1.5 text-center px-1" numberOfLines={1}>
            {title}
        </Text>
        <Text className="section-description text-center px-1" numberOfLines={3}>
            {description}
        </Text>
    </View>
);

const HowItWorks = () => {
    return (
        <View className="py-12 bg-[#F9FAFB]">
            <View className="px-4 mb-10">
                <View className="flex-row items-center mb-2">
                    <Text className="section-heading dark:text-white">How </Text>
                    <View className="bg-[#D1F2E2] px-2 py-0.5 rounded-md">
                        <Text className="section-heading-highlight">Swasthify Works</Text>
                    </View>
                </View>
                <Text className="section-description">
                    Three simple steps to access top-tier healthcare from anywhere.
                </Text>
            </View>

            <View className="flex-row justify-between px-4">
                <Step
                    title="Find & Choose"
                    description="Search for expert doctors or clinics near your location."
                    icon={require('../../public/images/how_it_works/search.png')}
                />
                <Step
                    title="Book Instantly"
                    description="Pick a convenient slot and confirm your appointment."
                    icon={require('../../public/images/how_it_works/book.png')}
                />
                <Step
                    title="Get Care"
                    description="Consult via video or visit clinic and get recovery guidance."
                    icon={require('../../public/images/how_it_works/consult.png')}
                    isLast
                />
            </View>
        </View>
    );
};

export default HowItWorks;
