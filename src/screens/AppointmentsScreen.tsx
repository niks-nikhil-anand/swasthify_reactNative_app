import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    Modal,
    Image,
    Linking,
} from 'react-native';
import { useColorScheme } from 'nativewind';
import Feather from 'react-native-vector-icons/Feather';
import { appointmentService } from '../services/appointmentService';
import AppointmentCard, { Appointment } from '../components/AppointmentCard';
import AppointmentCardSkeleton from '../components/AppointmentCardSkeleton';

type StatusTab = 'Upcoming' | 'Completed' | 'Cancelled';

const AppointmentsScreen = () => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<StatusTab>('Upcoming');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling] = useState(false);

    const fetchAppointments = async () => {
        try {
            const data = await appointmentService.getMyAppointments();
            setAppointments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAppointments();
    }, []);

    const openCancelModal = (appointment: Appointment) => {
        setCancelTarget(appointment);
        setCancelReason('');
    };

    const closeCancelModal = () => {
        setCancelTarget(null);
        setCancelReason('');
    };

    const confirmCancel = async () => {
        if (!cancelTarget) return;
        setCancelling(true);
        try {
            await appointmentService.cancelAppointment(cancelTarget.id, cancelReason.trim() || undefined);
            closeCancelModal();
            fetchAppointments();
        } catch (error) {
            console.error(error);
        } finally {
            setCancelling(false);
        }
    };

    const filteredAndSortedAppointments = useMemo(() => {
        let result = appointments.filter((app) => {
            // Tab filtering
            if (activeTab === 'Upcoming' && app.status !== 'Upcoming') return false;
            if (activeTab === 'Completed' && app.status !== 'COMPLETED') return false;
            if (activeTab === 'Cancelled' && app.status !== 'CANCELLED') return false;

            // Search filtering
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    app.doctor.toLowerCase().includes(query) ||
                    app.speciality.toLowerCase().includes(query)
                );
            }
            return true;
        });

        // Sorting
        result.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [appointments, activeTab, searchQuery, sortBy]);

    const stats = useMemo(() => {
        return {
            upcoming: appointments.filter(a => a.status === 'Upcoming').length,
            completed: appointments.filter(a => a.status === 'COMPLETED').length,
            cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
        };
    }, [appointments]);

    return (
        <SafeAreaView className="flex-1 bg-zinc-50 dark:bg-zinc-950">
            {/* Control Bar: Search & Sort */}
            <View className="p-6 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
                <View className="flex-row items-center mb-6">
                    <View className="flex-1 flex-row items-center bg-zinc-100 dark:bg-zinc-800 px-4 h-12 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                        <Feather name="search" size={18} color={isDark ? "#94A3B8" : "#9CA3AF"} />
                        <TextInput
                            className="flex-1 ml-3 text-sm font-semibold text-zinc-900 dark:text-white"
                            placeholder="Provider or test name..."
                            placeholderTextColor={isDark ? "#64748B" : "#9CA3AF"}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
                        className="ml-3 w-12 h-12 bg-emerald-500 dark:bg-emerald-600 rounded-2xl items-center justify-center shadow-lg shadow-emerald-500/20"
                    >
                        <Feather name={sortBy === 'newest' ? 'arrow-down' : 'arrow-up'} size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Status Tabs */}
                <View className="flex-row items-center gap-x-2">
                    {(['Upcoming', 'Completed', 'Cancelled'] as StatusTab[]).map((tab) => {
                        const isActive = activeTab === tab;
                        const count = tab === 'Upcoming' ? stats.upcoming : tab === 'Completed' ? stats.completed : stats.cancelled;

                        return (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                className={`flex-1 py-3 px-2 rounded-2xl flex-row items-center justify-center border ${isActive
                                    ? 'bg-zinc-900 dark:bg-emerald-600 border-zinc-900 dark:border-emerald-600 shadow-sm'
                                    : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'
                                    }`}
                            >
                                <Text className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                                    {tab}
                                </Text>
                                {count > 0 && (
                                    <View className={`ml-2 px-1.5 py-0.5 rounded-full ${isActive ? 'bg-emerald-500 dark:bg-emerald-500/40' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                                        <Text className={`text-[8px] font-black ${isActive ? 'text-white' : 'text-zinc-500'}`}>{count}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <ScrollView
                className="flex-1 p-6"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
                }
            >
                {loading && !refreshing ? (
                    <View>
                        {[1, 2, 3, 4].map(i => <AppointmentCardSkeleton key={i} />)}
                    </View>
                ) : filteredAndSortedAppointments.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <View className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full items-center justify-center mb-6">
                            <Feather name="calendar" size={32} color="#D1D5DB" />
                        </View>
                        <Text className="text-xl font-black text-zinc-900 dark:text-white mb-2">No appointments</Text>
                        <Text className="text-zinc-500 text-center px-10">We couldn't find any {activeTab.toLowerCase()} appointments matching your search.</Text>
                    </View>
                ) : (
                    filteredAndSortedAppointments.map((item) => (
                        <AppointmentCard
                            key={item.id}
                            appointment={item}
                            onCancel={() => openCancelModal(item)}
                            onViewDetails={setSelectedAppointment}
                        />
                    ))
                )}
                <View className="h-10" />
            </ScrollView>

            {/* Details Modal */}
            <Modal
                visible={!!selectedAppointment}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSelectedAppointment(null)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white dark:bg-zinc-950 rounded-t-[3rem] p-8 max-h-[90%]">
                        <View className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full self-center mb-8" />

                        {selectedAppointment && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View className="flex-row items-center mb-8">
                                    <View className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 items-center justify-center border-2 border-white dark:border-zinc-800 shadow-xl shadow-emerald-500/10 overflow-hidden">
                                        {selectedAppointment.img ? (
                                            <Image source={{ uri: selectedAppointment.img }} className="w-full h-full" />
                                        ) : (
                                            <Feather name="user" size={32} color="#10B981" />
                                        )}
                                    </View>
                                    <View className="ml-6 flex-1">
                                        <Text className="text-2xl font-black text-zinc-900 dark:text-white leading-tight">
                                            {selectedAppointment.doctor}
                                        </Text>
                                        <Text className="text-sm font-black text-emerald-600 uppercase tracking-widest mt-1">
                                            {selectedAppointment.speciality}
                                        </Text>
                                    </View>
                                </View>

                                <View className="space-y-6">
                                    <View>
                                        <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Service Provider Details</Text>
                                        <View className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 space-y-4">
                                            <View className="flex-row justify-between">
                                                <View>
                                                    <Text className="text-[9px] font-black text-zinc-400 uppercase mb-1">Qualification</Text>
                                                    <Text className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{selectedAppointment.doctorDetails?.qualification || 'Certified Professional'}</Text>
                                                </View>
                                                <View className="items-end">
                                                    <Text className="text-[9px] font-black text-zinc-400 uppercase mb-1">Experience</Text>
                                                    <Text className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{selectedAppointment.doctorDetails?.experienceYears || '10+'} Years</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text className="text-[9px] font-black text-zinc-400 uppercase mb-1">Facility Name</Text>
                                                <Text className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{selectedAppointment.doctorDetails?.clinicName || 'Swasthify Partner'}</Text>
                                            </View>
                                            <View>
                                                <Text className="text-[9px] font-black text-zinc-400 uppercase mb-1">Address</Text>
                                                <Text className="text-sm font-bold text-zinc-800 dark:text-zinc-200 leading-relaxed">
                                                    {selectedAppointment.doctorDetails?.address?.street}, {selectedAppointment.doctorDetails?.address?.city}, {selectedAppointment.doctorDetails?.address?.state} - {selectedAppointment.doctorDetails?.address?.zipCode}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => setSelectedAppointment(null)}
                                        className="bg-zinc-900 dark:bg-emerald-600 h-16 rounded-2xl items-center justify-center mt-4"
                                    >
                                        <Text className="text-white font-black uppercase tracking-widest">Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Cancel Confirmation Modal */}
            <Modal
                visible={!!cancelTarget}
                animationType="fade"
                transparent={true}
                onRequestClose={closeCancelModal}
            >
                <View className="flex-1 justify-center items-center bg-black/60 px-6">
                    <View className="bg-white dark:bg-zinc-900 rounded-3xl p-7 w-full shadow-2xl">
                        {/* Icon */}
                        <View className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full items-center justify-center self-center mb-5">
                            <Feather name="x-circle" size={32} color="#EF4444" />
                        </View>

                        <Text className="text-xl font-black text-zinc-900 dark:text-white text-center mb-1">
                            Cancel Appointment
                        </Text>
                        <Text className="text-sm text-zinc-500 text-center mb-6">
                            {cancelTarget?.doctor}
                        </Text>

                        {/* Reason Input */}
                        <View className="mb-6">
                            <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">
                                Reason (Optional)
                            </Text>
                            <TextInput
                                className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-sm text-zinc-900 dark:text-white"
                                placeholder="Tell us why you're cancelling..."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                value={cancelReason}
                                onChangeText={setCancelReason}
                            />
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row gap-x-3">
                            <TouchableOpacity
                                onPress={closeCancelModal}
                                className="flex-1 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl items-center justify-center"
                                disabled={cancelling}
                            >
                                <Text className="font-black text-zinc-700 dark:text-zinc-300">Keep It</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={confirmCancel}
                                className="flex-1 h-14 bg-red-500 rounded-2xl items-center justify-center"
                                disabled={cancelling}
                            >
                                {cancelling ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <Text className="font-black text-white">Yes, Cancel</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default AppointmentsScreen;
