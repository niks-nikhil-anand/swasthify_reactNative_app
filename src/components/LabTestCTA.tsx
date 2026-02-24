import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootDrawerParamList } from '../navigation/types';

const LabTestCTA = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootDrawerParamList>>();

    return (
        <TouchableOpacity
            className="px-4 my-2"
            onPress={() => navigation.navigate('Labs')}
            activeOpacity={0.9}
        >
            <View
                className="bg-[#E7FAF2] dark:bg-[#064E3B]/20 rounded-[32px] overflow-hidden shadow-sm border border-[#D1F2E2] dark:border-[#064E3B]/40 flex-row"
                style={{ elevation: 2, minHeight: 170 }}
            >
                {/* Left — text content */}
                <View className="flex-1 p-6 justify-center">
                    <View className="bg-[#0DA96E]/10 dark:bg-[#064E3B] self-start px-2 py-1 rounded-md mb-2">
                        <Text className="text-[#0DA96E] dark:text-[#48C496] text-[10px] font-bold tracking-wider uppercase">
                            Safe & Hygienic
                        </Text>
                    </View>
                    <Text className="text-lg font-bold text-[#111827] dark:text-white mb-1">
                        Book Lab Tests from Home
                    </Text>
                    <Text className="text-[#4B5563] dark:text-gray-400 text-[10px] leading-4 mb-4">
                        Sample collection by certified professionals at your doorstep. Secure & hassle-free.
                    </Text>

                    <View
                        className="bg-[#0DA96E] self-start px-5 py-2.5 rounded-xl shadow-sm"
                        style={{ elevation: 1 }}
                    >
                        <Text className="text-white font-bold text-xs">Book Test Now</Text>
                    </View>
                </View>

                {/* Right — full-height image */}
                <Image
                    source={require('../../public/images/cta/lab-test.png')}
                    style={{ width: 140 }}
                    className="h-full"
                    resizeMode="cover"
                />
            </View>
        </TouchableOpacity>
    );
};

export default LabTestCTA;
