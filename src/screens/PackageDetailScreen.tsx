import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import Feather from 'react-native-vector-icons/Feather';
import { RootDrawerParamList } from '../navigation/types';
import { useColorScheme } from 'nativewind';

type Props = DrawerScreenProps<RootDrawerParamList, 'PackageDetail'>;
const { width } = Dimensions.get('window');

const PackageDetailScreen = ({ route, navigation }: Props) => {
    const { title, price, features, image, isRecommended } = route.params;
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const testDetails = [
        { name: 'Liver Function Test', description: 'Assesses the health of your liver by measuring levels of proteins, liver enzymes, and bilirubin in your blood.' },
        { name: 'Kidney Function Test', description: 'Evaluates how well your kidneys are working by measuring urea, creatinine, and electrolytes.' },
        { name: 'Lipid Profile', description: 'Measures cholesterol and triglyceride levels to determine your risk of heart disease.' },
        { name: 'Complete Blood Count (CBC)', description: 'Checks for anemia, infection, and various other conditions by analyzing blood components.' },
        { name: 'Hba1c / Blood Sugar', description: 'Essential for monitoring glucose levels and diagnosing diabetes.' },
    ];

    return (
        <SafeAreaView style={[styles.container, isDark && styles.bgDark]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <View style={styles.imageContainer}>
                    <Image source={image} style={styles.heroImage} resizeMode="cover" />
                    <View style={styles.headerOverlay}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Home')}
                            style={styles.backButton}
                        >
                            <Feather name="chevron-left" size={28} color="#111827" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.contentCard, isDark && styles.contentCardDark]}>
                    <View style={styles.topInfo}>
                        {isRecommended && (
                            <View style={styles.recommendedBadge}>
                                <Text style={styles.recommendedText}>MOST POPULAR</Text>
                            </View>
                        )}
                        <Text style={[styles.title, isDark && styles.textWhite]}>{title}</Text>
                        <Text style={[styles.features, isDark && styles.textGray]}>{features}</Text>
                    </View>

                    <View style={[styles.divider, isDark && styles.dividerDark]} />

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, isDark && styles.textWhite]}>Included Tests</Text>
                        <Text style={[styles.sectionSubtitle, isDark && styles.textGray]}>Comprehensive coverage for better health monitoring</Text>

                        {testDetails.map((test, index) => (
                            <View key={index} style={styles.testItem}>
                                <View style={styles.testIcon}>
                                    <Feather name="check-circle" size={16} color="#0DA96E" />
                                </View>
                                <View style={styles.testInfo}>
                                    <Text style={[styles.testName, isDark && styles.textWhite]}>{test.name}</Text>
                                    <Text style={[styles.testDescription, isDark && styles.textGray]}>{test.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.prepSection}>
                        <View style={styles.prepCard}>
                            <Feather name="info" size={20} color="#0DA96E" />
                            <View style={styles.prepTextContent}>
                                <Text style={styles.prepTitle}>Preparation Needed</Text>
                                <Text style={styles.prepText}>10-12 hours fasting required. Do not consume tea, coffee or food in the morning.</Text>
                            </View>
                        </View>
                    </View>

                    {/* Add spacing for bottom bar */}
                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            <View style={[styles.bottomBar, isDark && styles.bottomBarDark]}>
                <View>
                    <Text style={[styles.priceLabel, isDark && styles.textGray]}>Total Amount</Text>
                    <View style={styles.priceContainer}>
                        <Text style={[styles.currentPrice, isDark && styles.textWhite]}>{price}</Text>
                        <Text style={styles.oldPrice}>₹2999</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.comingSoonButton} disabled={true}>
                    <Text style={styles.comingSoonButtonText}>Coming Soon</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    bgDark: {
        backgroundColor: '#020617',
    },
    imageContainer: {
        position: 'relative',
        height: 350,
        backgroundColor: '#E2E8F0',
    },
    heroImage: {
        width: width,
        height: '100%',
    },
    headerOverlay: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    contentCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: -40,
        paddingHorizontal: 24,
        paddingTop: 32,
    },
    contentCardDark: {
        backgroundColor: '#0F172A',
    },
    topInfo: {
        marginBottom: 24,
    },
    recommendedBadge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    recommendedText: {
        color: '#065F46',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
    },
    features: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginBottom: 24,
    },
    dividerDark: {
        backgroundColor: '#1E293B',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#94A3B8',
        marginBottom: 20,
    },
    testItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    testIcon: {
        marginTop: 2,
        marginRight: 12,
    },
    testInfo: {
        flex: 1,
    },
    testName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 4,
    },
    testDescription: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
    },
    prepSection: {
        marginBottom: 24,
    },
    prepCard: {
        backgroundColor: '#F0FDF4',
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#DCFCE7',
    },
    prepTextContent: {
        flex: 1,
        marginLeft: 12,
    },
    prepTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#166534',
        marginBottom: 2,
    },
    prepText: {
        fontSize: 12,
        color: '#166534',
        lineHeight: 18,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 34,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 20,
    },
    bottomBarDark: {
        backgroundColor: '#0F172A',
        borderTopColor: '#1E293B',
    },
    priceLabel: {
        fontSize: 12,
        color: '#94A3B8',
        marginBottom: 2,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    currentPrice: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
    },
    oldPrice: {
        fontSize: 14,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
        marginLeft: 8,
    },
    comingSoonButton: {
        backgroundColor: '#E2E8F0',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 16,
    },
    comingSoonButtonText: {
        color: '#94A3B8',
        fontSize: 16,
        fontWeight: '700',
    },
    textWhite: { color: '#F8FAFC' },
    textGray: { color: '#94A3B8' },
});

export default PackageDetailScreen;
