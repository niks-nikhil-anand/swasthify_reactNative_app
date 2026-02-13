import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const AbhaIdSection = () => {
    return (
        <View className="px-4 my-5">
            <View
                className="bg-[#E7FAF2] rounded-[32px] overflow-hidden shadow-sm border border-[#D1F2E2]"
                style={{ elevation: 2 }}
            >
                <View className="flex-row items-center p-6 pb-4">
                    <View className="flex-1 pr-4">
                        <View className="bg-[#0DA96E]/10 self-start px-2 py-1 rounded-md mb-2">
                            <Text className="text-[#0DA96E] text-[10px] font-bold tracking-wider uppercase">
                                Ayushman Bharat Digital Mission
                            </Text>
                        </View>
                        <Text className="text-xl font-bold text-[#111827] mb-1">
                            Your ABHA ID is your key
                        </Text>
                        <Text className="text-[#0DA96E] font-bold text-lg mb-2">
                            to smarter healthcare.
                        </Text>
                    </View>
                    <Image
                        source={require('../../public/images/abha-illustration.jpg')}
                        className="w-24 h-24"
                        resizeMode="contain"
                    />
                </View>

                <View className="px-6 pb-6">
                    <Text className="text-[#4B5563] leading-5 mb-6 text-sm">
                        Create your Ayushman Bharat Health Account (ABHA) ID to store and share your health records digitally and securely.
                    </Text>

                    <TouchableOpacity
                        className="bg-[#0DA96E] flex-row items-center justify-center py-4 rounded-2xl shadow-emerald-100"
                        style={{ elevation: 2 }}
                    >
                        <Text className="text-white font-bold text-base mr-2">Create ABHA ID Now</Text>
                        <Text className="text-white text-lg">→</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-between mt-4 border-t border-gray-200 pt-4">
                        <View className="flex-row items-center">
                            <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Secure • Portable • Paperless</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default AbhaIdSection;
