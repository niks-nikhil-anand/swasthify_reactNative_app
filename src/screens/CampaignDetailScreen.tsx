import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Linking,
    Platform,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { publicService, Campaign, PlatformFee } from '../services/publicService';
import CampaignDetailSkeleton from '../components/CampaignDetailSkeleton';
import BookingModal from '../components/BookingModal';

const BRAND_GREEN = '#0DA96E';
const { width } = Dimensions.get('window');

const formatDoctorName = (name?: string) => {
    if (!name) return 'Specialist';
    return name.toLowerCase().startsWith('dr') ? name : `Dr. ${name}`;
};

const getSource = (campaign: Campaign) => campaign.source ?? (campaign.lab ? 'lab' : 'doctor');

const getScheduleItem = (campaign: Campaign) => {
    if (Array.isArray(campaign.schedule)) return campaign.schedule[0];
    return campaign.schedule;
};

const InfoPill = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View className="w-[48.5%] bg-white dark:bg-zinc-900 rounded-xl border border-[#D9F3E8] dark:border-zinc-800 px-3.5 py-3 mb-3">
        <View className="w-8 h-8 rounded-lg bg-[#0DA96E]/10 items-center justify-center mb-2.5">
            <Feather name={icon} size={16} color={BRAND_GREEN} />
        </View>
        <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</Text>
        <Text className="text-sm font-bold text-gray-900 dark:text-white" numberOfLines={2}>{value}</Text>
    </View>
);

