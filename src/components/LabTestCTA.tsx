import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const LabTestCTA = () => {
    return (
        <View className="mx-4 my-2 bg-gradient-to-r from-purple-500 to-indigo-600 bg-indigo-50 rounded-2xl p-5 border border-indigo-100 flex-row items-center justify-between">
            <View className="flex-1 pr-4">
                <Text className="text-lg font-bold text-indigo-900 mb-1">Book a Lab Test from Home</Text>
                <Text className="text-indigo-600 text-xs mb-3">Safe sample collection by certified professionals at your doorstep.</Text>
                <TouchableOpacity className="bg-indigo-600 block w-28 py-2 rounded-lg items-center">
                    <Text className="text-white font-bold text-xs">Book Test</Text>
                </TouchableOpacity>
            </View>
            <View className="w-16 h-16 bg-indigo-200 rounded-full items-center justify-center">
                <Text className="text-3xl">🩸</Text>
            </View>
        </View>
    );
};

export default LabTestCTA;
