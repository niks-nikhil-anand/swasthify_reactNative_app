import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ImageSourcePropType } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootDrawerParamList } from '../navigation/types';

interface Speciality {
    title: string;
    price: string;
    image: ImageSourcePropType;
    color: string;
}

const SpecialityCard = ({ speciality, onPress }: { speciality: Speciality, onPress?: () => void }) => (
    <TouchableOpacity
        className="bg-white dark:bg-slate-800 p-2.5 rounded-[24px] border border-gray-100 dark:border-slate-700 shadow-sm w-full items-center"
        style={{ elevation: 2 }}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View className={`w-16 h-16 rounded-full mb-3 overflow-hidden items-center justify-center ${speciality.color} dark:bg-opacity-20 border border-gray-100 dark:border-slate-700`}>
            <Image
                source={speciality.image}
                className="w-full h-full rounded-full"
                resizeMode="cover"
            />
        </View>
        <Text className="text-[10px] font-extrabold text-[#111827] dark:text-white text-center mb-1" numberOfLines={2}>
            {speciality.title}
        </Text>
        <Text className="text-[#6B7280] dark:text-gray-400 text-[8px] text-center">
            starts from <Text className="font-bold text-[#111827] dark:text-[#48C496]">{speciality.price}</Text>
        </Text>
    </TouchableOpacity>
);

const Specialities = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootDrawerParamList>>();
    const specialities: Speciality[] = [
        {
            title: "Gynaecology",
            price: "₹599",
            image: require('../assets/specialities/gynaecology_real.png'),
            color: "bg-pink-50",
        },
        {
            title: "Sexology",
            price: "₹599",
            image: require('../assets/specialities/sexology_real.png'),
            color: "bg-indigo-50",
        },
        {
            title: "General physician",
            price: "₹499",
            image: require('../assets/specialities/general_physician_real.png'),
            color: "bg-blue-50",
        },
        {
            title: "Dermatology",
            price: "₹549",
            image: require('../assets/specialities/dermatology_real_v2.png'),
            color: "bg-teal-50",
        },
        {
            title: "Psychiatry",
            price: "₹599",
            image: require('../assets/specialities/psychiatry_real.png'),
            color: "bg-green-50",
        },
        {
            title: "Stomach and digestion",
            price: "₹499",
            image: require('../assets/specialities/stomach_digestion_real.png'),
            color: "bg-orange-50",
        },
    ];

    return (
        <View className="py-10 bg-white dark:bg-zinc-950">
            <View className="px-4 mb-8">
                <View className="flex-row flex-wrap items-center mb-2">
                    <Text className="section-heading dark:text-white">Wide Range of </Text>
                    <View className="bg-[#D1F2E2] dark:bg-[#064E3B] px-2 py-0.5 rounded-md">
                        <Text className="section-heading-highlight dark:text-[#48C496]">Medical Specialities</Text>
                    </View>
                </View>
                <Text className="section-description dark:text-gray-400 mb-3">
                    Access top-tier healthcare across 25+ specialities. Expert doctors, seamless digital consultations.
                </Text>
                <TouchableOpacity
                    className="self-end border border-gray-100 dark:border-slate-700 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800"
                    onPress={() => navigation.navigate('Specialities')}
                >
                    <Text className="text-[#0DA96E] dark:text-[#48C496] font-bold text-[10px]">See All {'>'}</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap px-2">
                {specialities.map((item, index) => (
                    <View key={index} className="w-1/3 p-1.5">
                        <SpecialityCard
                            speciality={item}
                            onPress={() => navigation.navigate('Doctors')}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
};

export default Specialities;