const TrustItem = ({ icon, title, body }: { icon: string; title: string; body: string }) => (
    <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-[#D9F3E8] dark:border-zinc-800 p-4 mb-3 flex-row items-start">
        <View className="w-10 h-10 rounded-xl bg-[#0DA96E]/10 items-center justify-center mr-4">
            <Feather name={icon} size={18} color={BRAND_GREEN} />
        </View>
        <View className="flex-1">
            <Text className="text-base font-bold text-gray-900 dark:text-white mb-1">{title}</Text>
            <Text className="text-sm text-gray-500 dark:text-zinc-400 leading-5">{body}</Text>
        </View>
    </View>
);

const GallerySection = ({ images, isLab }: { images: string[]; isLab: boolean }) => {
    const scrollRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const slideWidth = width - 32;

    const goToSlide = (index: number) => {
        if (images.length === 0) return;
        const nextIndex = (index + images.length) % images.length;
        setCurrentIndex(nextIndex);
        scrollRef.current?.scrollTo({ x: nextIndex * slideWidth, animated: true });
    };

    useEffect(() => {
        if (images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((previous) => {
                const nextIndex = (previous + 1) % images.length;
                scrollRef.current?.scrollTo({ x: nextIndex * slideWidth, animated: true });
                return nextIndex;
            });
        }, 1500);

        return () => clearInterval(timer);
    }, [images.length, slideWidth]);

    return (
        <View className="bg-[#F7FBF9] dark:bg-zinc-950 px-4 pt-4 pb-2">
            {images.length > 0 ? (
                <View className="relative">
                    <ScrollView
                        ref={scrollRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={slideWidth}
                        decelerationRate="fast"
                        onMomentumScrollEnd={(event) => {
                            const nextIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
                            setCurrentIndex(nextIndex);
                        }}
                    >
                        {images.map((uri, index) => (
                            <View key={`${uri}-${index}`} style={{ width: slideWidth }} className="pr-0">
                                <View className="h-72 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-[#D9F3E8] dark:border-zinc-800">
                                    <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
                                    <View className="absolute left-4 top-4 px-3 py-1.5 rounded-full bg-black/45">
                                        <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                                            {isLab ? 'Lab Photos' : 'Clinic Photos'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {images.length > 1 && (
                        <>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => goToSlide(currentIndex - 1)}
                                className="absolute left-3 top-[118px] w-11 h-11 rounded-full bg-black/35 items-center justify-center border border-white/20"
                            >
                                <Feather name="chevron-left" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => goToSlide(currentIndex + 1)}
                                className="absolute right-3 top-[118px] w-11 h-11 rounded-full bg-black/35 items-center justify-center border border-white/20"
                            >
                                <Feather name="chevron-right" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                            <View className="absolute bottom-4 self-center flex-row">
                                {images.map((_, dotIndex) => (
                                    <View
                                        key={dotIndex}
                                        className={`h-1.5 rounded-full mx-1 ${dotIndex === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                                    />
                                ))}
                            </View>
                        </>
                    )}
                </View>
            ) : (
            <View className="h-64 rounded-2xl bg-white dark:bg-zinc-900 border border-[#D9F3E8] dark:border-zinc-800 items-center justify-center px-8">
                <View className="w-14 h-14 rounded-2xl bg-[#0DA96E]/10 items-center justify-center mb-4">
                    <Feather name={isLab ? 'activity' : 'image'} size={24} color={BRAND_GREEN} />
                </View>
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {isLab ? 'Lab photos coming soon' : 'Clinic photos coming soon'}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-zinc-400 text-center leading-5">
                    Verified place images will appear here once the provider uploads them.
                </Text>
            </View>
            )}
        </View>
    );
};

const CampaignDetailScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params;

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookingVisible, setBookingVisible] = useState(false);
    const [platformFee, setPlatformFee] = useState<PlatformFee | null>(null);
    const [aboutExpanded, setAboutExpanded] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await publicService.getCampaignById(id);
                setCampaign(data);
                const sourceType = getSource(data).toUpperCase() as 'DOCTOR' | 'LAB';
                const feeData = await publicService.getPlatformFee(sourceType);
                setPlatformFee(feeData);
            } catch (err: any) {
                setError(err.toString());
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        };

        fetchDetail();
    }, [id]);

    const pricing = useMemo(() => {
        if (!campaign) return { discountedPrice: 0, platformDiscountAmount: 0, totalPayable: 0 };
        const discountedPrice = campaign.discountPercentage > 0
            ? Math.round(campaign.price - (campaign.price * campaign.discountPercentage) / 100)
            : campaign.price;
        const platformDiscountAmount = platformFee
            ? (platformFee.discountType === 'PERCENTAGE'
                ? Math.round((platformFee.fee * platformFee.discount) / 100)
                : platformFee.discount)
            : 0;
        const totalPayable = discountedPrice + (platformFee ? (platformFee.fee - platformDiscountAmount) : 0);
        return { discountedPrice, platformDiscountAmount, totalPayable };
    }, [campaign, platformFee]);

    const getDirections = () => {
        if (!campaign?.location) return;
        const { latitude, longitude, address, city, state } = campaign.location;
        const destination = latitude && longitude
            ? `${latitude},${longitude}`
            : `${address}, ${city}, ${state}`;
        const url = Platform.OS === 'ios'
            ? `http://maps.apple.com/?daddr=${encodeURIComponent(destination)}`
            : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
        Linking.openURL(url);
    };

    if (loading) return <CampaignDetailSkeleton />;

    if (error || !campaign) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-950 px-6">
                <Feather name="alert-circle" size={48} color="#EF4444" />
                <Text className="text-xl font-bold text-gray-900 dark:text-white text-center mt-4 mb-2">Unable to load details</Text>
                <Text className="text-gray-500 text-center mb-8">{error || 'Service not found'}</Text>
                <TouchableOpacity className="bg-[#0DA96E] px-8 py-3 rounded-xl" onPress={() => navigation.goBack()}>
                    <Text className="text-white font-bold">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const source = getSource(campaign);
    const scheduleItem = getScheduleItem(campaign);
    const isLab = source === 'lab';
    const providerName = isLab ? campaign.lab?.user?.name : formatDoctorName(campaign.doctor?.user?.name);
    const serviceName = campaign.name || campaign.title || (isLab ? 'Diagnostic Service' : campaign.doctor?.clinicName || 'Healthcare Service');
    const specialization = isLab
        ? 'Certified Diagnostic Center'
        : campaign.doctor?.specializations?.map(s => s.name).join(', ') || campaign.type?.replace('_', ' ') || 'Healthcare Specialist';
    const profileImage = isLab ? campaign.lab?.profilePhoto : campaign.doctor?.profilePhoto;
    const image = profileImage || campaign.image;
    const galleryImages = Array.from(new Set([
        ...(campaign.doctor?.clinicImages || []),
        ...(campaign.lab?.profilePhoto ? [campaign.lab.profilePhoto] : []),
        ...(campaign.image ? [campaign.image] : []),
        ...(campaign.doctor?.profilePhoto ? [campaign.doctor.profilePhoto] : []),
    ].filter(Boolean))) as string[];
    const summaryTitle = isLab ? serviceName : providerName;
    const summarySubtitle = isLab ? providerName : serviceName;
    const venueName = isLab
        ? campaign.lab?.user?.name || 'Diagnostic Center'
        : campaign.doctor?.clinicName || campaign.doctor?.hospitalName || serviceName;
    const timing = scheduleItem?.startTime && scheduleItem?.endTime ? `${scheduleItem.startTime} - ${scheduleItem.endTime}` : 'Flexible';
    const days = scheduleItem?.days?.length ? scheduleItem.days.map(day => day.slice(0, 3)).join(', ') : 'All days';
    const aboutText = campaign.description || campaign.doctor?.bio || campaign.lab?.description || 'This verified healthcare service is available through Swasthify with transparent pricing and secure booking support.';
    const serviceChips = isLab
        ? (campaign.testsIncluded?.length ? campaign.testsIncluded.slice(0, 8) : ['Digital reports', 'Quality diagnostics', 'Sample collection'])
        : (campaign.doctor?.specializations?.map(s => s.name) || ['Consultation', 'Diagnosis', 'Treatment plan']);
    const totalLabel = (campaign.price === 0 && (!platformFee || (platformFee.fee - pricing.platformDiscountAmount) === 0))
        ? 'FREE'
        : `₹${pricing.totalPayable}`;

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
            <View className="px-5 py-4 flex-row items-center justify-between border-b border-[#D9F3E8] dark:border-zinc-900 bg-white dark:bg-zinc-950">
                <TouchableOpacity
                    onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
                    className="w-10 h-10 rounded-xl bg-[#F7FBF9] dark:bg-zinc-900 items-center justify-center"
                >
                    <Feather name="chevron-left" size={22} color={BRAND_GREEN} />
                </TouchableOpacity>
                <Text className="text-base font-bold text-gray-900 dark:text-white" numberOfLines={1}>
                    {isLab ? 'Lab Details' : 'Doctor Details'}
                </Text>
                <TouchableOpacity className="w-10 h-10 rounded-xl bg-[#F7FBF9] dark:bg-zinc-900 items-center justify-center">
                    <Feather name="share-2" size={18} color={BRAND_GREEN} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 132 }}>
                <GallerySection images={galleryImages} isLab={isLab} />

                <View className="bg-[#F7FBF9] dark:bg-zinc-950 border-b border-[#D9F3E8] dark:border-zinc-900 px-4 pt-4 pb-6">
                    <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-[#D9F3E8] dark:border-zinc-800 p-4 shadow-sm">
                        <View className="flex-row">
                            <View className="w-16 h-16 rounded-xl bg-[#0DA96E]/10 overflow-hidden items-center justify-center mr-3.5">
                                {image ? (
                                    <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
                                ) : (
                                    <Feather name={isLab ? 'activity' : 'user'} size={28} color={BRAND_GREEN} />
                                )}
                            </View>
                            <View className="flex-1">
                                <View className="self-start px-3 py-1 rounded-full bg-[#0DA96E]/10 mb-1.5">
                                    <Text className="text-[#0DA96E] text-[10px] font-bold uppercase tracking-wider">
                                        {isLab ? 'Diagnostics' : `Premium ${campaign.type?.replace('_', ' ') || 'OPD'}`}
                                    </Text>
                                </View>
                                <Text className="text-[22px] font-bold text-gray-900 dark:text-white leading-tight" numberOfLines={2}>
                                    {summaryTitle}
                                </Text>
                                <Text className="text-sm font-semibold text-gray-600 dark:text-zinc-300 mt-1" numberOfLines={1}>
                                    {summarySubtitle}
                                </Text>
                                {!isLab && specialization && (
                                    <Text className="text-xs font-bold text-[#0DA96E] mt-1" numberOfLines={1}>
                                        {specialization}
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View className="flex-row items-center mt-4">
                            <Feather name="check-circle" size={16} color={BRAND_GREEN} />
                            <Text className="text-[11px] font-bold uppercase tracking-wider text-[#0DA96E] ml-2">Verified Healthcare Service</Text>
                        </View>

                        <View className="flex-row flex-wrap justify-between mt-4">
                            <InfoPill icon="award" label={isLab ? 'Report Time' : 'Experience'} value={isLab ? (campaign.reportTime || '24-48 hrs') : `${campaign.doctor?.experienceYears || 0}+ yrs`} />
                            <InfoPill icon="map-pin" label="Location" value={campaign.distanceKm ? `${campaign.distanceKm.toFixed(1)} km away` : campaign.location?.city || 'Nearby'} />
                            <InfoPill icon="clock" label="Timing" value={timing} />
                            <InfoPill icon="credit-card" label="Fee" value={totalLabel} />
                        </View>
                    </View>
                </View>

                <View className="px-4 py-8 bg-white dark:bg-zinc-950">
                    <Text className="text-sm font-bold text-[#0DA96E] uppercase tracking-wider mb-3">Pricing</Text>
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Transparent breakdown</Text>
                    <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-[#D9F3E8] dark:border-zinc-800 p-5">
                        <View className="flex-row items-center justify-between pb-3 border-b border-[#D9F3E8] dark:border-zinc-800">
                            <Text className="text-sm font-semibold text-gray-500 dark:text-zinc-400">Service fee</Text>
                            <Text className="text-base font-bold text-gray-900 dark:text-white">₹{campaign.price}</Text>
                        </View>
                        {campaign.discountPercentage > 0 && (
                            <View className="flex-row items-center justify-between py-3 border-b border-[#D9F3E8] dark:border-zinc-800">
                                <Text className="text-sm font-semibold text-gray-500 dark:text-zinc-400">Campaign discount</Text>
                                <Text className="text-base font-bold text-[#0DA96E]">-{campaign.discountPercentage}%</Text>
                            </View>
                        )}
                        {platformFee && (
                            <View className="flex-row items-center justify-between py-3 border-b border-[#D9F3E8] dark:border-zinc-800">
                                <Text className="text-sm font-semibold text-gray-500 dark:text-zinc-400">Platform fee</Text>
                                <Text className="text-base font-bold text-gray-900 dark:text-white">₹{platformFee.fee - pricing.platformDiscountAmount}</Text>
                            </View>
                        )}
                        <View className="flex-row items-center justify-between pt-4">
                            <Text className="text-base font-bold text-gray-900 dark:text-white">Total payable</Text>
                            <Text className="text-2xl font-bold text-gray-900 dark:text-white">{totalLabel}</Text>
                        </View>
                    </View>
                </View>

                <View className="px-4 py-8 bg-white dark:bg-zinc-950">
                    <Text className="text-sm font-bold text-[#0DA96E] uppercase tracking-wider mb-3">Overview</Text>
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3">About this service</Text>
                    <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-[#D9F3E8] dark:border-zinc-800 p-5">
                        <Text
                            className="text-base text-gray-600 dark:text-zinc-400 leading-7"
                            numberOfLines={aboutExpanded ? undefined : 4}
                        >
                            {aboutText}
                        </Text>
                        {aboutText.length > 180 && (
                            <TouchableOpacity className="self-start mt-4 flex-row items-center" onPress={() => setAboutExpanded(!aboutExpanded)}>
                                <Text className="text-[#0DA96E] font-bold mr-1">{aboutExpanded ? 'Read less' : 'Read more'}</Text>
                                <Feather name={aboutExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={BRAND_GREEN} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View className="px-4 py-8 bg-[#F7FBF9] dark:bg-zinc-950 border-y border-[#D9F3E8] dark:border-zinc-900">
                    <Text className="text-sm font-bold text-[#0DA96E] uppercase tracking-wider mb-3">{isLab ? 'Included Tests' : 'Specializations'}</Text>
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-5">{isLab ? 'What is covered' : 'Care focus'}</Text>
                    <View className="flex-row flex-wrap">
                        {serviceChips.map((item, index) => (
                            <View key={`${item}-${index}`} className="bg-white dark:bg-zinc-900 border border-[#D9F3E8] dark:border-zinc-800 rounded-full px-4 py-2 mr-2 mb-2">
                                <Text className="text-sm font-semibold text-gray-700 dark:text-zinc-300">{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View className="px-4 py-8 bg-white dark:bg-zinc-950">
                    <Text className="text-sm font-bold text-[#0DA96E] uppercase tracking-wider mb-3">Schedule</Text>
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Available slots</Text>
                    <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-[#D9F3E8] dark:border-zinc-800 p-5">
                        <View className="flex-row items-center justify-between mb-5">
                            <View>
                                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Timing</Text>
                                <Text className="text-xl font-bold text-gray-900 dark:text-white">{timing}</Text>
                            </View>
                            <View className="px-3 py-1.5 rounded-full bg-[#0DA96E]/10">
                                <Text className="text-[#0DA96E] text-xs font-bold">Active</Text>
                            </View>
                        </View>
                        <View className="flex-row items-start">
                            <Feather name="calendar" size={18} color={BRAND_GREEN} />
                            <Text className="text-sm font-semibold text-gray-600 dark:text-zinc-400 ml-3 flex-1">{days}</Text>
                        </View>
                    </View>
                </View>

                <View className="px-4 py-8 bg-[#F7FBF9] dark:bg-zinc-950 border-y border-[#D9F3E8] dark:border-zinc-900">
                    <Text className="text-sm font-bold text-[#0DA96E] uppercase tracking-wider mb-3">Location</Text>
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Clinic & directions</Text>
                    <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-[#D9F3E8] dark:border-zinc-800 p-5">
                        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">{venueName}</Text>
                        <Text className="text-sm text-gray-500 dark:text-zinc-400 leading-6 mb-4">
                            {campaign.location?.address || 'Address not available'}
                            {campaign.location?.city ? `, ${campaign.location.city}` : ''}
                            {campaign.location?.state ? `, ${campaign.location.state}` : ''}
                            {campaign.location?.pincode ? ` - ${campaign.location.pincode}` : ''}
                        </Text>
                        <TouchableOpacity
                            onPress={getDirections}
                            className="bg-[#0DA96E] rounded-xl py-3 px-5 self-start flex-row items-center"
                        >
                            <Feather name="navigation" size={16} color="#FFFFFF" />
                            <Text className="text-white font-bold ml-2">Get Directions</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="px-4 py-8 bg-white dark:bg-zinc-950">
                    <Text className="text-sm font-bold text-[#0DA96E] uppercase tracking-wider mb-3">Trust</Text>
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Why book with Swasthify?</Text>
                    <TrustItem icon="shield" title="Verified provider" body="Provider details are checked before being shown on Swasthify." />
                    <TrustItem icon="lock" title="Secure booking" body="Your appointment and payment journey stays protected." />
                    <TrustItem icon="file-text" title="Digital records" body="Booking information is saved for easier follow-up and future care." />
                </View>

                <View className="px-4 py-8 bg-[#F7FBF9] dark:bg-zinc-950 border-t border-[#D9F3E8] dark:border-zinc-900">
                    <Text className="text-sm font-bold text-[#0DA96E] uppercase tracking-wider mb-3">Reviews</Text>
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Patient confidence</Text>
                    <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-[#D9F3E8] dark:border-zinc-800 p-6 items-center">
                        <Feather name="star" size={28} color={BRAND_GREEN} />
                        <Text className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-2">Reviews will appear here</Text>
                        <Text className="text-sm text-gray-500 dark:text-zinc-400 text-center leading-6">
                            Patient reviews will be shown after completed appointments.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 px-5 pt-4 pb-6 bg-white/95 dark:bg-zinc-950/95 border-t border-[#D9F3E8] dark:border-zinc-900">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 mr-4">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Payable</Text>
                        <View className="flex-row items-baseline">
                            <Text className="text-3xl font-bold text-gray-900 dark:text-white">{totalLabel}</Text>
                            {campaign.discountPercentage > 0 && (
                                <Text className="text-sm font-bold text-gray-400 line-through ml-2">₹{campaign.price}</Text>
                            )}
                        </View>
                        <Text className="text-[10px] font-bold text-[#0DA96E] uppercase tracking-wider">Incl. platform fee</Text>
                    </View>
                    <TouchableOpacity
                        className="bg-[#0DA96E] h-14 px-7 rounded-2xl flex-row items-center justify-center shadow-md"
                        onPress={() => setBookingVisible(true)}
                    >
                        <Text className="text-white font-bold text-sm mr-2">Book Now</Text>
                        <Feather name="arrow-right" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <BookingModal
                visible={bookingVisible}
                onClose={() => setBookingVisible(false)}
                campaign={campaign}
            />
        </SafeAreaView>
    );
};

export default CampaignDetailScreen;
