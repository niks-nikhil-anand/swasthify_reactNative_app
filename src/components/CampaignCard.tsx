import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Campaign } from '../services/publicService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

interface CampaignCardProps {
    campaign: Campaign;
    onPress?: () => void;
    fullWidth?: boolean;
}

const CampaignCard = ({ campaign, onPress, fullWidth = false }: CampaignCardProps) => {
    const navigation = useNavigation<any>();

    const discountedPrice = campaign.discountPercentage > 0
        ? Math.round(campaign.price - (campaign.price * campaign.discountPercentage) / 100)
        : campaign.price;

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            navigation.navigate('CampaignDetail', { id: campaign.id || campaign._id });
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={handlePress}
            style={fullWidth ? { width: '100%' } : { width: CARD_WIDTH }}
            className={`bg-zinc-50/90 dark:bg-zinc-900/90 rounded-[32px] overflow-hidden border border-emerald-500/10 shadow-2xl shadow-black/5 flex-col ${!fullWidth ? 'mr-4' : 'mb-4'}`}
        >
            {/* Header Content */}
            <View className="p-6 pb-2">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center flex-1 mr-2 flex-wrap">
                        <View className="border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 rounded-full border mr-2 mb-1">
                            <View className="flex-row items-center">
                                <Feather name="zap" size={10} color="#10B981" />
                                <Text className="ml-1 text-emerald-600 dark:text-emerald-400 uppercase text-[9px] font-black tracking-widest">
                                    {campaign.type?.replace('_', ' ') || 'HEALTHCARE'}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row items-center mb-1">
                            <Feather name="clock" size={12} color="#10B981" />
                            <Text className="ml-1 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                                Fast Booking
                            </Text>
                        </View>
                    </View>

                    {/* Verification Badge */}
                    {campaign.isVerified && (
                        <View className="bg-emerald-500/10 p-1 rounded-full border border-emerald-500/20">
                            <Feather name="check-circle" size={12} color="#10B981" />
                        </View>
                    )}
                </View>

                <Text className="text-xl font-black text-zinc-900 dark:text-white leading-tight mb-3" numberOfLines={2}>
                    {campaign.name || campaign.title}
                </Text>

                <View className="flex-row items-center">
                    <View className="bg-emerald-500/10 p-1.5 rounded-lg mr-2">
                        <Feather name="map-pin" size={12} color="#059669" />
                    </View>
                    <Text className="text-[10px] font-extrabold uppercase tracking-wide text-zinc-500 opacity-80" numberOfLines={1}>
                        {campaign.location?.city || "Visit Clinic"} • {campaign.location?.address}
                    </Text>
                </View>
            </View>

            {/* Description */}
            <View className="px-6 py-2 border-l-2 border-emerald-500/10 ml-6 mb-4">
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 font-medium italic opacity-70" numberOfLines={3}>
                    "{campaign.description}"
                </Text>
            </View>

            {/* Doctor/Lab specific info line */}
            {campaign.source === 'doctor' && campaign.doctor && (
                <View className="px-6 mb-4">
                    <Text className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                        {campaign.doctor.specializations?.map(s => s.name).join(", ") || "Specialist Consultant"}
                    </Text>
                </View>
            )}

            {/* Footer / Booking Bar */}
            <View className="px-5 pb-6">
                <View className="bg-white dark:bg-zinc-900 p-4 rounded-3xl flex-row items-center justify-between border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/5">
                    <View className="flex-row items-center flex-1 mr-2">
                        {/* Profile Image (Doctor or Lab) next to Price */}
                        <View className="relative mr-3">
                            <View className="w-11 h-11 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-zinc-800">
                                {campaign.source === 'doctor' ? (
                                    campaign.image || campaign.doctor?.profilePhoto ? (
                                        <Image
                                            source={{ uri: campaign.image || campaign.doctor?.profilePhoto }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Feather name="user" size={18} color="#10B981" />
                                    )
                                ) : (
                                    campaign.image || campaign.lab?.profilePhoto ? (
                                        <Image
                                            source={{ uri: campaign.image || campaign.lab?.profilePhoto }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Feather name="activity" size={18} color="#10B981" />
                                    )
                                )}
                            </View>
                            {campaign.source === 'doctor' && (
                                <View className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full p-0.5 border-2 border-white dark:border-zinc-900 shadow-sm">
                                    <Feather name="activity" size={6} color="white" />
                                </View>
                            )}
                        </View>

                        <View className="flex-1">
                            <Text className="text-[8px] text-zinc-400 uppercase font-black tracking-[0.1em] mb-0.5" numberOfLines={1}>Consultation</Text>
                            <View className="flex-row items-baseline">
                                <Text className="text-lg font-black text-zinc-900 dark:text-white" numberOfLines={1}>
                                    {campaign.price === 0 ? "FREE" : `₹${discountedPrice}`}
                                </Text>
                                {campaign.discountPercentage > 0 && (
                                    <Text className="text-[10px] text-zinc-400 line-through font-bold ml-1.5" numberOfLines={1}>
                                        ₹{campaign.price}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-zinc-900 dark:bg-emerald-600 px-4 h-10 rounded-xl flex-row items-center justify-center"
                        onPress={handlePress}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-black text-[10px] uppercase tracking-widest mr-2">Book Now</Text>
                        <Feather name="zap" size={12} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default CampaignCard;
