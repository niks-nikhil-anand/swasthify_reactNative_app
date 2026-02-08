import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const BookAppointmentCTA = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View className="mx-4 my-6 bg-blue-600 rounded-2xl p-6 shadow-lg overflow-hidden relative">
            <View className="z-10">
                <Text className="text-white font-bold text-xl mb-2">Need a Doctor?</Text>
                <Text className="text-blue-100 mb-4 max-w-[80%]">
                    Book an appointment for an in-clinic consultation with top specialists near you.
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ContactUs')}
                    className="bg-white self-start px-6 py-2 rounded-full"
                >
                    <Text className="text-blue-600 font-bold">Book Now</Text>
                </TouchableOpacity>
            </View>

            {/* Decorative Circle */}
            <View className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500 rounded-full opacity-50" />
            <View className="absolute -right-4 -top-10 w-24 h-24 bg-blue-400 rounded-full opacity-30" />
        </View>
    );
};

export default BookAppointmentCTA;
