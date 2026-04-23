import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    Platform,
    Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import RazorpayCheckout from 'react-native-razorpay';
import { useColorScheme } from 'nativewind';
import { Campaign, publicService, PlatformFee } from '../services/publicService';
import { appointmentService } from '../services/appointmentService';

const { width, height } = Dimensions.get('window');
const BRAND_GREEN = '#22c55e';

interface BookingModalProps {
    visible: boolean;
    onClose: () => void;
    campaign: Campaign;
}

const BookingModal: React.FC<BookingModalProps> = ({ visible, onClose, campaign }) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loadingStep, setLoadingStep] = useState<'idle' | 'reserving' | 'ordering' | 'verifying'>('idle');
    const [isSuccess, setIsSuccess] = useState(false);
    const [step, setStep] = useState<'slot' | 'review'>('slot');
    const [platformFee, setPlatformFee] = useState<PlatformFee | null>(null);

    React.useEffect(() => {
        const fetchFee = async () => {
            const sourceType = (campaign.source ?? (campaign.lab ? 'lab' : 'doctor')).toUpperCase() as 'DOCTOR' | 'LAB';
            const fee = await publicService.getPlatformFee(sourceType);
            setPlatformFee(fee);
        };
        fetchFee();
    }, [campaign.source, campaign.lab]);

    const campaignDiscountAmount = useMemo(() => {
        if (!campaign.discountPercentage) return 0;
        return Math.round((campaign.price * campaign.discountPercentage) / 100);
    }, [campaign]);

    const platformDiscountAmount = useMemo(() => {
        if (!platformFee) return 0;
        if (platformFee.discountType === 'PERCENTAGE') {
            return Math.round((platformFee.fee * platformFee.discount) / 100);
        }
        return platformFee.discount;
    }, [platformFee]);

    const doctorFinalPrice = campaign.price - campaignDiscountAmount;
    const platformFinalPrice = platformFee ? (platformFee.fee - platformDiscountAmount) : 0;
    const totalPayable = doctorFinalPrice + platformFinalPrice;

    // Generate next 7 available days based on campaign schedule
    const availableDates = useMemo(() => {
        const dates = [];
        const today = new Date();
        const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

        const scheduleItem = Array.isArray(campaign.schedule) ? campaign.schedule[0] : null;
        const scheduledDays = scheduleItem?.days;
        const isFlexible = !scheduledDays || scheduledDays.length === 0;

        for (let i = 0; i < 14 && dates.length < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            const dayName = daysOfWeek[date.getDay()];

            if (isFlexible || scheduledDays!.includes(dayName)) {
                dates.push({
                    full: date.toISOString().split('T')[0],
                    day: date.getDate(),
                    month: date.toLocaleString('default', { month: 'short' }),
                    dayName: dayName.substring(0, 3),
                });
            }
        }
        return dates;
    }, [campaign.schedule]);

    // Simple time slot generator (for demonstration)
    const timeSlots = useMemo(() => {
        const scheduleItem = Array.isArray(campaign.schedule) && campaign.schedule.length > 0 ? campaign.schedule[0] : null;
        if (!scheduleItem) return [];
        const slots = [];
        const [startHour] = scheduleItem.startTime.split(':').map(Number);
        const [endHour] = scheduleItem.endTime.split(':').map(Number);

        for (let h = startHour; h < endHour; h++) {
            const hour = h > 12 ? h - 12 : h;
            const ampm = h >= 12 ? 'PM' : 'AM';
            slots.push(`${hour}:00 ${ampm} - ${hour + 1 === 13 ? 1 : hour + 1}:00 ${h + 1 >= 12 ? 'PM' : 'AM'}`);
        }
        return slots;
    }, [campaign.schedule]);

    const handleBooking = async () => {
        if (!selectedDate || !selectedSlot) {
            Alert.alert('Selection Required', 'Please select a date and time slot.');
            return;
        }

        try {
            // Step 1: Reserve
            setLoadingStep('reserving');
            const sourceType = (campaign.source ?? (campaign.lab ? 'lab' : 'doctor')).toUpperCase() as 'DOCTOR' | 'LAB';
            const appointment = await appointmentService.reserveAppointment({
                type: sourceType,
                organizerId: campaign.id || campaign._id || campaign.doctorId!,
                date: selectedDate,
                timeSlot: selectedSlot,
            });

            // Step 2: Create Order
            setLoadingStep('ordering');
            console.log('[BookingModal] appointment response:', JSON.stringify(appointment));
            const apptId =
                appointment?.id ||
                appointment?._id ||
                appointment?.appointmentId ||
                appointment?.data?.id ||
                appointment?.data?._id ||
                appointment?.appointment?.id ||
                appointment?.booking?.id;

            if (!apptId) {
                console.error('No appointment ID found in response:', appointment);
                throw new Error('Failed to retrieve appointment ID from server');
            }

            const orderData = await appointmentService.createRazorpayOrder(apptId);

            console.log('[BookingModal] orderData:', JSON.stringify(orderData));

            // Step 3: Razorpay Payment
            const options = {
                description: `Appointment with ${campaign.doctor?.user?.name || campaign.lab?.user?.name || 'Specialist'}`,
                image: 'https://www.swasthify.in/logo.png',
                currency: orderData.currency || 'INR',
                key: orderData.key,
                amount: String(orderData.amount),
                name: 'Swasthify',
                order_id: orderData.orderId || orderData.order_id,
                prefill: {
                    email: '',
                    contact: '',
                    name: '',
                },
                theme: { color: BRAND_GREEN },
            };

            RazorpayCheckout.open(options).then(async (data: any) => {
                // Step 4: Verify
                setLoadingStep('verifying');
                await appointmentService.verifyPayment({
                    appointmentId: apptId,
                    razorpay_order_id: data.razorpay_order_id,
                    razorpay_payment_id: data.razorpay_payment_id,
                    razorpay_signature: data.razorpay_signature,
                });
                setIsSuccess(true);
                setLoadingStep('idle');
            }).catch((error: any) => {
                setLoadingStep('idle');
                console.error('[Razorpay] error:', JSON.stringify(error));

                // User cancelled — silent dismiss
                if (
                    error?.code === 'PAYMENT_CANCELLED' ||
                    error?.description === 'Payment Cancelled by user'
                ) {
                    return;
                }

                // Empty error {} — typically live key on emulator, or Razorpay SDK issue
                const hasNoDetails = !error?.code && !error?.description && !error?.reason;
                if (hasNoDetails) {
                    Alert.alert(
                        'Payment Unavailable',
                        'Unable to open payment gateway. If you\'re testing on an emulator, please use a Razorpay test key (rzp_test_...). On a real device with a live key, contact support.'
                    );
                    return;
                }

                Alert.alert(
                    'Payment Failed',
                    error?.description || error?.reason || error?.error?.description || 'Something went wrong with payment.'
                );
            });

        } catch (error: any) {
            setLoadingStep('idle');
            Alert.alert('Error', error.toString());
        }
    };

    if (isSuccess) {
        return (
            <Modal visible={visible} animationType="slide" transparent>
                <View style={[styles.modalOverlay, isDark && styles.modalOverlayDark]}>
                    <View style={[styles.successContainer, isDark && styles.successContainerDark]}>
                        <View style={styles.successIcon}>
                            <Feather name="check" size={40} color="white" />
                        </View>
                        <Text style={[styles.successTitle, isDark && styles.textWhite]}>Booking Confirmed!</Text>
                        <Text style={[styles.successSubtitle, isDark && styles.textZinc400]}>
                            Your appointment with {campaign.source === 'lab' ? campaign.lab?.user?.name : `Dr. ${campaign.doctor?.user?.name}`} has been successfully booked.
                        </Text>
                        <View style={[styles.successDetails, isDark && styles.successDetailsDark]}>
                            <View style={styles.successDetailRow}>
                                <Feather name="calendar" size={16} color={isDark ? "#94A3B8" : "#6B7280"} />
                                <Text style={[styles.successDetailText, isDark && styles.textZinc200]}>{selectedDate}</Text>
                            </View>
                            <View style={styles.successDetailRow}>
                                <Feather name="clock" size={16} color={isDark ? "#94A3B8" : "#6B7280"} />
                                <Text style={[styles.successDetailText, isDark && styles.textZinc200]}>{selectedSlot}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.doneButton} onPress={onClose}>
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={[styles.modalOverlay, isDark && styles.modalOverlayDark]}>
                <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
                    {/* Header */}
                    <View style={[styles.header, isDark && styles.headerDark]}>
                        <Text style={[styles.headerTitle, isDark && styles.textWhite]}>
                            {step === 'slot' ? 'Select Slot' : 'Review Booking'}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Feather name="x" size={24} color={isDark ? "#94A3B8" : "#111827"} />
                        </TouchableOpacity>
                    </View>

                    {step === 'slot' ? (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            {/* Doctor Info Mini */}
                            <View style={[styles.doctorInfoShort, isDark && styles.doctorInfoShortDark]}>
                                <View style={[styles.doctorAvatar, isDark && styles.doctorAvatarDark]}>
                                    <Feather name={(campaign.source ?? (campaign.lab ? 'lab' : 'doctor')) === 'lab' ? "activity" : "user"} size={24} color={BRAND_GREEN} />
                                </View>
                                <View>
                                    <Text style={[styles.drName, isDark && styles.textWhite]}>
                                        {(campaign.source ?? (campaign.lab ? 'lab' : 'doctor')) === 'lab'
                                            ? campaign.lab?.user?.name
                                            : (() => {
                                                const n = campaign.doctor?.user?.name || 'Specialist';
                                                return n.toLowerCase().startsWith('dr') ? n : `Dr. ${n}`;
                                            })()}
                                    </Text>
                                    <Text style={[styles.drSpec, isDark && styles.textZinc400]}>
                                        {(campaign.source ?? (campaign.lab ? 'lab' : 'doctor')) === 'lab'
                                            ? 'Diagnostic Center'
                                            : campaign.doctor?.specializations?.map(s => s.name).join(', ') || 'Specialist'}
                                    </Text>
                                </View>
                            </View>

                            {/* Date Selection */}
                            <Text style={[styles.sectionTitle, isDark && styles.textWhite]}>Available Dates</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesGrid}>
                                {availableDates.map((item) => (
                                    <TouchableOpacity
                                        key={item.full}
                                        style={[
                                            styles.dateChip,
                                            isDark && styles.dateChipDark,
                                            selectedDate === item.full && styles.dateChipActive
                                        ]}
                                        onPress={() => setSelectedDate(item.full)}
                                    >
                                        <Text style={[styles.dayName, isDark && styles.textZinc400, selectedDate === item.full && styles.textWhite]}>{item.dayName}</Text>
                                        <Text style={[styles.dayNum, isDark && styles.textWhite, selectedDate === item.full && styles.textWhite]}>{item.day}</Text>
                                        <Text style={[styles.monthName, isDark && styles.textZinc500, selectedDate === item.full && styles.textWhite]}>{item.month}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Time Slots */}
                            <Text style={[styles.sectionTitle, isDark && styles.textWhite]}>Available Slots</Text>
                            <View style={styles.slotsGrid}>
                                {timeSlots.map((slot) => (
                                    <TouchableOpacity
                                        key={slot}
                                        style={[
                                            styles.slotChip,
                                            isDark && styles.slotChipDark,
                                            selectedSlot === slot && styles.slotChipActive
                                        ]}
                                        onPress={() => setSelectedSlot(slot)}
                                    >
                                        <Text style={[styles.slotText, isDark && styles.textZinc300, selectedSlot === slot && styles.textWhite]}>{slot}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            {/* Review Header Section */}
                            <View style={[styles.doctorInfoShort, isDark && styles.doctorInfoShortDark, { marginBottom: 24 }]}>
                                <View style={[styles.doctorAvatar, isDark && styles.doctorAvatarDark]}>
                                    <Feather name="shield" size={24} color={BRAND_GREEN} />
                                </View>
                                <View>
                                    <Text style={[styles.drName, isDark && styles.textWhite]}>Secure Booking</Text>
                                    <Text style={[styles.drSpec, isDark && styles.textZinc400]}>Review your selection & breakdown</Text>
                                </View>
                            </View>

                            {/* Booking Summary */}
                            <View className="mb-8">
                                <Text style={[styles.sectionTitle, isDark && styles.textWhite]}>Appointment Details</Text>
                                <View className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                                    <View className="flex-row items-center mb-4">
                                        <View className="w-10 h-10 rounded-xl bg-emerald-500/10 items-center justify-center mr-4">
                                            <Feather name="calendar" size={18} color={BRAND_GREEN} />
                                        </View>
                                        <View>
                                            <Text className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest">Date</Text>
                                            <Text className="text-zinc-900 dark:text-white font-bold">{selectedDate}</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row items-center">
                                        <View className="w-10 h-10 rounded-xl bg-emerald-500/10 items-center justify-center mr-4">
                                            <Feather name="clock" size={18} color={BRAND_GREEN} />
                                        </View>
                                        <View>
                                            <Text className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest">Time Slot</Text>
                                            <Text className="text-zinc-900 dark:text-white font-bold">{selectedSlot}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Fee Breakdown */}
                            <Text style={[styles.sectionTitle, isDark && styles.textWhite]}>Fee Breakdown</Text>
                            <View className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                                {/* Doctor Price */}
                                <View className="flex-row justify-between items-center mb-4">
                                    <Text className="text-zinc-600 dark:text-zinc-400 font-medium">Consultation Fee</Text>
                                    <Text className="text-zinc-900 dark:text-white font-bold">₹{campaign.price}</Text>
                                </View>

                                {/* Campaign Discount */}
                                {campaignDiscountAmount > 0 && (
                                    <View className="flex-row justify-between items-center mb-4">
                                        <Text className="text-emerald-600 font-medium">Campaign Discount</Text>
                                        <Text className="text-emerald-600 font-bold">-₹{campaignDiscountAmount}</Text>
                                    </View>
                                )}

                                {/* Divider */}
                                <View className="h-[1px] bg-zinc-200 dark:bg-zinc-800 my-2" />

                                {/* Platform Fee */}
                                <View className="flex-row justify-between items-center my-4">
                                    <Text className="text-zinc-600 dark:text-zinc-400 font-medium">Platform Fee</Text>
                                    <Text className="text-zinc-900 dark:text-white font-bold">₹{platformFee?.fee || 0}</Text>
                                </View>

                                {/* Platform Discount */}
                                {platformFee && platformFee.discount > 0 && (
                                    <View className="flex-row justify-between items-center mb-4">
                                        <Text className="text-emerald-600 font-medium">
                                            {platformFee.discountType === 'PERCENTAGE' ? `${platformFee.discount}% ` : ''}Platform Discount
                                        </Text>
                                        <Text className="text-emerald-600 font-bold">-₹{platformDiscountAmount}</Text>
                                    </View>
                                )}

                                {/* Total Divider */}
                                <View className="h-[1px] bg-zinc-200 dark:bg-zinc-800 my-2" />

                                {/* Total */}
                                <View className="flex-row justify-between items-center mt-4">
                                    <Text className="text-zinc-900 dark:text-white font-black text-lg">Total Amount</Text>
                                    <Text className="text-emerald-600 font-black text-2xl">₹{totalPayable}</Text>
                                </View>
                            </View>
                        </ScrollView>
                    )}

                    {/* Footer / Action */}
                    <View style={[styles.modalFooter, isDark && styles.modalFooterDark]}>
                        {step === 'slot' ? (
                            <>
                                <View>
                                    <Text style={[styles.footerLabel, isDark && styles.textZinc500]}>Estimated Price</Text>
                                    <Text style={[styles.footerPrice, isDark && styles.textWhite]}>₹{totalPayable}</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.confirmButton, isDark && styles.confirmButtonDark, (!selectedDate || !selectedSlot) && styles.buttonDisabled]}
                                    onPress={() => setStep('review')}
                                    disabled={!selectedDate || !selectedSlot}
                                >
                                    <Text style={styles.confirmButtonText}>Review Order</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View className="flex-row items-center w-full">
                                <TouchableOpacity
                                    className="mr-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800"
                                    onPress={() => setStep('slot')}
                                >
                                    <Feather name="arrow-left" size={24} color={isDark ? "white" : "black"} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.confirmButton, isDark && styles.confirmButtonDark, { flex: 1 }]}
                                    onPress={handleBooking}
                                    disabled={loadingStep !== 'idle'}
                                >
                                    {loadingStep !== 'idle' ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.confirmButtonText}>Pay ₹{totalPayable}</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Global Loading Overlay for Steps */}
            {loadingStep !== 'idle' && (
                <View style={[styles.loadingOverlay, isDark && styles.loadingOverlayDark]}>
                    <ActivityIndicator size="large" color={BRAND_GREEN} />
                    <Text style={[styles.loadingText, isDark && styles.textWhite]}>
                        {loadingStep === 'reserving' && 'Reserving your slot...'}
                        {loadingStep === 'ordering' && 'Initializing payment...'}
                        {loadingStep === 'verifying' && 'Finalizing appointment...'}
                    </Text>
                </View>
            )}
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalOverlayDark: {
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: height * 0.8,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    modalContentDark: {
        backgroundColor: '#09090b', // zinc-950
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerDark: {
        borderBottomColor: '#18181b', // zinc-900
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
    },
    scrollContent: {
        padding: 24,
    },
    doctorInfoShort: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 20,
    },
    doctorInfoShortDark: {
        backgroundColor: '#18181b', // zinc-900
    },
    doctorAvatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#D1F2E2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    doctorAvatarDark: {
        backgroundColor: '#064e3b', // emerald-900
    },
    drName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    drSpec: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111827',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
    },
    datesGrid: {
        paddingBottom: 24,
        gap: 12,
    },
    dateChip: {
        width: 70,
        height: 90,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dateChipDark: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
    },
    dateChipActive: {
        backgroundColor: BRAND_GREEN,
        borderColor: BRAND_GREEN,
    },
    dayName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },
    dayNum: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
        marginVertical: 2,
    },
    monthName: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    slotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    slotChip: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    slotChipDark: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
    },
    slotChipActive: {
        backgroundColor: BRAND_GREEN,
        borderColor: BRAND_GREEN,
    },
    slotText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    textWhite: {
        color: 'white',
    },
    textZinc200: {
        color: '#e4e4e7',
    },
    textZinc300: {
        color: '#d4d4d8',
    },
    textZinc400: {
        color: '#a1a1aa',
    },
    textZinc500: {
        color: '#71717a',
    },
    modalFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingHorizontal: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    modalFooterDark: {
        borderTopColor: '#18181b',
        backgroundColor: '#09090b',
    },
    footerLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },
    footerPrice: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
    },
    confirmButton: {
        backgroundColor: '#111827',
        paddingHorizontal: 32,
        height: 56,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 160,
    },
    confirmButtonDark: {
        backgroundColor: '#10b981', // emerald-500
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 16,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    loadingOverlayDark: {
        backgroundColor: 'rgba(9, 9, 11, 0.9)',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    successContainer: {
        backgroundColor: 'white',
        borderRadius: 32,
        padding: 40,
        alignItems: 'center',
        width: width * 0.85,
        alignSelf: 'center',
        marginTop: height * 0.2,
    },
    successContainerDark: {
        backgroundColor: '#09090b',
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: BRAND_GREEN,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 12,
    },
    successSubtitle: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    successDetails: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 20,
        marginBottom: 32,
    },
    successDetailsDark: {
        backgroundColor: '#18181b',
    },
    successDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    successDetailText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    doneButton: {
        backgroundColor: BRAND_GREEN,
        width: '100%',
        height: 56,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doneButtonText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 16,
    },
});

export default BookingModal;
