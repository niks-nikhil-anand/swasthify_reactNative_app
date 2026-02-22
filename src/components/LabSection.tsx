import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { publicService, Campaign } from '../services/publicService';
import CampaignCard from './CampaignCard';
import CampaignSkeleton, { CampaignSectionSkeleton } from './CampaignSkeleton';
import Feather from 'react-native-vector-icons/Feather';

const PAGE_SIZE = 4;

const LabSection = () => {
    const navigation = useNavigation<any>();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(campaigns.length / PAGE_SIZE);
    const visibleCampaigns = campaigns.slice(0, page * PAGE_SIZE);

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
                <Text className="section-heading dark:text-white leading-[1.1] mb-2">
                    Book a{' '}
                    <Text className="section-heading-highlight bg-emerald-100 dark:bg-emerald-900/30 px-3 rounded-xl overflow-hidden">
                        Lab Test
                    </Text>{' '}
                    from Home
                </Text>
                <Text className="section-description dark:text-gray-400 mt-2">
                    Get certified diagnostic services and health checkups
                </Text>
                <TouchableOpacity className="self-end border mt-3 border-gray-100 dark:border-slate-700 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800">
                                    <Text className="text-[#0DA96E] dark:text-[#48C496] font-bold text-[10px]">See All {'>'}</Text>
                                </TouchableOpacity>
            </View>

            <FlatList
                data={visibleCampaigns}
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

            {/* Pagination dots */}
            {totalPages > 1 && (
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16, gap: 6 }}>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <TouchableOpacity key={i} onPress={() => setPage(i + 1)}>
                            <View style={{
                                width: i + 1 === page ? 22 : 7,
                                height: 7,
                                borderRadius: 10,
                                backgroundColor: i + 1 === page ? '#0DA96E' : '#D1D5DB',
                            }} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Show More button */}
            {page * PAGE_SIZE < campaigns.length && (
                <View className="mt-6 items-center">
                    <TouchableOpacity
                        onPress={() => setPage(p => p + 1)}
                        className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-full px-10 py-3.5 flex-row items-center"
                        style={{ elevation: 2 }}
                    >
                        <Text className="text-[#111827] dark:text-white font-bold text-xs uppercase tracking-widest mr-2">Show More Lab Tests</Text>
                        <Feather name="chevron-down" size={14} color="#0DA96E" />
                    </TouchableOpacity>
                </View>
            )}


        </View>
    );
};

export default LabSection;
