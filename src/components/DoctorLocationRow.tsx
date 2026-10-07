import React, { useEffect, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import Feather from 'react-native-vector-icons/Feather';
import {
    DOCTOR_LOCATION_CHANGED_EVENT,
    locationService,
    PATNA_LOCATION,
    SavedLocation,
} from '../services/locationService';

const DoctorLocationRow = () => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [location, setLocation] = useState<SavedLocation | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadLocation = async () => {
            const stored = await locationService.getSavedLocation();
            const nextLocation = stored || PATNA_LOCATION;
            if (!stored) {
                await locationService.saveLocation(nextLocation);
            }
            setLocation(nextLocation);
        };

        loadLocation();
    }, []);

    const publishLocation = (nextLocation: SavedLocation) => {
        setLocation(nextLocation);
        DeviceEventEmitter.emit(DOCTOR_LOCATION_CHANGED_EVENT, nextLocation);
    };

    const useCurrentLocation = async () => {
        setLoading(true);
        try {
            const currentLocation = await locationService.requestCurrentLocation();
            await locationService.saveLocation(currentLocation);
            publishLocation(currentLocation);
        } catch (error: any) {
            const patna = await locationService.savePatnaFallback();
            publishLocation(patna);
            locationService.showLocationError(error?.message);
        } finally {
            setLoading(false);
        }
    };

    const showPatnaDoctors = async () => {
        const patna = await locationService.savePatnaFallback();
        publishLocation(patna);
    };

    const isDeviceLocation = location?.source === 'device';

    return (
        <View className="px-5 mt-1 mb-4">
            <View className="flex-row items-center justify-between rounded-2xl border border-emerald-500/15 bg-emerald-500/5 dark:bg-emerald-500/10 px-4 py-3">
                <View className="flex-row items-center flex-1 mr-3">
                    <View className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 items-center justify-center mr-3 border border-emerald-500/10">
                        <Feather name="map-pin" size={16} color="#0DA96E" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                            Location
                        </Text>
                        <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-200" numberOfLines={1}>
                            {isDeviceLocation ? 'Showing doctors near you' : 'Showing doctors in Patna'}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={isDeviceLocation ? showPatnaDoctors : useCurrentLocation}
                    disabled={loading}
                    className="min-w-[104px] h-9 px-3 rounded-full bg-white dark:bg-slate-900 border border-emerald-500/20 items-center justify-center"
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#0DA96E" />
                    ) : (
                        <Text className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                            {isDeviceLocation ? 'Show Patna' : 'Use location'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DoctorLocationRow;
