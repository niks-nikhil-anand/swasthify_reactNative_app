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

const { width, height } = Dimensions.get('window');

const BRAND_GREEN = '#0DA96E';

const SLIDES = [
    {
        id: '1',
        title: 'Book OPD with \nNearby Doctors',
        description: 'Find and book appointments with top-rated doctors in your vicinity for quick and personalized consultations.',
        image: require('../assets/onboarding_doctor.png'),
    },
    {
        id: '2',
        title: 'Lab Tests & \nDiagnostics',
        description: 'Professional sample collection from your doorstep. Track results and get expert insights digitally.',
        image: require('../assets/onboarding_lab_test.png'),
    },
    {
        id: '3',
        title: 'Secure Digital \nHealth Records',
        description: 'Keep your ABHA ID, reports, and prescriptions synchronized and secure in one place.',
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
                        outputRange: [10, 30, 10],
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
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <SafeAreaView style={styles.safeArea}>
                <TouchableOpacity
                    style={styles.skipTop}
                    onPress={handleSkip}
                    activeOpacity={0.7}
                >
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                <FlatList
                    data={SLIDES}
                    renderItem={({ item }) => (
                        <View style={styles.slide}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={item.image}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            </View>

                            <View style={styles.contentContainer}>
                                <View style={styles.card}>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={styles.description}>{item.description}</Text>
                                </View>
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

                <View style={styles.footer}>
                    <Paginator />

                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNext}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.nextText}>
                            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                    </TouchableOpacity>
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
    skipTop: {
        position: 'absolute',
        top: 20,
        right: 30,
        zIndex: 10,
        padding: 10,
    },
    slide: {
        width,
        height: height * 0.85,
    },
    imageContainer: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingTop: 40,
    },
    image: {
        width: width * 0.9,
        height: '100%',
    },
    contentContainer: {
        flex: 0.4,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 40,
    },
    description: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        paddingHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paginatorContainer: {
        flexDirection: 'row',
        height: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    nextButton: {
        backgroundColor: BRAND_GREEN,
        paddingHorizontal: 32,
        height: 56,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: BRAND_GREEN,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    nextText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    skipText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default OnboardingScreen;
