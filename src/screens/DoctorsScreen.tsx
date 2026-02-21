import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { publicService, Campaign } from '../services/publicService';
import CampaignCard from '../components/CampaignCard';
import { CampaignSectionSkeleton } from '../components/CampaignSkeleton';

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
    { label: 'Experience (High-Low)', value: 'experience_desc' },
    { label: 'Price (Low-High)', value: 'price_asc' },
    { label: 'Price (High-Low)', value: 'price_desc' },
];

const DoctorsScreen = () => {
    const navigation = useNavigation<any>();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('All');
    const [sortBy, setSortBy] = useState('featured');
    const [showSortOptions, setShowSortOptions] = useState(false);

    const fetchDoctors = useCallback(async (pageNum: number, isNewSearch: boolean = false) => {
        if (pageNum > 1 && !hasMore) return;

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
                sortBy: sortBy === 'featured' ? undefined : sortBy,
            });

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
            setLoading(false);
            setLoadingMore(false);
        }
    }, [searchQuery, selectedSpecialization, sortBy, hasMore]);

    useEffect(() => {
        fetchDoctors(1, true);
    }, [selectedSpecialization, sortBy]);

    const handleSearchSubmit = () => {
        fetchDoctors(1, true);
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
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputWrapper}>
                        <Feather name="search" size={20} color="#6B7280" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search doctors, clinics..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearchSubmit}
                            returnKeyType="search"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => { setSearchQuery(''); fetchDoctors(1, true); }}>
                                <Feather name="x" size={18} color="#6B7280" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity
                        style={[styles.sortButton, sortBy !== 'featured' && styles.sortButtonActive]}
                        onPress={() => setShowSortOptions(!showSortOptions)}
                    >
                        <Feather name="sliders" size={20} color={sortBy !== 'featured' ? '#0DA96E' : '#374151'} />
                    </TouchableOpacity>
                </View>

                {showSortOptions && (
                    <View style={styles.sortOptionsCard}>
                        <Text style={styles.sortTitle}>Sort By</Text>
                        <View style={styles.sortOptionsGrid}>
                            {SORT_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.sortOption,
                                        sortBy === option.value && styles.sortOptionSelected
                                    ]}
                                    onPress={() => {
                                        setSortBy(option.value);
                                        setShowSortOptions(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.sortOptionText,
                                        sortBy === option.value && styles.sortOptionTextSelected
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsCount}>
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
                            selectedSpecialization === spec && styles.specChipSelected
                        ]}
                        onPress={() => setSelectedSpecialization(spec)}
                    >
                        <Text style={[
                            styles.specChipText,
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
                <Text style={styles.footerLoaderText}>Loading more doctors...</Text>
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                    <Feather name="search" size={48} color="#0DA96E" style={{ opacity: 0.2 }} />
                </View>
                <Text style={styles.emptyTitle}>No doctors found</Text>
                <Text style={styles.emptySubtitle}>
                    Try adjusting your filters or search terms
                </Text>
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => {
                        setSearchQuery('');
                        setSelectedSpecialization('All');
                        setSortBy('featured');
                        fetchDoctors(1, true);
                    }}
                >
                    <Text style={styles.resetButtonText}>Reset Filters</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
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
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={loading ? <CampaignSectionSkeleton /> : renderEmpty()}
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
});

export default DoctorsScreen;
