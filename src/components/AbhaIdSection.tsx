import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const AbhaIdSection = () => {
    return (
        <View className="p-4 bg-orange-50 my-4">
            <View className="flex-row items-center mb-4">
                <View className="bg-orange-100 p-2 rounded-lg mr-3">
                    <Text className="text-2xl">🆔</Text>
                </View>
                <View className="flex-1">
                    <Text className="text-xl font-bold text-gray-900">Your ABHA ID is your key</Text>
                    <Text className="text-orange-800 font-medium">to smarter healthcare.</Text>
                </View>
            </View>

            <Text className="text-gray-600 leading-5 mb-4 text-sm">
                Create your Ayushman Bharat Health Account (ABHA) ID to store and share your health records digitally and securely.
            </Text>

            <TouchableOpacity className="bg-orange-500 py-3 rounded-lg items-center shadow-sm">
                <Text className="text-white font-bold text-base">Create ABHA ID</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AbhaIdSection;
