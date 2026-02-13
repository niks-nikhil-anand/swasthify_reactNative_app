import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

const PlaceholderScreen = ({ route }: any) => {
    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center">
            <Text className="text-2xl font-bold text-[#0DA96E]">
                {route.name} Screen
            </Text>
            <Text className="text-gray-500 mt-2">
                This feature is coming soon!
            </Text>
        </SafeAreaView>
    );
};

export default PlaceholderScreen;
