import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { publicService, Campaign } from '../services/publicService';
import CampaignCard from './CampaignCard';
import CampaignSkeleton, { CampaignSectionSkeleton } from './CampaignSkeleton';
import Feather from 'react-native-vector-icons/Feather';

const LabSection = () => {
    const navigation = useNavigation<any>();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLabs = async () => {
            try {
                const data = await publicService.getCampaigns({ source: 'lab', limit: 4 });
                setCampaigns(data);
            } catch (error) {
                console.log('Error in LabSection:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLabs();
    }, []);

    if (loading) {
        return <CampaignSectionSkeleton />;
    }

    if (campaigns.length === 0) {
        return (
            <View className="py-20 px-4 items-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[48px] border border-dashed border-emerald-500/20 max-w-[90%] mx-auto my-10">
                <Feather name="flask-conical" size={48} color="#10B981" className="opacity-20 mb-6" />
                <Text className="text-xl font-bold text-[#111827] dark:text-white mb-2 text-center">
                    No featured lab tests available
                </Text>
                <Text className="text-[#6B7280] dark:text-gray-400 text-center mb-8 px-8">
                    Check back later or browse all lab campaigns.
                </Text>
                <TouchableOpacity
                    className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-full px-8 py-3.5 shadow-lg shadow-emerald-500/5"
                    onPress={() => navigation.navigate('Labs')}
                >
                    <Text className="text-[#111827] dark:text-white font-extrabold text-sm uppercase tracking-widest">Browse All Labs</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="py-16 bg-muted/30">
            <View className="px-4 mb-12">
                <View className="flex-col md:flex-row justify-between items-center md:items-end gap-6">
                    <View className="space-y-3 items-center md:items-start">
                        <Text className="section-heading dark:text-white text-center md:text-left leading-[1.1]">
                            Book a{' '}
                            <Text className="section-heading-highlight bg-emerald-100 dark:bg-emerald-900/30 px-3 rounded-xl overflow-hidden">
                                Lab Test
                            </Text>{' '}
                            from Home
                        </Text>
                        <Text className="section-description dark:text-gray-400 max-w-2xl text-center md:text-left mt-4">
                            Get certified diagnostic services and health checkups
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Labs')}
                        className="flex-row items-center py-2 px-4 rounded-full bg-emerald-500/5"
                    >
                        <Text className="text-emerald-600 dark:text-emerald-400 font-black uppercase text-xs tracking-widest mr-2">See All Lab Tests</Text>
                        <Feather name="chevron-right" size={16} color="#10B981" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={campaigns}
                renderItem={({ item }) => (
                    <CampaignCard
                        campaign={item}
                        fullWidth
                        onPress={() => navigation.navigate('CampaignDetail', { id: item.id || item._id })}
                    />
                )}
                keyExtractor={(item, index) => (item._id || item.id || index).toString()}
                scrollEnabled={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
            />

            <View className="mt-12 items-center">
                <TouchableOpacity
                    onPress={() => navigation.navigate('Labs')}
                    className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-full px-12 py-4 flex-row items-center shadow-2xl shadow-emerald-500/10"
                >
                    <Text className="text-[#111827] dark:text-white font-black text-xs uppercase tracking-widest mr-3">Show more lab tests</Text>
                    <Feather name="arrow-right" size={16} color="#10B981" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LabSection;
