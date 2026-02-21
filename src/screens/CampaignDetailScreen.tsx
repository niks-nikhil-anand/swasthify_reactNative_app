import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions, SafeAreaView, Linking, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { MapPin, Navigation, ExternalLink, Calendar, Clock, Award, Sparkles, ChevronLeft, Share2, Info, Shield, CheckCircle } from 'lucide-react-native';
import { publicService, Campaign } from '../services/publicService';
import CampaignDetailSkeleton from '../components/CampaignDetailSkeleton';
import BookingModal from '../components/BookingModal';


const { width } = Dimensions.get('window');

const CampaignDetailScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params;

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookingVisible, setBookingVisible] = useState(false);


    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await publicService.getCampaignById(id);
                setCampaign(data);
            } catch (err: any) {
                setError(err.toString());
            } finally {
                // Keep loading for at least 800ms for smooth skeleton transition
                setTimeout(() => {
                    setLoading(false);
                }, 800);
            }
        };
        fetchDetail();
    }, [id]);

    const getDirections = () => {
        if (!campaign?.location) return;
        const { latitude, longitude, address, city, state } = campaign.location;
        let url = '';

        if (latitude && longitude) {
            if (Platform.OS === 'ios') {
                url = `http://maps.apple.com/?daddr=${latitude},${longitude}`;
            } else {
                url = `google.navigation:q=${latitude},${longitude}`;
            }
        } else {
            const fullAddress = `${address}, ${city}, ${state}`;
            url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
        }

        if (url) Linking.openURL(url);
    };

    const openMaps = () => {
        if (!campaign?.location) return;
        const { latitude, longitude, address, city, state } = campaign.location;
        let url = '';

        if (latitude && longitude) {
            if (Platform.OS === 'ios') {
                url = `http://maps.apple.com/?ll=${latitude},${longitude}`;
            } else {
                url = `geo:${latitude},${longitude}`;
            }
        } else {
            const fullAddress = `${address}, ${city}, ${state}`;
            url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
        }

        if (url) Linking.openURL(url);
    };

    if (loading) {
        return <CampaignDetailSkeleton />;
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
                {campaign.source === 'doctor' && campaign.doctor && (
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
                                    <Text className="text-2xl font-black text-zinc-900 dark:text-white">Dr. {campaign.doctor?.user?.name || 'Specialist'}</Text>
                                    <Text className="text-xs font-black uppercase text-emerald-600 tracking-wider mt-1">
                                        {campaign.doctor?.specializations?.map(s => s.name).join(", ") || 'General Practice'}
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

                {/* Lab Section */}
                {campaign.source === 'lab' && campaign.lab && (
                    <View className="px-6 mb-8">
                        <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Laboratory details</Text>
                        <View className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                            <View className="flex-row items-center mb-8">
                                <View className="relative">
                                    <View className="w-24 h-24 rounded-[2rem] bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-800 shadow-2xl">
                                        {campaign.image || campaign.lab.profilePhoto ? (
                                            <Image
                                                source={{ uri: campaign.image || campaign.lab.profilePhoto }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <Feather name="activity" size={32} color="#10B981" />
                                        )}
                                    </View>
                                    <View className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-2 border-4 border-white dark:border-zinc-900 shadow-sm">
                                        <Feather name="flask-conical" size={14} color="white" />
                                    </View>
                                </View>
                                <View className="flex-1 ml-6">
                                    <Text className="text-2xl font-black text-zinc-900 dark:text-white">{campaign.lab?.user?.name || 'Diagnostic Center'}</Text>
                                    <Text className="text-xs font-black uppercase text-emerald-600 tracking-wider mt-1">Certified Diagnostic Center</Text>
                                    <View className="flex-row items-center mt-3 bg-emerald-50 dark:bg-emerald-900/20 self-start px-3 py-1.5 rounded-xl border border-emerald-500/10">
                                        <Feather name="clock" size={12} color="#10B981" className="mr-2" />
                                        <Text className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                                            Report in {campaign.reportTime || "24-48 Hours"}
                                        </Text>
                                    </View>
                                    {campaign.isFreeHomeSampleCollection && (
                                        <View className="flex-row items-center mt-2 bg-blue-50 dark:bg-blue-900/20 self-start px-3 py-1.5 rounded-xl border border-blue-500/10">
                                            <Feather name="home" size={12} color="#3B82F6" className="mr-2" />
                                            <Text className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">
                                                Free Home Sample Collection
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <View className="space-y-6">
                                {campaign.testsIncluded && campaign.testsIncluded.length > 0 && (
                                    <View className="mb-6">
                                        <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Tests Included ({campaign.testsIncluded.length})</Text>
                                        <View className="flex-row flex-wrap gap-2">
                                            {campaign.testsIncluded.map((test, index) => (
                                                <View key={index} className="bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-100 dark:border-zinc-700">
                                                    <Text className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{test}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}
                                <View>
                                    <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">About this Lab</Text>
                                    <Text className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                        {campaign.lab.description || "A state-of-the-art diagnostic facility committed to accurate results and timely reporting for all your healthcare needs."}
                                    </Text>
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
                                    {Array.isArray(campaign.schedule) && campaign.schedule.length > 0
                                        ? `${campaign.schedule[0].startTime} - ${campaign.schedule[0].endTime}`
                                        : "Flexible"}
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
                                const scheduleItem = Array.isArray(campaign.schedule) ? campaign.schedule[0] : null;
                                const isActive = scheduleItem?.days?.includes(day);
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

                {/* Unified Venue & Map Section */}
                <View className="px-6 mb-32">
                    <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Venue & Location</Text>
                    <View className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                        {/* Card Header */}
                        <View className="px-8 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex-row items-center">
                            <MapPin size={20} color="#10B981" className="mr-3" />
                            <Text className="text-lg font-black text-zinc-900 dark:text-white">Venue Location</Text>
                        </View>

                        <View className="p-8">
                            <View className="flex-col">
                                <View className="mb-8">
                                    <Text className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                                        {campaign.source === 'lab' ? (campaign.lab?.user?.name || 'Diagnostic Center') : (campaign.doctor?.clinicName || campaign.doctor?.hospitalName || "Medical Center")}
                                    </Text>
                                    <Text className="text-sm font-medium text-zinc-500 leading-relaxed mb-1">
                                        {campaign.location?.address}
                                    </Text>
                                    <Text className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                                        {campaign.location?.city}, {campaign.location?.district ? `${campaign.location.district}, ` : ''}{campaign.location?.state} - {campaign.location?.pincode}
                                    </Text>
                                </View>

                                {/* Get Directions Button */}
                                <TouchableOpacity
                                    onPress={getDirections}
                                    className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 h-14 rounded-2xl flex-row items-center justify-center mb-8 px-6 self-start shadow-sm"
                                >
                                    <Navigation size={18} color="#10B981" className="mr-3" />
                                    <Text className="text-zinc-900 dark:text-white font-black text-xs uppercase tracking-widest">Get Directions</Text>
                                </TouchableOpacity>

                                {/* Map Visualization - Mini Map Preview */}
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={openMaps}
                                    className="w-full h-56 bg-zinc-100 dark:bg-zinc-800 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-700 overflow-hidden relative shadow-inner"
                                >
                                    {/* Simulated Map Background with Grid/Streets */}
                                    <View className="absolute inset-0 bg-emerald-500/5 items-center justify-center">
                                        {/* Decorative "Road" Lines */}
                                        <View className="absolute top-1/4 left-0 right-0 h-2 bg-zinc-200/50 dark:bg-zinc-700/50 rotate-3" />
                                        <View className="absolute top-1/2 left-0 right-0 h-4 bg-zinc-200/50 dark:bg-zinc-700/50 -rotate-6" />
                                        <View className="absolute bottom-1/4 left-0 right-0 h-2 bg-zinc-200/50 dark:bg-zinc-700/50 rotate-12" />
                                        <View className="absolute left-1/4 top-0 bottom-0 w-3 bg-zinc-200/50 dark:bg-zinc-700/50 rotate-6" />
                                        <View className="absolute left-1/2 top-0 bottom-0 w-6 bg-zinc-200/50 dark:bg-zinc-700/50 -rotate-3" />

                                        {/* The Center Pin */}
                                        <View className="items-center justify-center">
                                            <View className="w-24 h-24 bg-emerald-500/10 rounded-full items-center justify-center">
                                                <View className="w-12 h-12 bg-emerald-500 rounded-full items-center justify-center shadow-xl shadow-emerald-500/40 border-4 border-white dark:border-zinc-900">
                                                    <MapPin size={24} color="white" />
                                                </View>
                                            </View>
                                            <View className="mt-2 bg-zinc-900/80 dark:bg-white px-3 py-1 rounded-full backdrop-blur-md">
                                                <Text className="text-white dark:text-zinc-900 text-[10px] font-black uppercase tracking-widest">You are here</Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Interactive Hover Indicators */}
                                    <View className="absolute inset-0 bg-black/0 active:bg-black/5 flex items-center justify-center">
                                        <View className="bg-white/90 dark:bg-zinc-900/90 px-6 py-3 rounded-2xl flex-row items-center border border-zinc-100 dark:border-zinc-800">
                                            <ExternalLink size={14} color="#10B981" className="mr-2" />
                                            <Text className="text-[10px] font-black uppercase tracking-widest text-[#10B981]">View in Maps</Text>
                                        </View>
                                    </View>

                                    {/* Map Interactive Indicator */}
                                    <View className="absolute bottom-4 right-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-3 rounded-full border border-zinc-100 dark:border-zinc-800">
                                        <ExternalLink size={16} color="#10B981" />
                                    </View>
                                </TouchableOpacity>
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
                    <TouchableOpacity
                        className="bg-zinc-900 dark:bg-emerald-600 h-16 px-10 rounded-[2rem] flex-row items-center justify-center shadow-xl shadow-zinc-900/20 dark:shadow-emerald-900/40"
                        onPress={() => setBookingVisible(true)}
                    >
                        <Text className="text-white font-black uppercase tracking-widest text-sm mr-2">Book Now</Text>
                        <Feather name="arrow-right" size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {campaign && (
                <BookingModal
                    visible={bookingVisible}
                    onClose={() => setBookingVisible(false)}
                    campaign={campaign}
                />
            )}
        </SafeAreaView>
    );
};

export default CampaignDetailScreen;
