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
            className="bg-white dark:bg-slate-800 p-2.5 rounded-[24px] border border-gray-100 dark:border-slate-700 shadow-sm w-full items-center"
            style={{ elevation: 2 }}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View className={`w-16 h-16 rounded-full mb-3 overflow-hidden items-center justify-center ${speciality.color} dark:bg-opacity-20 border border-gray-100 dark:border-slate-700`}>
                <Image
                    source={{ uri: imageUri }}
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
                {loading ? (
                    <View className="w-full py-10 items-center justify-center">
                        <ActivityIndicator size="small" color="#0DA96E" />
                    </View>
                ) : (
                    specialities.map((item, index) => (
                        <View key={item.id ?? index} className="w-1/3 p-1.5">
                            <SpecialityCard
                                speciality={item}
                                onPress={() => navigation.navigate('Doctors')}
                            />
                        </View>
                    ))
                )}
            </View>
        </View>
    );
};

export default Specialities;
