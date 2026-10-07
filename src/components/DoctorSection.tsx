import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { publicService, Campaign } from '../services/publicService';
import CampaignCard from './CampaignCard';
import { CampaignSectionSkeleton } from './CampaignSkeleton';
import Feather from 'react-native-vector-icons/Feather';
import {
    DOCTOR_LOCATION_CHANGED_EVENT,
    locationService,
    PATNA_LOCATION,
    SavedLocation,
} from '../services/locationService';

const HOME_DOCTOR_LIMIT = 5;

const DoctorSection = () => {
    const navigation = useNavigation<any>();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDoctors = async (location: SavedLocation, fallbackToPatna = true) => {
        setLoading(true);
        try {
            const data = await publicService.getCampaigns({
                source: 'doctor',
                limit: HOME_DOCTOR_LIMIT,
                lat: location.latitude,
                lng: location.longitude,
                radiusKm: 25,
            });

            if (fallbackToPatna && location.source === 'device' && data.length === 0) {
                const patna = await locationService.savePatnaFallback();
                await fetchDoctors(patna, false);
                return;
            }

            setCampaigns(data);
        } catch (error) {
            console.log('Error in DoctorSection:', error);
            if (fallbackToPatna && location.source === 'device') {
                const patna = await locationService.savePatnaFallback();
                await fetchDoctors(patna, false);
                return;
            }
            setCampaigns([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        const loadDoctors = async () => {
            const stored = await locationService.getSavedLocation();
            const initialLocation = stored || PATNA_LOCATION;
            if (!stored) {
                await locationService.saveLocation(initialLocation);
            }

            if (!mounted) return;
            await fetchDoctors(initialLocation, initialLocation.source === 'device');
        };

        const subscription = DeviceEventEmitter.addListener(
            DOCTOR_LOCATION_CHANGED_EVENT,
            (location: SavedLocation) => {
                fetchDoctors(location, location.source === 'device');
            }
        );

        loadDoctors();

        return () => {
            mounted = false;
            subscription.remove();
        };
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
        <View className="pt-8 pb-12 bg-transparent">
            <View className="px-4 mb-8">
                <Text className="section-heading dark:text-white leading-[1.1] mb-2">
                    Book an Appointment for{' '}
                    <Text className="section-heading-highlight bg-emerald-100 dark:bg-emerald-900/30 px-3 rounded-xl overflow-hidden">
                        In-Clinic Consultation
                    </Text>
                </Text>
                <Text className="section-description dark:text-gray-400 mt-2">
                    Find experienced doctors across all specialties for personalized in-person care.
                </Text>
            </View>

            <FlatList
                data={campaigns.slice(0, HOME_DOCTOR_LIMIT)}
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

            <View className="mt-4 items-center">
                <TouchableOpacity
                    onPress={() => navigation.navigate('Doctors')}
                    className="bg-zinc-900 dark:bg-emerald-600 rounded-full px-8 py-4 flex-row items-center"
                    style={{ elevation: 2 }}
                >
                    <Text className="text-white font-black text-xs uppercase tracking-widest mr-2">See All Doctors</Text>
                    <Feather name="arrow-right" size={15} color="#FFFFFF" />
                </TouchableOpacity>
            </View>


        </View>
    );
};

export default DoctorSection;
