import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const LabTestCTA = () => {
    return (
        <View className="px-4 my-2">
            <View
                className="bg-[#E7FAF2] rounded-[32px] overflow-hidden shadow-sm border border-[#D1F2E2] flex-row"
                style={{ elevation: 2, minHeight: 170 }}
            >
                {/* Left — text content */}
                <View className="flex-1 p-6 justify-center">
                    <View className="bg-[#0DA96E]/10 self-start px-2 py-1 rounded-md mb-2">
                        <Text className="text-[#0DA96E] text-[10px] font-bold tracking-wider uppercase">
                            Safe & Hygienic
                        </Text>
                    </View>
                    <Text className="text-lg font-bold text-[#111827] mb-1">
                        Book Lab Tests from Home
                    </Text>
                    <Text className="text-[#4B5563] text-[10px] leading-4 mb-4">
                        Sample collection by certified professionals at your doorstep. Secure & hassle-free.
                    </Text>

                    <TouchableOpacity
                        className="bg-[#0DA96E] self-start px-5 py-2.5 rounded-xl shadow-sm"
                        style={{ elevation: 1 }}
                    >
                        <Text className="text-white font-bold text-xs">Book Test Now</Text>
                    </TouchableOpacity>
                </View>

                {/* Right — full-height image */}
                <Image
                    source={require('../../public/images/cta/lab-test.png')}
                    style={{ width: 140 }}
                    className="h-full"
                    resizeMode="cover"
                />
            </View>
        </View>
    );
};

export default LabTestCTA;
