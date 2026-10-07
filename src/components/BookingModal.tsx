import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
    Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import RazorpayCheckout from 'react-native-razorpay';
import { useColorScheme } from 'nativewind';
import { Campaign, publicService, PlatformFee, CampaignAvailability, AvailabilityReason } from '../services/publicService';
import { appointmentService } from '../services/appointmentService';

const { width, height } = Dimensions.get('window');
const BRAND_GREEN = '#22c55e';
const BRAND_RED = '#ef4444';

const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const parseDateKey = (value?: string) => {
    if (!value) return null;
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
};

const getAvailabilityMessage = (reason?: AvailabilityReason) => {
    switch (reason) {
        case 'NO_DOCTOR_AVAILABILITY':
            return 'Doctor is not available on this day.';
        case 'NO_CAMPAIGN_SCHEDULE':
            return 'Appointments are not configured for this day.';
        case 'DOCTOR_ON_LEAVE':
            return 'Doctor is on leave on this day.';
        case 'OUTSIDE_CAMPAIGN':
        case 'OUTSIDE_CAMPAIGN_SCHEDULE':
            return 'Appointments are not available on this day.';
        case 'NO_FUTURE_SLOTS':
            return 'No upcoming slots are left for this day.';
        case 'NO_SLOTS':
            return 'No appointment slots are available for this date.';
        default:
            return 'No appointment slots are available for this date.';
    }
};

const getDateAvailabilityLabel = (availability?: CampaignAvailability) => {
    if (!availability) return '';
    if (availability.available) return 'Open';
    if (availability.reason === 'DOCTOR_ON_LEAVE') return 'Leave';
    if (availability.reason === 'NO_DOCTOR_AVAILABILITY' || availability.reason === 'NO_CAMPAIGN_SCHEDULE') return 'Off';
    if (availability.reason === 'NO_FUTURE_SLOTS') return 'Done';
    return 'Full';
};

const formatProviderName = (campaign: Campaign) => {
    const source = campaign.source ?? (campaign.lab ? 'lab' : 'doctor');
    if (source === 'lab') return campaign.lab?.user?.name || 'Diagnostic Center';
    const name = campaign.doctor?.user?.name || 'Specialist';
    return name.toLowerCase().startsWith('dr') ? name : `Dr. ${name}`;
};

