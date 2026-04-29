import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Animated as RNAnimated } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Circle, G, Rect, Filter, FeGaussianBlur } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const scale = useSharedValue(0.5);
    const opacity = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(1, {
            damping: 12,
            stiffness: 90,
        });
        opacity.value = withTiming(1, { duration: 1000 });

        const timer = setTimeout(() => {
            onFinish();
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: opacity.value,
        };
    });

    return (
        <View style={styles.container}>
            {/* SVG Background with Gradients and Blobs */}
            <View style={StyleSheet.absoluteFill}>
                <Svg height={height} width={width}>
                    <Defs>
                        <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#E6F7EE" stopOpacity="1" />
                            <Stop offset="0.6" stopColor="#FFFFFF" stopOpacity="1" />
                        </LinearGradient>
                        <Filter id="blur">
                            <FeGaussianBlur stdDeviation="20" />
                        </Filter>
                    </Defs>
                    
                    {/* Main Background */}
                    <Rect width={width} height={height} fill="url(#bg)" />

                    {/* Decorative Blobs */}
                    <Circle cx={width + 20} cy={-20} r={100} fill="#0EA968" fillOpacity="0.12" filter="url(#blur)" />
                    <Circle cx={-40} cy={height - 120} r={120} fill="#F59E0B" fillOpacity="0.08" filter="url(#blur)" />
                </Svg>
            </View>

            <Animated.View style={[styles.content, animatedStyle]}>
                {/* Logo with shadow effect */}
                <View style={styles.logoOuter}>
                    <View style={styles.logoInner}>
                        <Image
                            source={require('../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.brandText}>swasthify</Text>
                    <Text style={styles.taglineText}>HEALTH, SIMPLIFIED.</Text>
                </View>
            </Animated.View>

            <Animated.View style={[styles.footer, { opacity: opacity }]}>
                <Text style={styles.footerText}>BIHAR'S TRUSTED HEALTHCARE PLATFORM</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        zIndex: 1,
    },
    logoOuter: {
        shadowColor: '#0EA968',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
        elevation: 20,
    },
    logoInner: {
        width: 100,
        height: 100,
        borderRadius: 28,
        backgroundColor: '#0EA968',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    logo: {
        width: 60,
        height: 60,
        tintColor: '#FFFFFF',
    },
    textContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    brandText: {
        fontSize: 42,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -1.5,
    },
    taglineText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
        letterSpacing: 4,
        textTransform: 'uppercase',
        marginTop: 6,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 11,
        color: '#94A3B8',
        letterSpacing: 2,
        fontWeight: '600',
    },
});

export default SplashScreen;
