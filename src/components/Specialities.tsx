import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ImageSourcePropType } from 'react-native';

interface Speciality {
    title: string;
    price: string;
    image: ImageSourcePropType;
    color: string;
}

const SpecialityCard = ({ speciality }: { speciality: Speciality }) => (
    <View
        className="bg-white p-2.5 rounded-[20px] border border-gray-100 shadow-sm w-[31.5%] items-center mb-4"
        style={{ elevation: 2 }}
    >
        <View className={`w-16 h-16 rounded-full mb-2 overflow-hidden items-center justify-center ${speciality.color}`}>
            <Image
                source={speciality.image}
                className="w-full h-full"
                resizeMode="cover"
            />
        </View>
        <Text className="text-[10px] font-bold text-[#111827] text-center mb-0.5" numberOfLines={2}>
            {speciality.title}
        </Text>
        <Text className="text-[#6B7280] text-[8px] text-center">
            starts from <Text className="font-bold text-[#111827]">{speciality.price}</Text>
        </Text>
    </View>
);

const Specialities = () => {
    const specialities: Speciality[] = [
        {
            title: "Gynaecology",
            price: "₹599",
            image: require('../../public/images/specialities/gynaecology_real.png'),
            color: "bg-pink-50",
        },
        {
            title: "Sexology",
            price: "₹599",
            image: require('../../public/images/specialities/sexology_real.png'),
            color: "bg-indigo-50",
        },
        {
            title: "General physician",
            price: "₹499",
            image: require('../../public/images/specialities/general_physician_real.png'),
            color: "bg-blue-50",
        },
        {
            title: "Dermatology",
            price: "₹549",
            image: require('../../public/images/specialities/dermatology_real_v2.png'),
            color: "bg-teal-50",
        },
        {
            title: "Psychiatry",
            price: "₹599",
            image: require('../../public/images/specialities/psychiatry_real.png'),
            color: "bg-green-50",
        },
        {
            title: "Stomach and digestion",
            price: "₹499",
            image: require('../../public/images/specialities/stomach_digestion_real.png'),
            color: "bg-orange-50",
        },
    ];

    return (
        <View className="py-10 bg-white">
            <View className="px-4 mb-8">
                <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1 mr-2">
                        <View className="flex-row flex-wrap items-center mb-2">
                            <Text className="text-xl font-bold text-[#111827]">Wide Range of </Text>
                            <View className="bg-[#D1F2E2] px-2 py-0.5 rounded-md">
                                <Text className="text-[#0DA96E] text-xl font-bold">Medical Specialities</Text>
                            </View>
                        </View>
                        <Text className="text-[#6B7280] text-sm leading-5">
                            Access top-tier healthcare across 25+ specialities. Expert doctors, seamless digital consultations.
                        </Text>
                    </View>
                    <TouchableOpacity className="border border-gray-100 py-1.5 px-2.5 rounded-lg bg-white mt-1">
                        <Text className="text-[#0DA96E] font-bold text-[10px]">See All {'>'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-row flex-wrap justify-between px-4">
                {specialities.map((item, index) => (
                    <SpecialityCard key={index} speciality={item} />
                ))}
            </View>
        </View>
    );
};

export default Specialities;
