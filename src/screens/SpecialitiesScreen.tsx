import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootDrawerParamList } from '../navigation/types';
import Feather from 'react-native-vector-icons/Feather';
import { useColorScheme } from 'nativewind';
import apiClient from '../api/apiClient';

interface Speciality {
    id: string;
    title: string;
    price: string;
    image: string;
    color: string;
    type: string;
}

const BRAND_GREEN = '#0DA96E';

const getSpecialityImageUri = (image?: string) => {
    const rawImage = image || '';
    const baseUrl = rawImage.startsWith('http') ? rawImage : `https://www.swasthify.in${rawImage}`;

    return encodeURI(baseUrl);
};

const SpecialitiesScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootDrawerParamList>>();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [specialities, setSpecialities] = useState<Speciality[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSpecialities = specialities.filter(spec =>
        spec.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    const fetchSpecialities = async () => {
        try {
            setError('');
            setLoading(true);
            const response = await apiClient.get('/api/public/specializations?limit=50&type=DOCTOR');
            setSpecialities(response.data);
        } catch (fetchError) {
            console.error('Error fetching specialities:', fetchError);
            setError('We could not load specialities right now. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpecialities();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-[#09090B]" edges={['top', 'left', 'right']}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex-row items-center">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 items-center justify-center rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800"
                    activeOpacity={0.8}
                >
                    <Feather name="chevron-left" size={24} color={isDark ? '#E5E7EB' : '#111827'} />
                </TouchableOpacity>
                <View className="ml-4 flex-1">
                    <Text className="text-xl font-black text-[#111827] dark:text-white">All Specialities</Text>
                    <Text className="text-xs font-semibold text-gray-400 dark:text-slate-500 mt-0.5">
                        {specialities.length ? `${specialities.length} care categories available` : 'Find care by category'}
                    </Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: 42 }}
            >
                <View className="mb-5">
                    <Text className="text-[28px] font-black text-[#111827] dark:text-white leading-9 mb-2">
                        Find the Right Specialist
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-6">
                        Browse expert doctors by speciality and book the care you need faster.
                    </Text>
                </View>

                <View className="h-14 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 px-4 flex-row items-center mb-5">
                    <Feather name="search" size={19} color={isDark ? '#94A3B8' : '#6B7280'} />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search specialities"
                        placeholderTextColor={isDark ? '#64748B' : '#9CA3AF'}
                        className="flex-1 ml-3 text-[15px] font-semibold text-[#111827] dark:text-white"
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')} className="w-8 h-8 items-center justify-center">
                            <Feather name="x" size={18} color={isDark ? '#94A3B8' : '#6B7280'} />
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <View className="py-20 items-center justify-center">
                        <ActivityIndicator size="large" color={BRAND_GREEN} />
                        <Text className="mt-4 text-gray-500 dark:text-gray-400 font-semibold">Loading specialities...</Text>
                    </View>
                ) : error ? (
                    <View className="py-16 px-5 rounded-[24px] border border-red-100 dark:border-red-950 bg-red-50 dark:bg-red-950/20 items-center">
                        <Feather name="alert-circle" size={36} color="#EF4444" />
                        <Text className="text-base font-black text-[#111827] dark:text-white mt-4 text-center">Something went wrong</Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center leading-6 mt-2">{error}</Text>
                        <TouchableOpacity
                            onPress={fetchSpecialities}
                            activeOpacity={0.85}
                            className="mt-5 bg-[#0DA96E] rounded-xl px-5 py-3"
                        >
                            <Text className="text-white text-sm font-black">Try Again</Text>
                        </TouchableOpacity>
                    </View>
                ) : filteredSpecialities.length === 0 ? (
                    <View className="py-16 px-5 rounded-[24px] border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 items-center">
                        <Feather name="search" size={38} color={BRAND_GREEN} />
                        <Text className="text-base font-black text-[#111827] dark:text-white mt-4 text-center">No specialities found</Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center leading-6 mt-2">
                            Try a different keyword or clear your search.
                        </Text>
                        <TouchableOpacity
                            onPress={() => setSearchQuery('')}
                            activeOpacity={0.85}
                            className="mt-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-5 py-3"
                        >
                            <Text className="text-[#0DA96E] dark:text-[#48C496] text-sm font-black">Clear Search</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-sm font-black text-[#111827] dark:text-white">
                                {searchQuery ? `${filteredSpecialities.length} results` : 'Popular specialities'}
                            </Text>
                            <View className="flex-row items-center bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full">
                                <Feather name="shield" size={13} color={BRAND_GREEN} />
                                <Text className="text-[11px] font-black text-[#0DA96E] dark:text-[#48C496] ml-1.5">Verified doctors</Text>
                            </View>
                        </View>

                        <View className="flex-row flex-wrap -mx-2">
                            {filteredSpecialities.map((spec, index) => {
                                const imageUri = getSpecialityImageUri(spec.image);

                                return (
                                    <View key={spec.id ?? index} className="w-1/2 px-2 mb-4">
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('Doctors', { specialization: spec.title })}
                                            activeOpacity={0.85}
                                            className="min-h-[218px] rounded-[24px] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-4"
                                            style={{ elevation: 2 }}
                                        >
                                            <View className={`w-full aspect-square rounded-[22px] overflow-hidden items-center justify-center ${spec.color} dark:bg-opacity-20 border border-gray-100 dark:border-slate-800`}>
                                                <Image
                                                    source={{ uri: imageUri }}
                                                    className="w-full h-full"
                                                    resizeMode="cover"
                                                />
                                            </View>
                                            <Text className="text-[14px] font-black text-[#111827] dark:text-white mt-3 leading-5" numberOfLines={2}>
                                                {spec.title}
                                            </Text>
                                            <View className="mt-auto pt-3 flex-row items-center justify-between">
                                                <Text className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">
                                                    from <Text className="text-[#0DA96E] dark:text-[#48C496] font-black">{spec.price}</Text>
                                                </Text>
                                                <View className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 items-center justify-center">
                                                    <Feather name="arrow-up-right" size={16} color={BRAND_GREEN} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default SpecialitiesScreen;
