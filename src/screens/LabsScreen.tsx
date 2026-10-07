import React, { useEffect, useState, useCallback } from 'react';
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
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { useColorScheme } from 'nativewind';
import { publicService, Campaign } from '../services/publicService';
import CampaignCard from '../components/CampaignCard';
import { CampaignListSkeleton } from '../components/CampaignSkeleton';

const LAB_CATEGORIES = [
    "All",
    "Health Checkup",
    "Blood Test",
    "Imaging",
    "Radiology",
    "COVID Care",
    "Diabetes",
    "Heart Care"
];

const SORT_OPTIONS = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price (Low-High)', value: 'price_asc' },
    { label: 'Price (High-Low)', value: 'price_desc' },
];

const SWASTHIFY_POINTS = [
    'Trusted healthcare discovery for doctors, labs, and preventive care.',
    'Simple appointment booking with clear service information.',
    'Digital-first health records that stay accessible when you need them.',
    'Curated care journeys designed for everyday health needs.',
    'Location-aware discovery to help find relevant care nearby.',
    'Transparent package and campaign details before booking.',
    'Patient-friendly profile management for personal and health information.',
    'Secure authentication and protected account access.',
    'Helpful AI assistant support across the care experience.',
    'Built to make healthcare easier, faster, and more understandable.',
];

