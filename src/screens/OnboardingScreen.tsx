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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
        image: require('../assets/onboarding_1.png'),
    },
    {
        id: '2',
        title: 'Experts in every \nspecialty',
        description: 'Connect with over 500+ certified healthcare professionals across 30+ specialties.',
        highlight: 'every',
        image: require('../assets/onboarding_2.png'),
    },
    {
        id: '3',
        title: 'Your health \nin your pocket',
        description: 'Instant access to medical records, prescriptions and reports anywhere, anytime.',
        highlight: 'pocket',
        image: require('../assets/onboarding_3.png'),
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
        const slide = SLIDES[index];
        return (
            <View style={styles.illustrationContainer}>
                <View style={styles.illustrationBg} />
                <Image 
                    source={slide.image} 
                    style={styles.image} 
                    resizeMode="contain"
                />

                {index === 0 && (
                    <>
                        <View style={[styles.floatingChip, styles.chipAmber]}>
                            <Heart size={14} color="#B45309" />
                            <Text style={styles.chipTextAmber}>Care</Text>
                        </View>
                        <View style={[styles.floatingChip, styles.chipCoral]}>
                            <Activity size={14} color="#991B1B" />
                            <Text style={styles.chipTextCoral}>24/7</Text>
                        </View>
                    </>
                )}
                
                {index === 1 && (
                    <View style={[styles.floatingChip, styles.chipGreen]}>
                        <Video size={14} color="#065F46" />
                        <Text style={styles.chipTextGreen}>Experts</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
        width: 320,
        height: 320,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    illustrationBg: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: '#F0FDF4',
    },
    image: {
        width: 300,
        height: 300,
        zIndex: 1,
    },
    floatingChip: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 2,
    },
    chipAmber: {
        top: 40,
        right: 20,
        backgroundColor: '#FEF3C7',
    },
    chipTextAmber: {
        fontSize: 12,
        fontWeight: '700',
        color: '#B45309',
        marginLeft: 6,
    },
    chipCoral: {
        bottom: 60,
        left: 20,
        backgroundColor: '#FEE2E2',
    },
    chipTextCoral: {
        fontSize: 12,
        fontWeight: '700',
        color: '#991B1B',
        marginLeft: 6,
    },
    chipGreen: {
        top: 60,
        left: 20,
        backgroundColor: '#DCFCE7',
    },
    chipTextGreen: {
        fontSize: 12,
        fontWeight: '700',
        color: '#065F46',
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
