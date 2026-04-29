import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    Animated,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RootDrawerParamList } from '../navigation/types';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ArrowRight, Video, Heart, Activity } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const BRAND_GREEN = '#0EA968';

const SLIDES = [
    {
        id: '1',
        title: 'Care that comes \nto you',
        description: 'Book doctors, lab tests, and health packages — all in one place, designed for India.',
        highlight: 'to you',
    },
    {
        id: '2',
        title: 'Experts in every \nspecialty',
        description: 'Connect with over 500+ certified healthcare professionals across 30+ specialties.',
        highlight: 'every',
    },
    {
        id: '3',
        title: 'Your health \nin your pocket',
        description: 'Instant access to medical records, prescriptions and reports anywhere, anytime.',
        highlight: 'pocket',
    },
];

interface OnboardingScreenProps {
    navigation: DrawerNavigationProp<RootDrawerParamList>;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList>(null);
    const { completeOnboarding } = useAuth();

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleGetStarted = async () => {
        await completeOnboarding();
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
        });
    };

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            handleGetStarted();
        }
    };

    const handleSkip = () => {
        handleGetStarted();
    };

    const Paginator = () => {
        return (
            <View style={styles.paginatorContainer}>
                {SLIDES.map((_, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [6, 22, 6],
                        extrapolate: 'clamp',
                    });
                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            style={[
                                styles.dot,
                                { width: dotWidth, opacity, backgroundColor: BRAND_GREEN },
                            ]}
                            key={i.toString()}
                        />
                    );
                })}
            </View>
        );
    };

    const Illustration = ({ index }: { index: number }) => {
        return (
            <View style={styles.illustrationContainer}>
                {/* Background Gradient card mock */}
                <View style={styles.illustrationBg} />
                
                {/* Central Card */}
                <View style={styles.centerCard}>
                    <View style={styles.avatarContainer}>
                        <Video size={28} color="#FFFFFF" />
                    </View>
                    <Text style={styles.drName}>Dr. Asha</Text>
                    <Text style={styles.drSpecialty}>Cardiology</Text>
                    <View style={styles.liveChip}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>Live</Text>
                    </View>
                </View>

                {/* Floating Chips */}
                <View style={[styles.floatingChip, styles.chipAmber]}>
                    <Heart size={14} color="#B45309" />
                    <Text style={styles.chipTextAmber}>72 BPM</Text>
                </View>
                
                <View style={[styles.floatingChip, styles.chipCoral]}>
                    <Activity size={14} color="#991B1B" />
                    <Text style={styles.chipTextCoral}>Healthy</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.topHeader}>
                    <TouchableOpacity onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={SLIDES}
                    renderItem={({ item, index }) => (
                        <View style={styles.slide}>
                            <Illustration index={index} />
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>
                                    {item.title.split(item.highlight)[0]}
                                    <Text style={styles.highlightText}>{item.highlight}</Text>
                                    {item.title.split(item.highlight)[1]}
                                </Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </View>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                    keyExtractor={(item) => item.id}
                />

                <View style={styles.footer}>
                    <Paginator />
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>
                            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                        <ArrowRight size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                    
                    <View style={styles.signInLink}>
                        <Text style={styles.memberText}>Already a member? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                            <Text style={styles.signInText}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    safeArea: {
        flex: 1,
    },
    topHeader: {
        paddingHorizontal: 24,
        paddingTop: 10,
        alignItems: 'flex-end',
    },
    skipText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
    },
    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    illustrationContainer: {
        width: 280,
        height: 260,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    illustrationBg: {
        position: 'absolute',
        width: 260,
        height: 240,
        borderRadius: 32,
        backgroundColor: '#E6F6EF',
        transform: [{ rotate: '-2deg' }],
    },
    centerCard: {
        width: 150,
        height: 210,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0EA968',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#0EA968',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    drName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0F172A',
    },
    drSpecialty: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    liveChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6F6EF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 12,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#0EA968',
        marginRight: 6,
    },
    liveText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#0EA968',
    },
    floatingChip: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    chipAmber: {
        top: 20,
        right: 0,
        backgroundColor: '#FEF3C7',
    },
    chipTextAmber: {
        fontSize: 12,
        fontWeight: '700',
        color: '#B45309',
        marginLeft: 6,
    },
    chipCoral: {
        bottom: 30,
        left: -10,
        backgroundColor: '#FEE2E2',
    },
    chipTextCoral: {
        fontSize: 12,
        fontWeight: '700',
        color: '#991B1B',
        marginLeft: 6,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 34,
        fontWeight: '900',
        color: '#0F172A',
        textAlign: 'center',
        lineHeight: 42,
        letterSpacing: -1,
    },
    highlightText: {
        color: '#0EA968',
    },
    description: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    paginatorContainer: {
        flexDirection: 'row',
        height: 10,
        marginBottom: 30,
    },
    dot: {
        height: 6,
        borderRadius: 3,
        marginHorizontal: 3,
    },
    nextButton: {
        width: '100%',
        height: 56,
        backgroundColor: BRAND_GREEN,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: BRAND_GREEN,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    signInLink: {
        flexDirection: 'row',
        marginTop: 20,
    },
    memberText: {
        fontSize: 14,
        color: '#64748B',
    },
    signInText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#0EA968',
    },
});

export default OnboardingScreen;
