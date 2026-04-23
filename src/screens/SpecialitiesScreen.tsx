import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootDrawerParamList } from '../navigation/types';
import Feather from 'react-native-vector-icons/Feather';
import apiClient from '../api/apiClient';

const { width } = Dimensions.get('window');

interface Speciality {
    id: string;
    title: string;
    price: string;
    image: string;
    color: string;
    type: string;
}

const SpecialitiesScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootDrawerParamList>>();
    const [specialities, setSpecialities] = useState<Speciality[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpecialities = async () => {
            try {
                // Fetch up to 50 specialities as per requirements
                const response = await apiClient.get('/api/public/specializations?limit=50&type=DOCTOR');
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
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex-row items-center">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-gray-50 dark:bg-slate-800"
                >
                    <Feather name="chevron-left" size={24} color="#111827" />
                </TouchableOpacity>
                <Text className="ml-4 text-xl font-bold text-[#111827] dark:text-white">
                    All Specialities
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
            >
                <View className="mb-8">
                    <Text className="text-2xl font-black text-[#111827] dark:text-white mb-2">
                        Find the Right Specialist
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Access top-tier healthcare across 25+ specialities. Expert doctors, seamless digital consultations.
                    </Text>
                </View>

                {loading ? (
                    <View className="py-20 items-center justify-center">
                        <ActivityIndicator size="large" color="#0DA96E" />
                        <Text className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Loading Specialities...</Text>
                    </View>
                ) : (
                    <View className="flex-row flex-wrap -mx-2">
                        {specialities.map((spec, index) => {
                            const rawImage = spec.image || '';
                            const baseUrl = rawImage.startsWith('http')
                                ? rawImage
                                : `https://www.swasthify.in${rawImage}`;
                            const imageUri = encodeURI(baseUrl);

                            return (
                                <View key={spec.id ?? index} className="w-1/3 px-2 mb-8">
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Doctors')}
                                        activeOpacity={0.7}
                                        className="items-center"
                                    >
                                        <View className={`w-full aspect-square rounded-full overflow-hidden items-center justify-center p-0.5 mb-3 ${spec.color} border border-gray-100 dark:border-slate-800`}>
                                            <View className="w-full h-full rounded-full overflow-hidden">
                                                <Image
                                                    source={{ uri: imageUri }}
                                                    className="w-full h-full"
                                                    resizeMode="cover"
                                                />
                                            </View>
                                        </View>
                                        <Text className="text-[11px] font-extrabold text-[#111827] dark:text-white text-center mb-1" numberOfLines={2}>
                                            {spec.title}
                                        </Text>
                                        <Text className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold text-center">
                                            from <Text className="text-[#0DA96E] dark:text-[#48C496] font-bold">{spec.price}</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default SpecialitiesScreen;
