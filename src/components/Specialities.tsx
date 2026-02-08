import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const SpecialityItem = ({ name, icon }: { name: string, icon: string }) => (
    <TouchableOpacity className="w-[23%] items-center mb-6">
        <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-2 border border-blue-100">
            <Text className="text-2xl">{icon}</Text>
        </View>
        <Text className="text-xs text-gray-700 text-center font-medium">{name}</Text>
    </TouchableOpacity>
);

const Specialities = () => {
    return (
        <View className="p-4 bg-white">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-gray-900 w-2/3">Wide Range of Medical Specialities</Text>
                <TouchableOpacity>
                    <Text className="text-blue-600 font-bold text-sm">View All</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap justify-between">
                <SpecialityItem name="Dentist" icon="🦷" />
                <SpecialityItem name="Cardiology" icon="❤️" />
                <SpecialityItem name="Pulmonology" icon="🫁" />
                <SpecialityItem name="Orthopedic" icon="🦴" />
                <SpecialityItem name="Pediatric" icon="👶" />
                <SpecialityItem name="Neurology" icon="🧠" />
                <SpecialityItem name="Dermatology" icon="🧖‍♀️" />
                <SpecialityItem name="General" icon="👨‍⚕️" />
            </View>
        </View>
    );
};

export default Specialities;
