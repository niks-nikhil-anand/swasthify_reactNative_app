import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    Image,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RootDrawerParamList } from '../navigation/types';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const { width, height } = Dimensions.get('window');

const BRAND_GREEN = '#0DA96E';

const SLIDES = [
    {
        id: '1',
        title: 'Book OPD with Nearby Doctors',
        description: 'Find and book appointments with top-rated doctors in your vicinity for quick and personalized consultations.',
        image: require('../assets/onboarding_doctor.png'),
    },
    {
        id: '2',
        title: 'Lab Tests at Home',
        description: 'Book diagnostic tests and full body checkups easily. Our professionals will collect samples from your doorstep.',
        image: require('../assets/onboarding_lab_test.png'),
    },
    {
        id: '3',
        title: 'Digital Health Records',
        description: 'Keep all your medical reports and ABHA records secure and accessible anytime, anywhere.',
        image: require('../assets/onboarding_health_records.png'),
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

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            handleGetStarted();
        }
    };

    const handleGetStarted = async () => {
        await completeOnboarding();
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
        });
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
                        outputRange: [10, 20, 10],
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 3 }}>
                <FlatList
                    data={SLIDES}
                    renderItem={({ item }) => (
                        <View style={styles.slide}>
                            <Image source={item.image} style={styles.image} resizeMode="contain" />
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </View>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            <View style={styles.footer}>
                <Paginator />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextText}>
                            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    image: {
        width: width * 0.8,
        height: height * 0.4,
        marginBottom: 40,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        width: '100%',
        paddingBottom: 40,
    },
    paginatorContainer: {
        flexDirection: 'row',
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    skipButton: {
        padding: 20,
    },
    skipText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: BRAND_GREEN,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        minWidth: 120,
        alignItems: 'center',
    },
    nextText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default OnboardingScreen;
