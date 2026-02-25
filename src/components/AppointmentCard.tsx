import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export interface Appointment {
    id: string;
    doctor: string;
    speciality: string;
    date: string;
    type: string;
    status: string;
    img: string;
    rawStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    consultationFee: number;
    doctorDetails?: {
        qualification?: string;
        experienceYears?: number;
        clinicName?: string;
        address?: {
            street?: string;
            city?: string;
            state?: string;
            zipCode?: string;
            latitude?: number;
            longitude?: number;
        };
    };
}

interface AppointmentCardProps {
    appointment: Appointment;
    onCancel: (id: string) => void;
    onViewDetails: (appointment: Appointment) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onCancel, onViewDetails }) => {
    const isUpcoming = appointment.status === 'Upcoming';
    const isCompleted = appointment.status === 'COMPLETED';
    const isCancelled = appointment.status === 'CANCELLED';

    const getStatusColor = () => {
        if (isUpcoming) return '#3B82F6'; // Blue
        if (isCompleted) return '#10B981'; // Emerald
        if (isCancelled) return '#EF4444'; // Red
        return '#6B7280';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const handleNavigate = () => {
        const address = appointment.doctorDetails?.address;
        if (!address) return;

        let url = '';
        if (address.latitude && address.longitude) {
            url = `geo:0,0?q=${address.latitude},${address.longitude}`;
        } else {
            const query = encodeURIComponent(`${address.street}, ${address.city}, ${address.state} ${address.zipCode}`);
            url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        }
        Linking.openURL(url);
    };

    const handleCancelPress = () => {
        Alert.alert(
            'Confirm Cancellation',
            'Are you sure you want to cancel this appointment?',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Yes, Cancel', style: 'destructive', onPress: () => onCancel(appointment.id) },
            ]
        );
    };

    return (
        <View className="bg-white dark:bg-zinc-900 rounded-3xl mb-4 overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-800 flex-row">
            {/* Status Accent Line */}
            <View style={{ width: 4, backgroundColor: getStatusColor() }} />

            <View className="flex-1 p-5">
                {/* Header: Avatar, Info, Status Badge */}
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700">
                            {appointment.img ? (
                                <Image source={{ uri: appointment.img }} className="w-full h-full" />
                            ) : (
                                <Text className="text-emerald-600 font-black text-lg">
                                    {appointment.doctor?.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </Text>
                            )}
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="text-base font-black text-zinc-900 dark:text-white" numberOfLines={1}>
                                {appointment.doctor}
                            </Text>
                            <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest" numberOfLines={1}>
                                {appointment.speciality}
                            </Text>
                        </View>
                    </View>

                    <View
                        className="px-3 py-1 rounded-full flex-row items-center"
                        style={{ backgroundColor: `${getStatusColor()}15` }}
                    >
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: getStatusColor(), marginRight: 6 }} />
                        <Text style={{ color: getStatusColor() }} className="text-[9px] font-black uppercase tracking-widest">
                            {appointment.status}
                        </Text>
                    </View>
                </View>

                {/* Info Grid */}
                <View className="flex-row justify-between mb-5 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <View>
                        <Text className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Date</Text>
                        <Text className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{formatDate(appointment.date)}</Text>
                    </View>
                    <View>
                        <Text className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Time</Text>
                        <Text className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{formatTime(appointment.date)}</Text>
                    </View>
                    <View>
                        <Text className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Fee</Text>
                        <Text className="text-xs font-bold text-zinc-800 dark:text-zinc-200">₹{appointment.consultationFee}</Text>
                    </View>
                </View>

                {/* Actions */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        {appointment.type === 'Video Consultation' ? (
                            <>
                                <Feather name="video" size={14} color="#10B981" />
                                <Text className="ml-2 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">{appointment.type}</Text>
                            </>
                        ) : (
                            <TouchableOpacity onPress={handleNavigate} className="flex-row items-center">
                                <Feather name="navigation" size={14} color="#10B981" />
                                <Text className="ml-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">Navigate</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View className="flex-row gap-x-2">
                        {isUpcoming && (
                            <TouchableOpacity
                                onPress={handleCancelPress}
                                className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-500/10"
                            >
                                <Text className="text-red-500 text-[10px] font-black uppercase tracking-widest">Cancel</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={() => onViewDetails(appointment)}
                            className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-emerald-600 shadow-sm"
                        >
                            <Text className="text-white text-[10px] font-black uppercase tracking-widest">Details</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default AppointmentCard;
