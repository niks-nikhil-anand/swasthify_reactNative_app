import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';

const BookAppointmentCTA = () => {
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

    return (
        <View className="px-4 my-4">
            <View
                className="bg-[#E7FAF2] dark:bg-[#064E3B]/20 rounded-[32px] overflow-hidden shadow-sm border border-[#D1F2E2] dark:border-[#064E3B]/40 flex-row"
                style={{ elevation: 2, minHeight: 170 }}
            >
                {/* Left — text content */}
                <View className="flex-1 p-6 justify-center">
                    <View className="bg-[#0DA96E]/10 dark:bg-[#064E3B] self-start px-2 py-1 rounded-md mb-2">
                        <Text className="text-[#0DA96E] dark:text-[#48C496] text-[10px] font-bold tracking-wider uppercase">
                            Expert Consultation
                        </Text>
                    </View>
                    <Text className="text-xl font-bold text-[#111827] dark:text-white mb-1">
                        Need a Doctor?
                    </Text>
                    <Text className="text-[#4B5563] dark:text-gray-400 text-[10px] leading-4 mb-4">
                        Book an appointment for an in-clinic consultation with top specialists near you.
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Doctors')}
                        className="bg-[#0DA96E] self-start px-6 py-2.5 rounded-xl shadow-sm"
                        style={{ elevation: 1 }}
                    >
                        <Text className="text-white font-bold text-xs">Book Now</Text>
                    </TouchableOpacity>
                </View>

                {/* Right — full-height image */}
                <Image
                    source={require('../../public/images/cta/appointment_realistic.png')}
                    style={{ width: 140 }}
                    className="h-full"
                    resizeMode="cover"
                />
            </View>
        </View>
    );
};

export default BookAppointmentCTA;
