import React, { useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootDrawerParamList } from '../navigation/types';
import { Search } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const DoctorSearchBar = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootDrawerParamList>>();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [searchQuery, setSearchQuery] = React.useState('');
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    useEffect(() => {
        opacity.value = withDelay(500, withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) }));
        translateY.value = withDelay(500, withTiming(0, { duration: 700, easing: Easing.out(Easing.quad) }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigation.navigate('Doctors', { query: searchQuery.trim() });
        } else {
            navigation.navigate('Doctors');
        }
    };

    return (
        <View style={styles.outerContainer}>
            <Animated.View style={[styles.container, animatedStyle]}>
                <View style={styles.header}>
                    <Text className="section-heading dark:text-white text-center mb-1">
                        Search Nearby{' '}
                        <Text className="section-heading-highlight bg-emerald-100 dark:bg-emerald-900/30 px-3 rounded-xl overflow-hidden">
                            Doctors
                        </Text>
                    </Text>
                    <Text className="section-description dark:text-gray-400 text-center">
                        Book OPD appointments made easy
                    </Text>
                </View>

                <View style={[styles.searchWrapper, isDark && styles.searchWrapperDark]}>
                    <View style={styles.searchIconContainer}>
                        <Search color="#64748b" size={20} />
                    </View>

                    <TextInput
                        placeholder="Search doctors, specialities, symptoms..."
                        placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                        style={[styles.input, isDark && styles.textWhite]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />

                    <TouchableOpacity
                        style={styles.searchButton}
                        activeOpacity={0.8}
                        onPress={handleSearch}
                    >
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 24,
        marginBottom: 12,
        alignItems: 'center',
    },
    container: {
        width: '100%',
        maxWidth: 450,
    },
    header: {
        marginBottom: 16,
        alignItems: 'center',
    },
    searchWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Glassmorphism-like background
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 50, // rounded-full
        padding: 6,
        borderWidth: 1,
        borderColor: 'rgba(13, 169, 110, 0.15)', // border-primary/20 (assuming primary is green)
        ...Platform.select({
            ios: {
                shadowColor: '#0DA96E',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    searchIconContainer: {
        paddingLeft: 14,
        paddingRight: 4,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1e293b',
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        height: 44,
        paddingHorizontal: 8,
    },
    searchButton: {
        backgroundColor: '#0DA96E', // Primary color
        paddingHorizontal: 22,
        height: 40,
        borderRadius: 25, // rounded-full
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0DA96E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    searchWrapperDark: {
        backgroundColor: '#1F2937',
        borderColor: 'rgba(13, 169, 110, 0.3)',
    },
    textWhite: {
        color: '#F9FAFB',
    },
    textGray400: {
        color: '#94A3B8',
    },
});

export default DoctorSearchBar;
