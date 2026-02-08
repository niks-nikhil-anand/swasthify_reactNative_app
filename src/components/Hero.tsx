import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const Hero = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View className="flex-1 items-center justify-center p-6 bg-blue-50">
            <Text className="text-4xl font-extrabold text-gray-900 text-center mb-4">
                Your Health, Our Priority
            </Text>
            <Text className="text-lg text-gray-600 text-center mb-8">
                Book appointments, consult with top doctors, and manage your health seamlessly.
            </Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                className="bg-blue-600 px-8 py-3 rounded-full shadow-lg"
            >
                <Text className="text-white text-lg font-bold">Get Started</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Hero;
