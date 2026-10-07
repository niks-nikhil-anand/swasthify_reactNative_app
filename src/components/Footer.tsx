import React from 'react';
import { View, Text } from 'react-native';

const Footer = () => {
    return (
        <View className="bg-[#F7FBF9] dark:bg-zinc-950 px-6 py-8 items-center mt-auto border-t border-[#D9F3E8] dark:border-zinc-900">
            <Text className="text-[#0DA96E] dark:text-[#10B981] text-lg font-bold mb-2">Swasthify</Text>
            <Text className="text-gray-500 dark:text-zinc-500 text-sm text-center leading-5 mb-3">
                Empowering seamless access to trusted doctors, diagnostics, and secure digital health records.
            </Text>
            <Text className="text-gray-500 dark:text-zinc-500 text-xs">© 2026 Swasthify. All rights reserved.</Text>
        </View>
    );
};

export default Footer;
