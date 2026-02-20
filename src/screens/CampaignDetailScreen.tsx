import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions, SafeAreaView, Linking, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { publicService, Campaign } from '../services/publicService';

const { width } = Dimensions.get('window');

const CampaignDetailScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params;

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await publicService.getCampaignById(id);
                setCampaign(data);
            } catch (err: any) {
                setError(err.toString());
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const getDirections = () => {
        if (!campaign?.location) return;
        const { latitude, longitude } = campaign.location;
        const daddr = `${latitude},${longitude}`;
        const url = Platform.select({
            ios: `http://maps.apple.com/?daddr=${daddr}`,
            android: `google.navigation:q=${daddr}`,
            default: `https://www.google.com/maps/dir/?api=1&destination=${daddr}`
        });
        if (url) Linking.openURL(url);
    };

    const openMaps = () => {
        if (!campaign?.location) return;
        const { latitude, longitude } = campaign.location;
        const label = campaign.name || campaign.title;
        const url = Platform.select({
            ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
            android: `geo:0,0?q=${latitude},${longitude}(${label})`,
            default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
        });
        if (url) Linking.openURL(url);
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-950">
                <ActivityIndicator size="large" color="#10B981" />
                <Text className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Loading health service...</Text>
            </View>
        );
    }

    if (error || !campaign) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-950 px-6">
                <Feather name="alert-circle" size={48} color="#EF4444" className="mb-4" />
                <Text className="text-xl font-black text-zinc-900 dark:text-white text-center mb-2">Oops! Something went wrong</Text>
                <Text className="text-zinc-500 text-center mb-8">{error || "Campaign not found"}</Text>
                <TouchableOpacity
                    className="bg-emerald-500 px-8 py-4 rounded-2xl shadow-lg shadow-emerald-500/20"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-white font-black uppercase tracking-widest">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const discountedPrice = campaign.discountPercentage > 0
        ? Math.round(campaign.price - (campaign.price * campaign.discountPercentage) / 100)
        : campaign.price;

    return (
        <SafeAreaView className="flex-1 bg-zinc-50 dark:bg-zinc-950">
            {/* Custom Header */}
            <View className="px-6 py-4 flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <Feather name="chevron-left" size={24} color="#10B981" />
                </TouchableOpacity>
                <Text className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">Service Details</Text>
                <TouchableOpacity className="p-2 -mr-2">
                    <Feather name="share-2" size={20} color="#10B981" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View className="p-6">
                    <View className="bg-emerald-500/5 dark:bg-emerald-500/10 self-start px-4 py-2 rounded-full border border-emerald-500/20 mb-6">
                        <View className="flex-row items-center">
                            <Feather name="sparkles" size={12} color="#10B981" className="mr-2" />
                            <Text className="text-emerald-600 dark:text-emerald-400 font-black uppercase text-[10px] tracking-widest">
                                Premium {campaign.type.replace('_', ' ')}
                            </Text>
                        </View>
                    </View>

                    <Text className="text-3xl font-black text-zinc-900 dark:text-white leading-[1.1] mb-4">
                        {campaign.name || campaign.title}
                    </Text>

                    <View className="flex-row items-center mb-6">
                        <View className="bg-emerald-500/10 p-2 rounded-xl mr-3">
                            <Feather name="check-circle" size={16} color="#059669" />
                        </View>
                        <View>
                            <Text className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Verified Service</Text>
                            <Text className="text-xs text-zinc-500 font-bold">Trusted Healthcare Provider</Text>
                        </View>
                    </View>

                    <View className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <Text className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium italic opacity-80">
                            "{campaign.description}"
                        </Text>
                    </View>
                </View>

                {/* Doctor Section */}
                {campaign.doctor && (
                    <View className="px-6 mb-8">
                        <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Consulting specialist</Text>
                        <View className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                            <View className="flex-row items-center mb-6">
                                <View className="relative">
                                    <View className="w-20 h-20 rounded-3xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-zinc-50 dark:border-zinc-800 shadow-xl">
                                        {campaign.doctor.profilePhoto ? (
                                            <Image
                                                source={{ uri: campaign.doctor.profilePhoto }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <Feather name="user" size={32} color="#10B981" />
                                        )}
                                    </View>
                                    <View className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 border-4 border-white dark:border-zinc-900">
                                        <Feather name="activity" size={12} color="white" />
                                    </View>
                                </View>
                                <View className="flex-1 ml-5">
                                    <Text className="text-xl font-black text-zinc-900 dark:text-white">Dr. {campaign.doctor.user.name}</Text>
                                    <View className="flex-row items-center mt-1">
                                        <Text className="text-xs font-black uppercase text-emerald-600 tracking-wider">
                                            {campaign.doctor.specializations.map(s => s.name).join(", ")}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center mt-2 bg-emerald-50 dark:bg-emerald-900/20 self-start px-2 py-1 rounded-lg">
                                        <Feather name="award" size={10} color="#10B981" className="mr-1" />
                                        <Text className="text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                                            {campaign.doctor.experienceYears}+ Years Exp.
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
                                <View className="flex-row items-center mb-4">
                                    <View className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 items-center justify-center mr-3">
                                        <Feather name="book-open" size={14} color="#6B7280" />
                                    </View>
                                    <View>
                                        <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Qualification</Text>
                                        <Text className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{campaign.doctor.qualification}</Text>
                                    </View>
                                </View>
                                <View className="flex-row items-center">
                                    <View className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 items-center justify-center mr-3">
                                        <Feather name="home" size={14} color="#6B7280" />
                                    </View>
                                    <View>
                                        <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Clinic / Hospital</Text>
                                        <Text className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{campaign.doctor.clinicName || campaign.doctor.hospitalName || "Partner Facility"}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* Location & Schedule Card */}
                <View className="px-6 mb-8">
                    <View className="flex-col space-y-4">
                        <View className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-row items-center">
                                    <Feather name="map-pin" size={20} color="#10B981" className="mr-3" />
                                    <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Location Details</Text>
                                </View>
                                <TouchableOpacity onPress={openMaps} className="bg-zinc-50 dark:bg-zinc-800 py-2 px-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                    <Feather name="external-link" size={14} color="#10B981" />
                                </TouchableOpacity>
                            </View>

                            <Text className="text-xl font-black text-zinc-900 dark:text-white mb-2">{campaign.location?.city}</Text>
                            <Text className="text-sm font-medium text-zinc-500 mb-6">{campaign.location?.address}</Text>

                            <View className="flex-row items-center justify-between border-t border-zinc-50 dark:border-zinc-800 pt-6">
                                <View>
                                    <Text className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Coordinates</Text>
                                    <Text className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400">
                                        {campaign.location?.latitude?.toFixed(6) || '0.000000'}, {campaign.location?.longitude?.toFixed(6) || '0.000000'}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={getDirections}
                                    className="bg-emerald-500 px-5 py-3 rounded-2xl flex-row items-center shadow-lg shadow-emerald-500/20"
                                >
                                    <Text className="text-white font-black text-[10px] uppercase tracking-widest mr-2">Get Directions</Text>
                                    <Feather name="navigation" size={12} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                            <View className="flex-row items-center mb-6">
                                <Feather name="calendar" size={20} color="#10B981" className="mr-3" />
                                <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Consultation Schedule</Text>
                            </View>

                            <View className="flex-row flex-wrap gap-2 mb-6">
                                {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => {
                                    const isActive = campaign.schedule?.days.includes(day);
                                    return (
                                        <View
                                            key={day}
                                            className={`px-3 py-2 rounded-xl border ${isActive ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 opacity-40'}`}
                                        >
                                            <Text className={`text-[9px] font-black uppercase ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}`}>
                                                {day.substring(0, 3)}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>

                            <View className="flex-row items-center justify-between border-t border-zinc-50 dark:border-zinc-800 pt-6">
                                <View>
                                    <Text className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Timing</Text>
                                    <Text className="text-sm font-black text-zinc-900 dark:text-white">
                                        {campaign.schedule?.startTime} - {campaign.schedule?.endTime}
                                    </Text>
                                </View>
                                <View className="bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-xl">
                                    <Text className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">UTC Timezone</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Booking Information */}
                <View className="px-6 mb-32">
                    <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Enter booking details</Text>
                    <View className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-emerald-500/10 shadow-sm">
                        <Text className="text-xl font-black text-zinc-900 dark:text-white mb-2">Patient Information</Text>
                        <Text className="text-xs text-zinc-500 mb-8 font-medium">Please provide the following details of the patient seeking consultation.</Text>

                        <View className="space-y-6">
                            {campaign.requiredDetails?.map((detail, index) => (
                                <View key={index} className="space-y-2">
                                    <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{detail} *</Text>
                                    <View className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 h-14 rounded-2xl px-5 flex-row items-center">
                                        <Text className="text-zinc-300 dark:text-zinc-600 text-sm">Enter {detail.toLowerCase()}...</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <View className="mt-10 p-5 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/10 flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center mr-4">
                                <Feather name="shield" size={18} color="#059669" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-[11px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest leading-tight">Secure Booking</Text>
                                <Text className="text-[9px] text-zinc-500 mt-0.5">Your data is encrypted and only shared with the healthcare provider.</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Booking Bar */}
            <View className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-900">
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Payable</Text>
                        <View className="flex-row items-baseline space-x-2">
                            <Text className="text-3xl font-black text-zinc-900 dark:text-white tabular-nums">
                                {campaign.price === 0 ? "FREE" : `₹${discountedPrice}`}
                            </Text>
                            {campaign.discountPercentage > 0 && (
                                <Text className="text-sm font-bold text-zinc-400 line-through">₹{campaign.price}</Text>
                            )}
                        </View>
                        <Text className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Incl. of all taxes</Text>
                    </View>
                    <TouchableOpacity className="bg-zinc-900 dark:bg-emerald-600 h-16 px-10 rounded-[2rem] flex-row items-center justify-center shadow-xl shadow-zinc-900/20 dark:shadow-emerald-900/40">
                        <Text className="text-white font-black uppercase tracking-widest text-sm mr-2">Book Now</Text>
                        <Feather name="arrow-right" size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default CampaignDetailScreen;
