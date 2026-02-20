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

                    <Text className="text-3xl font-black text-zinc-900 dark:text-white leading-[1.1] mb-2">
                        {campaign.name || campaign.title}
                    </Text>

                    <View className="flex-row items-center mb-6">
                        <Feather name="check-circle" size={14} color="#059669" className="mr-2" />
                        <Text className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Verified Healthcare Service</Text>
                    </View>

                    <View className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <Text className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium italic opacity-80">
                            "{campaign.description}"
                        </Text>
                    </View>
                </View>

                {/* Doctor Section - Enhanced */}
                {campaign.doctor && (
                    <View className="px-6 mb-8">
                        <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">About the specialist</Text>
                        <View className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                            <View className="flex-row items-center mb-8">
                                <View className="relative">
                                    <View className="w-24 h-24 rounded-[2rem] bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-800 shadow-2xl">
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
                                    <View className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-2 border-4 border-white dark:border-zinc-900 shadow-sm">
                                        <Feather name="activity" size={14} color="white" />
                                    </View>
                                </View>
                                <View className="flex-1 ml-6">
                                    <Text className="text-2xl font-black text-zinc-900 dark:text-white">Dr. {campaign.doctor.user.name}</Text>
                                    <Text className="text-xs font-black uppercase text-emerald-600 tracking-wider mt-1">
                                        {campaign.doctor.specializations.map(s => s.name).join(", ")}
                                    </Text>
                                    <View className="flex-row items-center mt-3 bg-emerald-50 dark:bg-emerald-900/20 self-start px-3 py-1.5 rounded-xl border border-emerald-500/10">
                                        <Feather name="award" size={12} color="#10B981" className="mr-2" />
                                        <Text className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                                            {campaign.doctor.experienceYears}+ Years Experience
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View className="space-y-6">
                                <View>
                                    <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Professional Bio</Text>
                                    <Text className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                        {campaign.doctor.bio || "An experienced healthcare professional dedicated to providing high-quality medical services and personalized patient care."}
                                    </Text>
                                </View>

                                <View className="flex-row items-center justify-between pt-6 border-t border-zinc-50 dark:border-zinc-800">
                                    <View className="flex-1 mr-4">
                                        <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Qualification</Text>
                                        <Text className="text-sm font-bold text-zinc-800 dark:text-zinc-200" numberOfLines={1}>{campaign.doctor.qualification}</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Clinic</Text>
                                        <Text className="text-sm font-bold text-zinc-800 dark:text-zinc-200" numberOfLines={1}>{campaign.doctor.clinicName || "Private Clinic"}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* Schedule & Timing Section (Now Above Venue) */}
                <View className="px-6 mb-8">
                    <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Service schedule</Text>
                    <View className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <View className="flex-row items-center justify-between mb-8">
                            <View>
                                <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Timing</Text>
                                <Text className="text-2xl font-black text-zinc-900 dark:text-white">
                                    {campaign.schedule?.startTime} - {campaign.schedule?.endTime}
                                </Text>
                            </View>
                            <View className="bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-xl">
                                <Text className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Active Now</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Available Days</Text>
                            <Text className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">UTC Timezone</Text>
                        </View>

                        <View className="flex-row flex-wrap gap-2">
                            {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => {
                                const isActive = campaign.schedule?.days.includes(day);
                                return (
                                    <View
                                        key={day}
                                        className={`px-4 py-3 rounded-2xl border ${isActive ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 opacity-30'}`}
                                    >
                                        <Text className={`text-[10px] font-black uppercase ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                                            {day.substring(0, 3)}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {/* Venue Location Section */}
                <View className="px-6 mb-8">
                    <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Venue location</Text>
                    <View className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <View className="flex-row items-center mb-6">
                            <View className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 items-center justify-center mr-4">
                                <Feather name="map-pin" size={24} color="#10B981" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xl font-black text-zinc-900 dark:text-white">{campaign.location?.city}</Text>
                                <Text className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{campaign.location?.state}, India</Text>
                            </View>
                        </View>
                        <Text className="text-sm font-medium text-zinc-500 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            {campaign.location?.address}
                        </Text>
                    </View>
                </View>

                {/* Map & Directions Section (Below Venue) */}
                <View className="px-6 mb-32">
                    <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Navigation & Maps</Text>
                    <View className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <View className="flex-row items-center justify-between mb-8">
                            <View>
                                <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Coordinates</Text>
                                <Text className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">
                                    {campaign.location?.latitude?.toFixed(6) || '0.000000'}, {campaign.location?.longitude?.toFixed(6) || '0.000000'}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={openMaps} className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 items-center justify-center border border-zinc-100 dark:border-zinc-800">
                                <Feather name="external-link" size={20} color="#10B981" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={getDirections}
                            className="bg-zinc-900 dark:bg-zinc-800 h-16 rounded-[2rem] flex-row items-center justify-center shadow-xl shadow-zinc-900/20"
                        >
                            <Feather name="navigation" size={20} color="white" className="mr-3" />
                            <Text className="text-white font-black text-sm uppercase tracking-widest">Start Navigation</Text>
                        </TouchableOpacity>
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
