import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const LabTestCTA = () => {
    return (
        <View className="px-4 my-2">
            <View
                className="bg-[#E7FAF2] rounded-[32px] overflow-hidden shadow-sm border border-[#D1F2E2] flex-row items-center p-6"
                style={{ elevation: 2 }}
            >
                <View className="flex-1 pr-4">
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

                <View className="w-24 h-24 bg-white rounded-2xl items-center justify-center border border-gray-100 shadow-sm overflow-hidden">
                    <Image
                        source={require('../../public/images/cta/lab-test.png')}
                        className="w-20 h-20"
                        resizeMode="contain"
                    />
                </View>
            </View>
        </View>
    );
};

export default LabTestCTA;
