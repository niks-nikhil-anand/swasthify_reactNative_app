import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootDrawerParamList } from '../navigation/types';
import apiClient from '../api/apiClient';

interface Speciality {
    id: string;
    title: string;
    price: string;
    image: string;
    color: string;
    type: string;
}

const SpecialityCard = ({ speciality, onPress }: { speciality: Speciality, onPress?: () => void }) => {
    // Determine image URI and safely handle spaces or invalid characters in remote URLs
    const rawImage = speciality.image || '';
    const baseUrl = rawImage.startsWith('http') ? rawImage : `https://www.swasthify.in${rawImage}`;
    const imageUri = encodeURI(baseUrl);

    return (
        <TouchableOpacity
            className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-gray-100 dark:border-slate-800 shadow-sm w-full items-center"
            style={{ elevation: 3 }}
            onPress={onPress}
            activeOpacity={0.82}
        >
            <View className={`w-20 h-20 rounded-full mb-3.5 overflow-hidden items-center justify-center ${speciality.color} dark:bg-opacity-20 border border-gray-100 dark:border-slate-700`}>
                <Image
                    source={{ uri: imageUri }}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                />
            </View>
            <Text className="text-[12px] font-extrabold text-[#111827] dark:text-white text-center mb-1.5 leading-4" numberOfLines={2}>
                {speciality.title}
            </Text>
            <Text className="text-[#6B7280] dark:text-gray-400 text-[10px] text-center">
                starts from <Text className="font-bold text-[#111827] dark:text-[#48C496]">{speciality.price}</Text>
            </Text>
        </TouchableOpacity>
    );
};

const Specialities = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootDrawerParamList>>();
    const [specialities, setSpecialities] = useState<Speciality[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpecialities = async () => {
            try {
                const response = await apiClient.get('/api/public/specializations?limit=6&type=DOCTOR');
                setSpecialities(response.data);
            } catch (error) {
                console.error('Error fetching specialities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialities();
    }, []);

    return (
        <View className="py-10 bg-white dark:bg-zinc-950">
            <View className="px-5 mb-7">
                <View className="flex-row items-start justify-between gap-x-3 mb-3">
                    <View className="flex-1">
                        <Text className="section-heading dark:text-white">Wide Range of</Text>
                        <View className="self-start bg-[#D1F2E2] dark:bg-[#064E3B] px-2.5 py-1 rounded-lg mt-1">
                            <Text className="section-heading-highlight dark:text-[#48C496]">Medical Specialities</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        className="border border-gray-100 dark:border-slate-700 py-2 px-3.5 rounded-xl bg-white dark:bg-slate-900"
                        onPress={() => navigation.navigate('Specialities')}
                    >
                        <Text className="text-[#0DA96E] dark:text-[#48C496] font-bold text-[11px]">See All {'>'}</Text>
                    </TouchableOpacity>
                </View>
                <Text className="section-description dark:text-gray-400 mb-3">
                    Access top-tier healthcare across 25+ specialities. Expert doctors, seamless digital consultations.
                </Text>
            </View>

            <View className="flex-row flex-wrap px-3">
                {loading ? (
                    <View className="w-full py-10 items-center justify-center">
                        <ActivityIndicator size="small" color="#0DA96E" />
                    </View>
                ) : (
                    specialities.map((item, index) => (
                        <View key={item.id ?? index} className="w-1/2 p-2">
                            <SpecialityCard
                                speciality={item}
                                onPress={() => navigation.navigate('Doctors', { specialization: item.title })}
                            />
                        </View>
                    ))
                )}
            </View>
        </View>
    );
};

export default Specialities;
