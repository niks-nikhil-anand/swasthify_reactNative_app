import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { publicService, Campaign } from '../services/publicService';
import CampaignCard from './CampaignCard';
import CampaignSkeleton, { CampaignSectionSkeleton } from './CampaignSkeleton';
import Feather from 'react-native-vector-icons/Feather';

const DoctorSection = () => {
    const navigation = useNavigation<any>();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await publicService.getCampaigns({ source: 'doctor', limit: 3 });
                setCampaigns(data);
            } catch (error) {
                console.log('Error in DoctorSection:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) {
        return <CampaignSectionSkeleton />;
    }

    if (campaigns.length === 0) {
        return (
            <View className="py-20 px-4 items-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[48px] border border-dashed border-emerald-500/20 max-w-[90%] mx-auto my-10">
                <Feather name="activity" size={48} color="#10B981" className="opacity-20 mb-6" />
                <Text className="text-xl font-bold text-[#111827] dark:text-white mb-2 text-center">
                    No featured doctors available
                </Text>
                <Text className="text-[#6B7280] dark:text-gray-400 text-center mb-8 px-8">
                    We're currently updating our doctor listings. Check back later or browse all doctors.
                </Text>
                <TouchableOpacity
                    className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-full px-8 py-3.5 shadow-lg shadow-emerald-500/5"
                    onPress={() => navigation.navigate('Doctors')}
                >
                    <Text className="text-[#111827] dark:text-white font-extrabold text-sm uppercase tracking-widest">Browse All Doctors</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="py-16 bg-transparent">
            <View className="px-4 mb-12">
                <View className="flex-col md:flex-row justify-between items-center md:items-end gap-6">
                    <View className="space-y-3 items-center md:items-start">
                        <Text className="text-3xl md:text-5xl font-black tracking-tighter text-[#111827] dark:text-white text-center md:text-left leading-[1.1]">
                            Book an Appointment for{' '}
                            <Text className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 rounded-xl overflow-hidden">
                                In-Clinic Consultation
                            </Text>
                        </Text>
                        <Text className="text-[#6B7280] dark:text-gray-400 text-lg md:text-xl font-medium max-w-2xl text-center md:text-left mt-4">
                            Find experienced doctors across all specialties for personalized in-person care.
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Doctors')}
                        className="flex-row items-center py-2 px-4 rounded-full bg-emerald-500/5"
                    >
                        <Text className="text-emerald-600 dark:text-emerald-400 font-black uppercase text-xs tracking-widest mr-2">See All Doctors</Text>
                        <Feather name="chevron-right" size={16} color="#0DA96E" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={campaigns}
                renderItem={({ item }) => <CampaignCard campaign={item} onPress={() => navigation.navigate('CampaignDetail', { id: item.id || item._id })} />}
                keyExtractor={(item, index) => (item._id || item.id || index).toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                snapToInterval={Dimensions.get('window').width * 0.85 + 16}
                decelerationRate="fast"
            />

            <View className="mt-12 items-center">
                <TouchableOpacity
                    onPress={() => navigation.navigate('Doctors')}
                    className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-full px-12 py-4 flex-row items-center shadow-2xl shadow-emerald-500/10"
                >
                    <Text className="text-[#111827] dark:text-white font-black text-xs uppercase tracking-widest mr-3">Show more doctors</Text>
                    <Feather name="arrow-right" size={16} color="#0DA96E" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DoctorSection;
