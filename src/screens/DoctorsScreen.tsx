import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootDrawerParamList } from '../navigation/types';
import Feather from 'react-native-vector-icons/Feather';
import { publicService, Campaign } from '../services/publicService';
import CampaignCard from '../components/CampaignCard';
import { CampaignListSkeleton } from '../components/CampaignSkeleton';
import { locationService, PATNA_LOCATION, SavedLocation } from '../services/locationService';

const SPECIALIZATIONS = [
    "All",
    "General physician",
    "Gynaecology",
    "Dermatology",
    "Psychiatry",
    "Sexology",
    "Stomach and digestion",
    "Pediatrics",
    "Cardiology",
    "Orthopaedics",
    "Dentistry"
];

const SORT_OPTIONS = [
    { label: 'Featured', value: 'featured' },
    { label: 'Nearest first', value: 'nearest' },
    { label: 'Experience (High-Low)', value: 'experience_desc' },
    { label: 'Price (Low-High)', value: 'price_asc' },
    { label: 'Price (High-Low)', value: 'price_desc' },
];

const DoctorsScreen = () => {
    const navigation = useNavigation<any>();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const route = useRoute<RouteProp<RootDrawerParamList, 'Doctors'>>();
    const initialQuery = route.params?.query || '';
    const initialSpecialization = route.params?.specialization || 'All';

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [selectedSpecialization, setSelectedSpecialization] = useState(initialSpecialization);
    const [sortBy, setSortBy] = useState('featured');
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [savedLocation, setSavedLocation] = useState<SavedLocation | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const latestRequestId = useRef(0);

    const fetchDoctors = useCallback(async (pageNum: number, isNewSearch: boolean = false) => {
        if (pageNum > 1 && !hasMore) return;
        const requestId = ++latestRequestId.current;

        if (isNewSearch) {
            setLoading(true);
            setPage(1);
        } else {
            setLoadingMore(true);
        }

        try {
            const data = await publicService.getCampaigns({
                source: 'doctor',
                limit: 10,
                page: pageNum,
                search: searchQuery,
                specialization: selectedSpecialization === 'All' ? undefined : selectedSpecialization,
                sortBy: sortBy === 'featured' || sortBy === 'nearest' ? undefined : sortBy,
                lat: savedLocation?.latitude,
                lng: savedLocation?.longitude,
                radiusKm: 25,
            });

            if (requestId !== latestRequestId.current) {
                return;
            }

            if (isNewSearch && savedLocation?.source === 'device' && data.length === 0) {
                const patna = await locationService.savePatnaFallback();
                setSavedLocation(patna);
                Alert.alert('No nearby doctors', 'We could not find doctors near your current location, so we are showing Patna doctors.');
                return;
            }

            if (data.length < 10) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (isNewSearch) {
                setCampaigns(data);
            } else {
                setCampaigns(prev => [...prev, ...data]);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            if (requestId === latestRequestId.current) {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    }, [searchQuery, selectedSpecialization, sortBy, hasMore, savedLocation]);

    useEffect(() => {
        const loadLocation = async () => {
            const stored = await locationService.getSavedLocation();
            setSavedLocation(stored || PATNA_LOCATION);
        };

        loadLocation();
    }, []);

    useEffect(() => {
        if (savedLocation) {
            fetchDoctors(1, true);
        }
    }, [selectedSpecialization, sortBy, savedLocation]);

    useEffect(() => {
        if (!savedLocation) return;

        const debounce = setTimeout(() => {
            fetchDoctors(1, true);
        }, 300);

        return () => clearTimeout(debounce);
    }, [searchQuery, savedLocation]);

    useEffect(() => {
        if (route.params?.query !== undefined && route.params.query !== searchQuery) {
            setSearchQuery(route.params.query);
        }

        if (route.params?.specialization !== undefined && route.params.specialization !== selectedSpecialization) {
            setSelectedSpecialization(route.params.specialization);
        }
    }, [route.params?.query, route.params?.specialization]);

    // Clear search and filter states when popping this screen (i.e. going back to Home)
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
            if (e.data.action.type === 'GO_BACK') {
                setSearchQuery('');
                setSelectedSpecialization('All');
                navigation.setParams({ query: undefined, specialization: undefined });
            }
        });
        return unsubscribe;
    }, [navigation]);

    const handleSearchSubmit = () => {
        fetchDoctors(1, true);
    };

    const useCurrentLocation = async () => {
        setLocationLoading(true);
        try {
            const location = await locationService.requestCurrentLocation();
            await locationService.saveLocation(location);
            setSavedLocation(location);
            setSortBy('nearest');
            setPage(1);
        } catch (error: any) {
            const patna = await locationService.savePatnaFallback();
            setSavedLocation(patna);
            locationService.showLocationError(error?.message);
        } finally {
            setLocationLoading(false);
        }
    };

    const showPatnaDoctors = async () => {
        const patna = await locationService.savePatnaFallback();
        setSavedLocation(patna);
        setPage(1);
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchDoctors(nextPage);
        }
    };

    const renderHeader = () => (
        <>
            <View style={styles.headerContainer}>
                <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
                    <View style={[styles.searchInputWrapper, isDark && styles.searchInputWrapperDark]}>
                        <Feather name="search" size={20} color={isDark ? "#94A3B8" : "#6B7280"} />
                        <TextInput
                            style={[styles.searchInput, isDark && styles.textWhite]}
                            placeholder="Search doctors, clinics..."
                            placeholderTextColor={isDark ? "#64748b" : "#9CA3AF"}
                            value={searchQuery}
                            onChangeText={(text) => {
                                setSearchQuery(text);
                                setPage(1);
                            }}
                            onSubmitEditing={handleSearchSubmit}
                            returnKeyType="search"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => {
                                setSearchQuery('');
                                setPage(1);
                            }}>
                                <Feather name="x" size={18} color={isDark ? "#94A3B8" : "#6B7280"} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.sortButton,
                            isDark && styles.sortButtonDark,
                            sortBy !== 'featured' && styles.sortButtonActive,
                            sortBy !== 'featured' && isDark && styles.sortButtonActiveDark
                        ]}
                        onPress={() => setShowSortOptions(!showSortOptions)}
                    >
                        <Feather name="sliders" size={20} color={sortBy !== 'featured' ? '#0DA96E' : (isDark ? '#94A3B8' : '#374151')} />
                    </TouchableOpacity>
                </View>

                {showSortOptions && (
                    <View style={[styles.sortOptionsCard, isDark && styles.sortOptionsCardDark]}>
                        <Text style={[styles.sortTitle, isDark && styles.textWhite]}>Sort By</Text>
                        <View style={styles.sortOptionsGrid}>
                            {SORT_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.sortOption,
                                        isDark && styles.sortOptionDark,
                                        sortBy === option.value && styles.sortOptionSelected,
                                        sortBy === option.value && isDark && styles.sortOptionSelectedDark
                                    ]}
                                    onPress={() => {
                                        setSortBy(option.value);
                                        setShowSortOptions(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.sortOptionText,
                                        isDark && styles.textGray400,
                                        sortBy === option.value && styles.sortOptionTextSelected
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                <View style={[styles.locationCard, isDark && styles.locationCardDark]}>
                    <View style={styles.locationTextWrap}>
                        <Feather name="map-pin" size={16} color="#0DA96E" />
                        <Text style={[styles.locationText, isDark && styles.textGray400]} numberOfLines={2}>
                            {savedLocation?.source === 'device'
                                ? 'Showing doctors near your current location'
                                : 'Showing doctors in Patna'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={savedLocation?.source === 'device' ? showPatnaDoctors : useCurrentLocation}
                        disabled={locationLoading}
                        style={styles.locationButton}
                    >
                        {locationLoading ? (
                            <ActivityIndicator size="small" color="#0DA96E" />
                        ) : (
                            <Text style={styles.locationButtonText}>
                                {savedLocation?.source === 'device' ? 'Show Patna' : 'Use my location'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.resultsHeader}>
                    <Text style={[styles.resultsCount, isDark && styles.textWhite]}>
                        {campaigns.length} {campaigns.length === 1 ? 'Doctor' : 'Doctors'} found
                    </Text>
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.specializationList}
            >
                {SPECIALIZATIONS.map((spec) => (
                    <TouchableOpacity
                        key={spec}
                        style={[
                            styles.specChip,
                            isDark && styles.specChipDark,
                            selectedSpecialization === spec && styles.specChipSelected
                        ]}
                        onPress={() => setSelectedSpecialization(spec)}
                    >
                        <Text style={[
                            styles.specChipText,
                            isDark && styles.textGray400,
                            selectedSpecialization === spec && styles.specChipTextSelected
                        ]}>
                            {spec}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </>
    );

    const renderFooter = () => {
        if (!loadingMore) return <View style={{ height: 20 }} />;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#0DA96E" />
                <Text style={[styles.footerLoaderText, isDark && styles.textGray400]}>Loading more doctors...</Text>
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <View style={[styles.emptyIconContainer, isDark && styles.emptyIconContainerDark]}>
                    <Feather name="search" size={48} color="#0DA96E" style={{ opacity: 0.2 }} />
                </View>
                <Text style={[styles.emptyTitle, isDark && styles.textWhite]}>No doctors found</Text>
                <Text style={[styles.emptySubtitle, isDark && styles.textGray400]}>
                    Try adjusting your filters or search terms
                </Text>
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => {
                        setSearchQuery('');
                        setSelectedSpecialization('All');
                        setSortBy('featured');
                        setPage(1);
                    }}
                >
                    <Text style={styles.resetButtonText}>Reset Filters</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const headerComponent = useMemo(
        () => renderHeader(),
        [
            campaigns.length,
            isDark,
            locationLoading,
            savedLocation?.source,
            searchQuery,
            selectedSpecialization,
            showSortOptions,
            sortBy,
        ]
    );

    return (
        <SafeAreaView style={[styles.container, isDark && styles.bgBackground]} edges={['top', 'left', 'right']}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#020817" : "#FFFFFF"} />
            <FlatList
                data={campaigns}
                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        <CampaignCard
                            campaign={item}
                            fullWidth
                            onPress={() => navigation.navigate('CampaignDetail', { id: item.id || item._id })}
                        />
                    </View>
                )}
                keyExtractor={(item, index) => (item._id || item.id || index.toString())}
                ListHeaderComponent={headerComponent}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={loading ? <CampaignListSkeleton /> : renderEmpty()}
                keyboardShouldPersistTaps="handled"
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
};

const BRAND_GREEN = '#0DA96E';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    listContent: {
        paddingBottom: 40,
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    searchInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#111827',
        fontWeight: '500',
    },
    sortButton: {
        width: 52,
        height: 52,
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sortButtonActive: {
        backgroundColor: '#D1F2E2',
    },
    specializationList: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    specChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 10,
    },
    specChipSelected: {
        backgroundColor: '#0DA96E',
        borderColor: '#0DA96E',
    },
    specChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    specChipTextSelected: {
        color: '#FFFFFF',
    },
    resultsHeader: {
        marginTop: 8,
        marginBottom: 16,
    },
    locationCard: {
        borderWidth: 1,
        borderColor: '#D1F2E2',
        backgroundColor: '#F0FDF7',
        borderRadius: 18,
        padding: 14,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    locationCardDark: {
        backgroundColor: 'rgba(6, 78, 59, 0.22)',
        borderColor: 'rgba(16, 185, 129, 0.22)',
    },
    locationTextWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        marginLeft: 8,
        color: '#334155',
        fontSize: 12,
        fontWeight: '700',
        flex: 1,
    },
    locationButton: {
        minWidth: 104,
        minHeight: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1F2E2',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    locationButtonText: {
        color: '#0DA96E',
        fontSize: 11,
        fontWeight: '800',
    },
    resultsCount: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    cardWrapper: {
        paddingHorizontal: 20,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerLoaderText: {
        marginLeft: 10,
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '500',
    },
    sortOptionsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
    },
    sortTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
    },
    sortOptionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    sortOption: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    sortOptionSelected: {
        backgroundColor: '#D1F2E2',
    },
    sortOptionText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
    },
    sortOptionTextSelected: {
        color: '#0DA96E',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    resetButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#0DA96E',
        borderRadius: 12,
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
    },
    bgBackground: {
        backgroundColor: '#020817',
    },
    searchContainerDark: {
        backgroundColor: 'transparent',
    },
    searchInputWrapperDark: {
        backgroundColor: '#1F2937',
    },
    textWhite: {
        color: '#F9FAFB',
    },
    textGray400: {
        color: '#94A3B8',
    },
    sortButtonDark: {
        backgroundColor: '#1F2937',
    },
    sortButtonActiveDark: {
        backgroundColor: '#064E3B',
    },
    specChipDark: {
        backgroundColor: '#1F2937',
        borderColor: '#374151',
    },
    sortOptionsCardDark: {
        backgroundColor: '#111827',
        borderColor: '#1F2937',
    },
    sortOptionDark: {
        backgroundColor: '#1F2937',
    },
    sortOptionSelectedDark: {
        backgroundColor: '#064E3B',
    },
    emptyIconContainerDark: {
        backgroundColor: '#1F2937',
    },
});

export default DoctorsScreen;
