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
                className="bg-[#E7FAF2] rounded-[32px] overflow-hidden shadow-sm border border-[#D1F2E2] flex-row items-center p-6"
                style={{ elevation: 2 }}
            >
                <View className="flex-1 pr-4">
                    <View className="bg-[#0DA96E]/10 self-start px-2 py-1 rounded-md mb-2">
                        <Text className="text-[#0DA96E] text-[10px] font-bold tracking-wider uppercase">
                            Expert Consultation
                        </Text>
                    </View>
                    <Text className="text-xl font-bold text-[#111827] mb-1">
                        Need a Doctor?
                    </Text>
                    <Text className="text-[#4B5563] text-[10px] leading-4 mb-4">
                        Book an appointment for an in-clinic consultation with top specialists near you.
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Contact')}
                        className="bg-[#0DA96E] self-start px-6 py-2.5 rounded-xl shadow-sm"
                        style={{ elevation: 1 }}
                    >
                        <Text className="text-white font-bold text-xs">Book Now</Text>
                    </TouchableOpacity>
                </View>

                <View className="w-28 h-28 bg-white rounded-3xl items-center justify-center border border-gray-100 shadow-sm overflow-hidden">
                    <Image
                        source={require('../../public/images/cta/appointment_realistic.png')}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
            </View>
        </View>
    );
};

export default BookAppointmentCTA;
