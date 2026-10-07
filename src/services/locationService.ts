import { Alert, PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

export const LOCATION_STORAGE_KEY = 'swasthify_home_location';
export const DOCTOR_LOCATION_CHANGED_EVENT = 'doctorLocationChanged';

export type SavedLocation = {
    latitude: number;
    longitude: number;
    label: string;
    source: 'device' | 'fallback';
};

export const PATNA_LOCATION: SavedLocation = {
    latitude: 25.5941,
    longitude: 85.1376,
    label: 'Patna',
    source: 'fallback',
};

const requestAndroidLocationPermission = async () => {
    if (Platform.OS !== 'android') return true;

    const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: 'Find doctors near you',
            message: 'Swasthify uses your location to show nearby in-clinic doctors first.',
            buttonPositive: 'Allow',
            buttonNegative: 'Not now',
        }
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
};

export const locationService = {
    getSavedLocation: async (): Promise<SavedLocation | null> => {
        const stored = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
        if (!stored) return null;

        try {
            const parsed = JSON.parse(stored) as SavedLocation;
            if (
                typeof parsed.latitude === 'number' &&
                typeof parsed.longitude === 'number' &&
                parsed.label &&
                (parsed.source === 'device' || parsed.source === 'fallback')
            ) {
                return parsed;
            }
        } catch {
            await AsyncStorage.removeItem(LOCATION_STORAGE_KEY);
        }

        return null;
    },

    saveLocation: async (location: SavedLocation) => {
        await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
    },

    savePatnaFallback: async () => {
        await locationService.saveLocation(PATNA_LOCATION);
        return PATNA_LOCATION;
    },

    requestCurrentLocation: async (): Promise<SavedLocation> => {
        const granted = await requestAndroidLocationPermission();
        if (!granted) {
            throw new Error('Location permission was denied.');
        }

        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        label: 'your current location',
                        source: 'device',
                    });
                },
                (error) => {
                    reject(new Error(error.message || 'Unable to retrieve your location.'));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 5 * 60 * 1000,
                }
            );
        });
    },

    showLocationError: (message = 'Unable to retrieve your location. Showing doctors in Patna.') => {
        Alert.alert('Location unavailable', message);
    },
};