const LabsScreen = () => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const navigation = useNavigation<any>();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('featured');
    const [showSortOptions, setShowSortOptions] = useState(false);

    const fetchLabs = useCallback(async (pageNum: number, isNewSearch: boolean = false) => {
        if (pageNum > 1 && !hasMore) return;

        if (isNewSearch) {
            setLoading(true);
            setPage(1);
        } else {
            setLoadingMore(true);
        }

        try {
            const data = await publicService.getCampaigns({
                source: 'lab',
                limit: 10,
                page: pageNum,
                search: searchQuery,
                specialization: selectedCategory === 'All' ? undefined : selectedCategory,
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
            console.error('Error fetching labs:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [searchQuery, selectedCategory, sortBy, hasMore]);

    useEffect(() => {
        fetchLabs(1, true);
    }, [selectedCategory, sortBy]);

    const handleSearchSubmit = () => {
        fetchLabs(1, true);
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchLabs(nextPage);
        }
    };

    const renderComingSoonBanner = () => (
        <View style={[styles.comingSoonBanner, isDark && styles.comingSoonBannerDark]}>
            <View style={styles.bannerTopRow}>
                <View style={[styles.bannerIconWrap, isDark && styles.bannerIconWrapDark]}>
                    <Feather name="clock" size={22} color="#D97706" />
                </View>
                <View style={styles.bannerTextWrap}>
                    <View style={[styles.comingSoonPill, isDark && styles.comingSoonPillDark]}>
                        <Text style={[styles.comingSoonPillText, isDark && styles.comingSoonPillTextDark]}>
                            Coming soon
                        </Text>
                    </View>
                    <Text style={[styles.bannerTitle, isDark && styles.textWhite]}>
                        Lab tests are almost ready
                    </Text>
                    <Text style={[styles.bannerDescription, isDark && styles.textZinc400]}>
                        We are preparing trusted diagnostics, easy test discovery, and digital reports so you can book lab care with confidence.
                    </Text>
                </View>
            </View>
            <View style={styles.bannerAccent} />
        </View>
    );

    const renderHeader = () => (
        <>
            <View style={styles.headerContainer}>
                {renderComingSoonBanner()}
                <View style={styles.searchContainer}>
                    <View style={[styles.searchInputWrapper, isDark && styles.searchInputWrapperDark]}>
                        <Feather name="search" size={20} color={isDark ? "#94A3B8" : "#6B7280"} />
                        <TextInput
                            style={[styles.searchInput, isDark && styles.textWhite]}
                            placeholder="Search tests, labs..."
                            placeholderTextColor={isDark ? "#64748B" : "#9CA3AF"}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearchSubmit}
                            returnKeyType="search"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => { setSearchQuery(''); fetchLabs(1, true); }}>
                                <Feather name="x" size={18} color={isDark ? "#94A3B8" : "#6B7280"} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity
                        style={[styles.sortButton, isDark && styles.sortButtonDark, sortBy !== 'featured' && (isDark ? styles.sortButtonActiveDark : styles.sortButtonActive)]}
                        onPress={() => setShowSortOptions(!showSortOptions)}
                    >
                        <Feather name="sliders" size={20} color={sortBy !== 'featured' ? BRAND_GREEN : (isDark ? '#94A3B8' : '#374151')} />
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
                                        sortBy === option.value && (isDark ? styles.sortOptionSelectedDark : styles.sortOptionSelected)
                                    ]}
                                    onPress={() => {
                                        setSortBy(option.value);
                                        setShowSortOptions(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.sortOptionText,
                                        isDark && styles.textZinc400,
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
                    <Text style={[styles.resultsCount, isDark && styles.textWhite]}>
                        {campaigns.length} {campaigns.length === 1 ? 'Lab Test' : 'Lab Tests'} found
                    </Text>
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryList}
            >
                {LAB_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[
                            styles.catChip,
                            isDark && styles.catChipDark,
                            selectedCategory === cat && styles.catChipSelected
                        ]}
                        onPress={() => setSelectedCategory(cat)}
                    >
                        <Text style={[
                            styles.catChipText,
                            isDark && styles.textZinc400,
                            selectedCategory === cat && styles.catChipTextSelected
                        ]}>
                            {cat}
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
                <Text style={styles.footerLoaderText}>Loading more tests...</Text>
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <View style={[styles.emptyIconContainer, isDark && styles.emptyIconContainerDark]}>
                    <Feather name="activity" size={48} color={BRAND_GREEN} style={{ opacity: 0.2 }} />
                </View>
                <Text style={[styles.emptyTitle, isDark && styles.textWhite]}>No tests found</Text>
                <Text style={[styles.emptySubtitle, isDark && styles.textZinc400]}>
                    Try adjusting your filters or search terms
                </Text>
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setSortBy('featured');
                        fetchLabs(1, true);
                    }}
                >
                    <Text style={styles.resetButtonText}>Reset Filters</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top', 'left', 'right']}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#09090b" : "#FFFFFF"} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.comingSoonPageContent}
            >
                {renderComingSoonBanner()}

                <View style={[styles.pointsCard, isDark && styles.pointsCardDark]}>
                    <Text style={[styles.pointsEyebrow, isDark && styles.textZinc400]}>Why Swasthify</Text>
                    <Text style={[styles.pointsTitle, isDark && styles.textWhite]}>
                        Built for simple, connected healthcare
                    </Text>
                    <Text style={[styles.pointsDescription, isDark && styles.textZinc400]}>
                        While lab bookings are being prepared, here is what Swasthify is designed to bring into one care experience.
                    </Text>

                    <View style={styles.pointsList}>
                        {SWASTHIFY_POINTS.map((point, index) => (
                            <View key={point} style={styles.pointItem}>
                                <View style={styles.pointNumber}>
                                    <Text style={styles.pointNumberText}>{index + 1}</Text>
                                </View>
                                <Text style={[styles.pointText, isDark && styles.textZinc400]}>{point}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Search, filters, results, and empty-state UI are intentionally hidden until lab bookings launch.
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
                ListEmptyComponent={loading ? <CampaignListSkeleton /> : renderEmpty()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
            */}
        </SafeAreaView>
    );
};

const BRAND_GREEN = '#0DA96E';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    containerDark: {
        backgroundColor: '#09090b',
    },
    listContent: {
        paddingBottom: 40,
    },
    comingSoonPageContent: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 40,
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    comingSoonBanner: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D9F3E8',
        borderRadius: 28,
        marginBottom: 18,
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 18,
        elevation: 3,
    },
    comingSoonBannerDark: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
    },
    bannerTopRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 18,
    },
    bannerIconWrap: {
        width: 52,
        height: 52,
        borderRadius: 18,
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FDE68A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    bannerIconWrapDark: {
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        borderColor: 'rgba(245, 158, 11, 0.22)',
    },
    bannerTextWrap: {
        flex: 1,
    },
    comingSoonPill: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 999,
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FDE68A',
        marginBottom: 10,
    },
    comingSoonPillDark: {
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        borderColor: 'rgba(245, 158, 11, 0.22)',
    },
    comingSoonPillText: {
        color: '#D97706',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    comingSoonPillTextDark: {
        color: '#FCD34D',
    },
    bannerTitle: {
        color: '#111827',
        fontSize: 21,
        fontWeight: '800',
        marginBottom: 8,
        lineHeight: 27,
    },
    bannerDescription: {
        color: '#64748B',
        fontSize: 13,
        fontWeight: '500',
        lineHeight: 21,
    },
    bannerAccent: {
        height: 6,
        backgroundColor: '#0DA96E',
    },
    pointsCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D9F3E8',
        borderRadius: 28,
        padding: 20,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 2,
    },
    pointsCardDark: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
    },
    pointsEyebrow: {
        color: '#0DA96E',
        fontSize: 11,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    pointsTitle: {
        color: '#111827',
        fontSize: 23,
        fontWeight: '800',
        lineHeight: 30,
        marginBottom: 8,
    },
    pointsDescription: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 22,
        marginBottom: 18,
    },
    pointsList: {
        gap: 12,
    },
    pointItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    pointNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#0DA96E',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 1,
    },
    pointNumberText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '900',
    },
    pointText: {
        flex: 1,
        color: '#334155',
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 21,
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
    searchInputWrapperDark: {
        backgroundColor: '#18181b',
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
    sortButtonDark: {
        backgroundColor: '#18181b',
    },
    sortButtonActive: {
        backgroundColor: '#D1F2E2',
    },
    sortButtonActiveDark: {
        backgroundColor: '#064e3b',
    },
    categoryList: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    catChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 10,
    },
    catChipDark: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
    },
    catChipSelected: {
        backgroundColor: '#0DA96E',
        borderColor: '#0DA96E',
    },
    catChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    catChipTextSelected: {
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
    sortOptionsCardDark: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
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
    sortOptionDark: {
        backgroundColor: '#27272a',
    },
    sortOptionSelected: {
        backgroundColor: '#D1F2E2',
    },
    sortOptionSelectedDark: {
        backgroundColor: '#064e3b',
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
    emptyIconContainerDark: {
        backgroundColor: '#18181b',
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
    textWhite: {
        color: '#FFFFFF',
    },
    textZinc400: {
        color: '#A1A1AA',
    },
});

export default LabsScreen;