const formatReviewDate = (dateKey: string | null) => {
    if (!dateKey) return 'Select date';
    const date = parseDateKey(dateKey);
    if (!date) return dateKey;
    return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

type BookingResultType =
    | 'payment_failed'
    | 'payment_cancelled'
    | 'gateway_unavailable'
    | 'verification_failed'
    | 'slot_unavailable'
    | 'success';

interface BookingResult {
    type: BookingResultType;
    title: string;
    message: string;
    detail?: string;
}

const isPaymentCancelled = (error: any) => (
    error?.code === 'PAYMENT_CANCELLED' ||
    error?.description === 'Payment Cancelled by user' ||
    error?.error?.code === 'PAYMENT_CANCELLED'
);

const getFriendlyPaymentResult = (error: any): BookingResult => {
    const code = error?.code || error?.error?.code;
    const description = error?.description || error?.reason || error?.error?.description;

    if (isPaymentCancelled(error)) {
        return {
            type: 'payment_cancelled',
            title: 'Payment Cancelled',
            message: 'Your payment was cancelled and your temporary slot hold has been released.',
            detail: 'You can choose another slot or try the same slot again if it is still available.',
        };
    }

    if (!code && !description && !error?.reason) {
        return {
            type: 'gateway_unavailable',
            title: 'Payment Gateway Unavailable',
            message: 'We could not open the payment gateway. Please check your connection and try again.',
            detail: 'No amount has been confirmed for this booking.',
        };
    }

    if (code === 'BAD_REQUEST_ERROR') {
        return {
            type: 'payment_failed',
            title: 'Payment Could Not Start',
            message: 'The payment gateway could not process this request. Please try again.',
            detail: 'Your slot has been released so you can retry safely.',
        };
    }

    return {
        type: 'payment_failed',
        title: 'Payment Failed',
        message: description && description !== 'undefined'
            ? description
            : 'We could not complete your payment. Please try again.',
        detail: 'If any amount was deducted, it will be refunded automatically within 5-7 business days.',
    };
};

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
    const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
    const [availabilityByDate, setAvailabilityByDate] = useState<Record<string, CampaignAvailability>>({});
    const [availabilityLoading, setAvailabilityLoading] = useState(false);
    const [loadingDateKeys, setLoadingDateKeys] = useState<string[]>([]);
    const [hasAutoSelectedDate, setHasAutoSelectedDate] = useState(false);

    const sourceType = (campaign.source ?? (campaign.lab ? 'lab' : 'doctor')).toUpperCase() as 'DOCTOR' | 'LAB';
    const campaignId = campaign.id || campaign._id || campaign.doctorId || '';
    const isDoctorBooking = sourceType === 'DOCTOR';
    const providerName = formatProviderName(campaign);
    const profilePhoto = isDoctorBooking ? campaign.doctor?.profilePhoto : campaign.lab?.profilePhoto;
    const specialization = isDoctorBooking
        ? campaign.doctor?.specializations?.map((speciality) => speciality.name).filter(Boolean).join(', ') || campaign.doctor?.qualification || 'Healthcare Specialist'
        : 'Diagnostic Center';
    const qualification = campaign.doctor?.qualification;
    const experienceLabel = campaign.doctor?.experienceYears ? `${campaign.doctor.experienceYears}+ yrs` : null;
    const clinicLabel = campaign.doctor?.clinicName || campaign.doctor?.hospitalName || campaign.location?.city;

    useEffect(() => {
        const fetchFee = async () => {
            const fee = await publicService.getPlatformFee(sourceType);
            setPlatformFee(fee);
        };
        fetchFee();
    }, [sourceType]);

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
    const totalSavings = campaignDiscountAmount + platformDiscountAmount;

    const availableDates = useMemo(() => {
        const dates = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const campaignStart = parseDateKey(campaign.startDate);
        const campaignEnd = parseDateKey(campaign.endDate);
        const firstDate = campaignStart && campaignStart > today ? campaignStart : today;
        const lastDate = isDoctorBooking && campaignEnd ? campaignEnd : null;

        for (let i = 0; i < 14 && dates.length < (isDoctorBooking ? 14 : 7); i++) {
            const date = new Date(firstDate);
            date.setDate(firstDate.getDate() + i);
            if (lastDate && date > lastDate) break;
            const dayName = daysOfWeek[date.getDay()];
            dates.push({
                full: formatDateKey(date),
                day: date.getDate(),
                month: date.toLocaleString('default', { month: 'short' }),
                dayName: dayName.substring(0, 3),
            });
        }
        return dates;
    }, [campaign.endDate, campaign.startDate, isDoctorBooking]);

    const fetchAvailabilityForDate = useCallback(async (dateKey: string) => {
        if (!campaignId || !isDoctorBooking) return null;
        setLoadingDateKeys((current) => current.includes(dateKey) ? current : [...current, dateKey]);
        try {
            const availability = await publicService.getCampaignAvailability(campaignId, dateKey);
            setAvailabilityByDate((current) => ({ ...current, [dateKey]: availability }));
            return availability;
        } finally {
            setLoadingDateKeys((current) => current.filter((key) => key !== dateKey));
        }
    }, [campaignId, isDoctorBooking]);

    useEffect(() => {
        if (!visible || availableDates.length === 0) return;
        setSelectedDate((current) => current && availableDates.some((date) => date.full === current) ? current : availableDates[0].full);
        setSelectedSlot(null);
        setStep('slot');
        setIsSuccess(false);
        setBookingResult(null);
    }, [availableDates, visible]);

    useEffect(() => {
        if (!visible || !isDoctorBooking || !campaignId || availableDates.length === 0) {
            setAvailabilityByDate({});
            setAvailabilityLoading(false);
            setHasAutoSelectedDate(false);
            return;
        }

        let isActive = true;
        const loadAvailability = async () => {
            setAvailabilityLoading(true);
            setAvailabilityByDate({});
            setHasAutoSelectedDate(false);
            try {
                const results = await Promise.all(
                    availableDates.map(async (date) => {
                        const availability = await publicService.getCampaignAvailability(campaignId, date.full);
                        return [date.full, availability] as const;
                    })
                );
                if (isActive) setAvailabilityByDate(Object.fromEntries(results));
            } catch (error) {
                if (isActive) {
                    console.error('Availability error:', error);
                    Alert.alert('Availability unavailable', error instanceof Error ? error.message : String(error));
                }
            } finally {
                if (isActive) setAvailabilityLoading(false);
            }
        };

        loadAvailability();
        return () => {
            isActive = false;
        };
    }, [availableDates, campaignId, isDoctorBooking, visible]);

    useEffect(() => {
        if (!visible || !isDoctorBooking || availabilityLoading || hasAutoSelectedDate || availableDates.length === 0) return;
        const hasLoadedAllDates = availableDates.every((date) => availabilityByDate[date.full]);
        if (!hasLoadedAllDates) return;

        const firstAvailableDate = availableDates.find((date) => availabilityByDate[date.full]?.available);
        if (firstAvailableDate && selectedDate !== firstAvailableDate.full) {
            setSelectedDate(firstAvailableDate.full);
            setSelectedSlot(null);
        }
        setHasAutoSelectedDate(true);
    }, [availabilityByDate, availabilityLoading, availableDates, hasAutoSelectedDate, isDoctorBooking, selectedDate, visible]);

    const selectedAvailability = selectedDate ? availabilityByDate[selectedDate] : undefined;
    const selectedDateLabel = selectedDate
        ? availableDates.find((date) => date.full === selectedDate)
        : null;
    const isSelectedDateLoading = selectedDate ? loadingDateKeys.includes(selectedDate) : false;
    const timeSlots = isDoctorBooking
        ? selectedAvailability?.slots || []
        : [
            '10:00 AM - 11:00 AM',
            '11:00 AM - 12:00 PM',
            '12:00 PM - 1:00 PM',
            '1:00 PM - 2:00 PM',
            '2:00 PM - 3:00 PM',
            '3:00 PM - 4:00 PM',
            '4:00 PM - 5:00 PM',
            '5:00 PM - 6:00 PM',
        ].map((label, index) => ({ startMinutes: index * 60, endMinutes: index * 60 + 60, label, status: 'AVAILABLE' as const }));

    const selectedSlotIsAvailable = timeSlots.some((slot) => slot.label === selectedSlot && slot.status === 'AVAILABLE');
    const canReview = Boolean(selectedDate && selectedSlot && selectedSlotIsAvailable && (!isDoctorBooking || !isSelectedDateLoading));

    useEffect(() => {
        if (!selectedSlot || !isDoctorBooking || availabilityLoading || isSelectedDateLoading) return;
        if (!selectedSlotIsAvailable) setSelectedSlot(null);
    }, [availabilityLoading, isDoctorBooking, isSelectedDateLoading, selectedSlot, selectedSlotIsAvailable]);

    const refreshSelectedDateAvailability = useCallback(async () => {
        if (!selectedDate || !isDoctorBooking) return;
        await fetchAvailabilityForDate(selectedDate);
    }, [fetchAvailabilityForDate, isDoctorBooking, selectedDate]);

    const releaseAppointment = useCallback(async (appointmentId: string, reason: string) => {
        try {
            await appointmentService.cancelAppointment(appointmentId, reason);
        } catch (error) {
            console.error('Unable to release appointment reservation:', error);
        }
    }, []);

    const handleBooking = async () => {
        if (!selectedDate || !selectedSlot || !selectedSlotIsAvailable) {
            Alert.alert('Selection Required', 'Please select a date and time slot.');
            return;
        }

        let activeAppointmentId: string | null = null;
        try {
            // Step 1: Reserve
            setLoadingStep('reserving');
            const appointment = await appointmentService.reserveAppointment({
                type: sourceType,
                organizerId: sourceType === 'DOCTOR' ? campaignId : (campaign.lab?.id || campaignId),
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
            activeAppointmentId = apptId;

            let orderData;
            try {
                orderData = await appointmentService.createRazorpayOrder(apptId);
            } catch (error) {
                await releaseAppointment(apptId, 'Payment order creation failed');
                await refreshSelectedDateAvailability();
                setBookingResult({
                    type: 'gateway_unavailable',
                    title: 'Payment Gateway Unavailable',
                    message: 'We could not start the payment gateway for this booking.',
                    detail: 'Your slot has been released. Please try again in a moment.',
                });
                setLoadingStep('idle');
                return;
            }

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
                try {
                    await appointmentService.verifyPayment({
                        appointmentId: apptId,
                        razorpay_order_id: data.razorpay_order_id,
                        razorpay_payment_id: data.razorpay_payment_id,
                        razorpay_signature: data.razorpay_signature,
                    });
                    activeAppointmentId = null;
                    setIsSuccess(true);
                } catch (error: any) {
                    await releaseAppointment(apptId, 'Payment verification failed');
                    await refreshSelectedDateAvailability();
                    setBookingResult({
                        type: 'verification_failed',
                        title: 'Payment Verification Failed',
                        message: 'We could not verify this payment with the server.',
                        detail: 'If any amount was deducted, it will be refunded automatically within 5-7 business days.',
                    });
                } finally {
                    setLoadingStep('idle');
                }
            }).catch(async (error: any) => {
                setLoadingStep('idle');
                console.error('[Razorpay] payment flow error:', error);

                await releaseAppointment(apptId, isPaymentCancelled(error) ? 'Payment cancelled by patient' : 'Payment failed before verification');
                await refreshSelectedDateAvailability();
                setBookingResult(getFriendlyPaymentResult(error));
            });


        } catch (error: any) {
            setLoadingStep('idle');
            if (activeAppointmentId) {
                await releaseAppointment(activeAppointmentId, 'Booking payment flow failed');
                await refreshSelectedDateAvailability();
            }
            const message = error?.toString?.() || 'Something went wrong. Please try again.';
            if (message.toLowerCase().includes('slot') || message.includes('409')) {
                setSelectedSlot(null);
                setStep('slot');
                await refreshSelectedDateAvailability();
                setBookingResult({
                    type: 'slot_unavailable',
                    title: 'Slot No Longer Available',
                    message: 'This slot was just booked or is no longer available.',
                    detail: 'Please choose another available time.',
                });
                return;
            }
            setBookingResult({
                type: 'payment_failed',
                title: 'Booking Could Not Continue',
                message: message.includes('[object Object]') ? 'Something went wrong while preparing your booking.' : message,
                detail: 'Your temporary slot hold has been released. Please try again.',
            });
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

    if (bookingResult) {
        const isWarning = bookingResult.type === 'payment_cancelled' || bookingResult.type === 'slot_unavailable';
        const iconName = isWarning ? 'alert-circle' : 'x';
        const iconColor = isWarning ? '#f59e0b' : BRAND_RED;
        const chooseAnotherSlot = () => {
            setBookingResult(null);
            setStep('slot');
            if (bookingResult.type === 'slot_unavailable') setSelectedSlot(null);
        };

        return (
            <Modal visible={visible} animationType="slide" transparent>
                <View style={[styles.modalOverlay, isDark && styles.modalOverlayDark]}>
                    <View style={[styles.successContainer, isDark && styles.successContainerDark]}>
                        <View style={[styles.successIcon, { backgroundColor: iconColor }]}>
                            <Feather name={iconName} size={40} color="white" />
                        </View>
                        <Text style={[styles.successTitle, isDark && styles.textWhite]}>{bookingResult.title}</Text>
                        <Text style={[styles.successSubtitle, isDark && styles.textZinc400]}>
                            {bookingResult.message}
                        </Text>
                        <View style={[styles.successDetails, isDark && styles.successDetailsDark]}>
                            <View style={styles.successDetailRow}>
                                <Feather name="user" size={16} color={isDark ? "#94A3B8" : "#6B7280"} />
                                <Text style={[styles.successDetailText, isDark && styles.textZinc200]} numberOfLines={1}>{providerName}</Text>
                            </View>
                            <View style={styles.successDetailRow}>
                                <Feather name="calendar" size={16} color={isDark ? "#94A3B8" : "#6B7280"} />
                                <Text style={[styles.successDetailText, isDark && styles.textZinc200]}>{formatReviewDate(selectedDate)}</Text>
                            </View>
                            <View style={styles.successDetailRow}>
                                <Feather name="clock" size={16} color={isDark ? "#94A3B8" : "#6B7280"} />
                                <Text style={[styles.successDetailText, isDark && styles.textZinc200]}>{selectedSlot || 'Choose another slot'}</Text>
                            </View>
                            <View style={styles.successDetailRow}>
                                <Feather name="credit-card" size={16} color={isDark ? "#94A3B8" : "#6B7280"} />
                                <Text style={[styles.successDetailText, isDark && styles.textZinc200]}>Amount: ₹{totalPayable}</Text>
                            </View>
                        </View>
                        {bookingResult.detail && (
                            <View style={[styles.resultInfoBox, isDark && styles.successDetailsDark]}>
                                <Text style={[styles.resultInfoText, isDark && styles.textZinc300]}>{bookingResult.detail}</Text>
                            </View>
                        )}
                        <View style={{ width: '100%', gap: 12 }}>
                            {bookingResult.type !== 'slot_unavailable' && (
                                <TouchableOpacity
                                    style={styles.doneButton}
                                    onPress={() => setBookingResult(null)}
                                >
                                    <Text style={styles.doneButtonText}>Try Again</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={[styles.doneButton, bookingResult.type === 'slot_unavailable' ? null : { backgroundColor: 'transparent', borderWidth: 1, borderColor: isDark ? '#27272a' : '#E5E7EB' }]}
                                onPress={chooseAnotherSlot}
                            >
                                <Text style={[styles.doneButtonText, bookingResult.type === 'slot_unavailable' ? null : { color: isDark ? 'white' : '#111827' }]}>Choose Another Slot</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.doneButton, { backgroundColor: 'transparent' }]}
                                onPress={onClose}
                            >
                                <Text style={[styles.doneButtonText, { color: isDark ? '#a1a1aa' : '#6B7280' }]}>Close</Text>
                            </TouchableOpacity>
                        </View>
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
                                <View style={styles.doctorProfileRow}>
                                    <View style={[styles.doctorAvatar, isDark && styles.doctorAvatarDark]}>
                                        {profilePhoto ? (
                                            <Image source={{ uri: profilePhoto }} style={styles.doctorAvatarImage} />
                                        ) : (
                                            <Feather name={isDoctorBooking ? "user" : "activity"} size={24} color={BRAND_GREEN} />
                                        )}
                                    </View>
                                    <View style={styles.doctorProfileText}>
                                        <View style={styles.nameRow}>
                                            <Text style={[styles.drName, isDark && styles.textWhite]} numberOfLines={1}>
                                                {providerName}
                                            </Text>
                                            {isDoctorBooking && (
                                                <View style={styles.verifiedBadge}>
                                                    <Feather name="check" size={10} color="#FFFFFF" />
                                                </View>
                                            )}
                                        </View>
                                        <Text style={[styles.drSpec, isDark && styles.textZinc400]} numberOfLines={1}>
                                            {specialization}
                                        </Text>
                                        <View style={styles.metaRow}>
                                            {qualification && <Text style={styles.metaPill}>{qualification}</Text>}
                                            {experienceLabel && <Text style={styles.metaPill}>{experienceLabel}</Text>}
                                        </View>
                                    </View>
                                </View>
                                {(clinicLabel || selectedDateLabel) && (
                                    <View style={styles.bookingContextRow}>
                                        {clinicLabel && (
                                            <View style={styles.contextItem}>
                                                <Feather name="map-pin" size={13} color={BRAND_GREEN} />
                                                <Text style={[styles.contextText, isDark && styles.textZinc400]} numberOfLines={1}>{clinicLabel}</Text>
                                            </View>
                                        )}
                                        {selectedDateLabel && (
                                            <View style={styles.contextItem}>
                                                <Feather name="calendar" size={13} color={BRAND_GREEN} />
                                                <Text style={[styles.contextText, isDark && styles.textZinc400]} numberOfLines={1}>
                                                    {selectedDateLabel.dayName}, {selectedDateLabel.day} {selectedDateLabel.month}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                )}
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
                                        onPress={() => {
                                            setSelectedDate(item.full);
                                            setSelectedSlot(null);
                                            if (isDoctorBooking) void fetchAvailabilityForDate(item.full);
                                        }}
                                    >
                                        <Text style={[styles.dayName, isDark && styles.textZinc400, selectedDate === item.full && styles.textWhite]}>{item.dayName}</Text>
                                        <Text style={[styles.dayNum, isDark && styles.textWhite, selectedDate === item.full && styles.textWhite]}>{item.day}</Text>
                                        <Text style={[styles.monthName, isDark && styles.textZinc500, selectedDate === item.full && styles.textWhite]}>{item.month}</Text>
                                        {isDoctorBooking && (
                                            <Text style={[styles.dateStatus, selectedDate === item.full && styles.textWhite]}>
                                                {loadingDateKeys.includes(item.full) ? '...' : getDateAvailabilityLabel(availabilityByDate[item.full])}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Time Slots */}
                            <Text style={[styles.sectionTitle, isDark && styles.textWhite]}>Available Slots</Text>
                            {isDoctorBooking && (
                                <View style={[styles.slotHint, isDark && styles.slotHintDark]}>
                                    <Feather name="shield" size={14} color={BRAND_GREEN} />
                                    <Text style={[styles.slotHintText, isDark && styles.textZinc400]}>
                                        Slots are checked live before payment and held briefly while you complete checkout.
                                    </Text>
                                </View>
                            )}
                            {(availabilityLoading || isSelectedDateLoading) && isDoctorBooking ? (
                                <View style={styles.inlineState}>
                                    <ActivityIndicator color={BRAND_GREEN} />
                                    <Text style={[styles.inlineStateText, isDark && styles.textZinc400]}>Loading available slots...</Text>
                                </View>
                            ) : timeSlots.length > 0 ? (
                                <View style={styles.slotsGrid}>
                                    {timeSlots.map((slot) => {
                                        const isBooked = slot.status === 'BOOKED';
                                        const isSelected = selectedSlot === slot.label;
                                        return (
                                            <TouchableOpacity
                                                key={`${slot.startMinutes}-${slot.label}`}
                                                style={[
                                                    styles.slotChip,
                                                    isDark && styles.slotChipDark,
                                                    isBooked && styles.slotChipBooked,
                                                    isSelected && styles.slotChipActive
                                                ]}
                                                disabled={isBooked}
                                                onPress={() => setSelectedSlot(slot.label)}
                                            >
                                                <Text style={[
                                                    styles.slotText,
                                                    isDark && styles.textZinc300,
                                                    isBooked && styles.slotTextBooked,
                                                    isSelected && styles.textWhite
                                                ]}>
                                                    {slot.label}
                                                </Text>
                                                {isBooked && <Text style={styles.bookedLabel}>Booked</Text>}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            ) : (
                                <View style={[styles.emptySlots, isDark && styles.emptySlotsDark]}>
                                    <Feather name="calendar" size={18} color={isDark ? '#a1a1aa' : '#6B7280'} />
                                    <Text style={[styles.emptySlotsText, isDark && styles.textZinc400]}>
                                        {isDoctorBooking ? getAvailabilityMessage(selectedAvailability?.reason) : 'No appointment slots are available for this date.'}
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            <View style={[styles.reviewHero, isDark && styles.doctorInfoShortDark]}>
                                <View style={styles.doctorProfileRow}>
                                    <View style={[styles.doctorAvatar, isDark && styles.doctorAvatarDark]}>
                                        {profilePhoto ? (
                                            <Image source={{ uri: profilePhoto }} style={styles.doctorAvatarImage} />
                                        ) : (
                                            <Feather name={isDoctorBooking ? "user" : "activity"} size={24} color={BRAND_GREEN} />
                                        )}
                                    </View>
                                    <View style={styles.doctorProfileText}>
                                        <View style={styles.nameRow}>
                                            <Text style={[styles.drName, isDark && styles.textWhite]} numberOfLines={1}>{providerName}</Text>
                                            <View style={styles.verifiedBadge}>
                                                <Feather name="shield" size={10} color="#FFFFFF" />
                                            </View>
                                        </View>
                                        <Text style={[styles.drSpec, isDark && styles.textZinc400]} numberOfLines={1}>{specialization}</Text>
                                        <View style={styles.metaRow}>
                                            {qualification && <Text style={styles.metaPill}>{qualification}</Text>}
                                            {experienceLabel && <Text style={styles.metaPill}>{experienceLabel}</Text>}
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.reviewNotice, isDark && styles.slotHintDark]}>
                                    <Feather name="lock" size={14} color={BRAND_GREEN} />
                                    <Text style={[styles.slotHintText, isDark && styles.textZinc400]}>
                                        Secure payment. Your appointment is confirmed only after successful payment.
                                    </Text>
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
                                            <Text className="text-zinc-900 dark:text-white font-bold">{formatReviewDate(selectedDate)}</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row items-center mb-4">
                                        <View className="w-10 h-10 rounded-xl bg-emerald-500/10 items-center justify-center mr-4">
                                            <Feather name="clock" size={18} color={BRAND_GREEN} />
                                        </View>
                                        <View>
                                            <Text className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest">Time Slot</Text>
                                            <Text className="text-zinc-900 dark:text-white font-bold">{selectedSlot}</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row items-center">
                                        <View className="w-10 h-10 rounded-xl bg-emerald-500/10 items-center justify-center mr-4">
                                            <Feather name="map-pin" size={18} color={BRAND_GREEN} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest">Visit Type</Text>
                                            <Text className="text-zinc-900 dark:text-white font-bold" numberOfLines={1}>
                                                {isDoctorBooking ? 'In-clinic consultation' : 'Diagnostic appointment'}{clinicLabel ? ` at ${clinicLabel}` : ''}
                                            </Text>
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

                                {totalSavings > 0 && (
                                    <View style={styles.savingsBanner}>
                                        <Feather name="tag" size={14} color={BRAND_GREEN} />
                                        <Text style={styles.savingsText}>You save ₹{totalSavings} on this booking</Text>
                                    </View>
                                )}

                                {/* Total Divider */}
                                <View className="h-[1px] bg-zinc-200 dark:bg-zinc-800 my-2" />

                                {/* Total */}
	                                <View className="flex-row justify-between items-center mt-4">
	                                    <Text className="text-zinc-900 dark:text-white font-black text-lg">Total Amount</Text>
	                                    <Text className="text-emerald-600 font-black text-2xl">₹{totalPayable}</Text>
	                                </View>
                                    <Text style={[styles.feeNote, isDark && styles.textZinc500]}>Inclusive of applicable platform fee.</Text>
	                            </View>
                                <View style={styles.trustRow}>
                                    {[
                                        ['credit-card', 'Secure payment'],
                                        ['check-circle', 'Instant confirmation'],
                                        ['refresh-cw', 'Auto release on failure'],
                                    ].map(([icon, label]) => (
                                        <View key={label} style={[styles.trustChip, isDark && styles.slotChipDark]}>
                                            <Feather name={icon} size={14} color={BRAND_GREEN} />
                                            <Text style={[styles.trustText, isDark && styles.textZinc400]}>{label}</Text>
                                        </View>
                                    ))}
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
                                    style={[styles.confirmButton, isDark && styles.confirmButtonDark, !canReview && styles.buttonDisabled]}
                                    onPress={() => setStep('review')}
                                    disabled={!canReview}
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
                                        <Text style={styles.confirmButtonText}>Pay ₹{totalPayable} Securely</Text>
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
        marginBottom: 32,
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 20,
    },
    doctorInfoShortDark: {
        backgroundColor: '#18181b', // zinc-900
    },
    reviewHero: {
        marginBottom: 24,
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 20,
    },
    doctorAvatar: {
        width: 58,
        height: 58,
        borderRadius: 18,
        backgroundColor: '#D1F2E2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        overflow: 'hidden',
    },
    doctorAvatarDark: {
        backgroundColor: '#064e3b', // emerald-900
    },
    doctorAvatarImage: {
        width: '100%',
        height: '100%',
    },
    doctorProfileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    doctorProfileText: {
        flex: 1,
        minWidth: 0,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    drName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        flexShrink: 1,
    },
    drSpec: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    verifiedBadge: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: BRAND_GREEN,
        alignItems: 'center',
        justifyContent: 'center',
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 8,
    },
    metaPill: {
        fontSize: 10,
        fontWeight: '800',
        color: BRAND_GREEN,
        backgroundColor: '#D1F2E2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        overflow: 'hidden',
    },
    bookingContextRow: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        marginTop: 14,
        paddingTop: 12,
        gap: 8,
    },
    contextItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    contextText: {
        color: '#6B7280',
        fontWeight: '700',
        fontSize: 12,
        flex: 1,
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
    dateStatus: {
        fontSize: 9,
        fontWeight: '800',
        color: BRAND_GREEN,
        marginTop: 4,
        textTransform: 'uppercase',
    },
    slotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    slotHint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F0FDF4',
        borderWidth: 1,
        borderColor: '#BBF7D0',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginTop: -6,
        marginBottom: 16,
    },
    slotHintDark: {
        backgroundColor: '#052e1b',
        borderColor: '#14532d',
    },
    slotHintText: {
        color: '#166534',
        fontSize: 11,
        fontWeight: '700',
        flex: 1,
        lineHeight: 16,
    },
    reviewNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F0FDF4',
        borderWidth: 1,
        borderColor: '#BBF7D0',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginTop: 14,
    },
    savingsBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#ECFDF5',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginTop: 4,
        marginBottom: 8,
    },
    savingsText: {
        color: '#059669',
        fontWeight: '800',
        fontSize: 13,
    },
    feeNote: {
        color: '#9CA3AF',
        fontSize: 11,
        fontWeight: '600',
        marginTop: 8,
    },
    trustRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 14,
        marginBottom: 4,
    },
    trustChip: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        borderRadius: 14,
        paddingHorizontal: 8,
        paddingVertical: 10,
        alignItems: 'center',
        gap: 6,
    },
    trustText: {
        color: '#6B7280',
        fontSize: 10,
        fontWeight: '800',
        textAlign: 'center',
        lineHeight: 13,
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
    slotChipBooked: {
        opacity: 0.55,
        borderColor: '#D1D5DB',
    },
    slotText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    slotTextBooked: {
        textDecorationLine: 'line-through',
        color: '#9CA3AF',
    },
    bookedLabel: {
        marginTop: 4,
        fontSize: 10,
        fontWeight: '800',
        color: BRAND_RED,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    inlineState: {
        minHeight: 88,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    inlineStateText: {
        marginTop: 10,
        color: '#6B7280',
        fontWeight: '600',
    },
    emptySlots: {
        minHeight: 96,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        marginBottom: 20,
    },
    emptySlotsDark: {
        borderColor: '#27272a',
        backgroundColor: '#18181b',
    },
    emptySlotsText: {
        marginTop: 8,
        color: '#6B7280',
        textAlign: 'center',
        fontWeight: '600',
        lineHeight: 20,
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
    resultInfoBox: {
        width: '100%',
        backgroundColor: '#F3F4F6',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginTop: -16,
        marginBottom: 24,
    },
    resultInfoText: {
        color: '#4B5563',
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 19,
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
