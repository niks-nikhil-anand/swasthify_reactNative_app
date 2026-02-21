import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const scale = useSharedValue(0.3);
    const opacity = useSharedValue(0);

    useEffect(() => {
        // Start animation
        scale.value = withSpring(1, {
            damping: 12,
            stiffness: 90,
        });
        opacity.value = withTiming(1, { duration: 800 });

        // Wait for animation to finish then call onFinish
        const timer = setTimeout(() => {
            onFinish();
        }, 2200);

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
            <Animated.View style={[styles.logoContainer, animatedStyle]}>
                <Image
                    source={require('../../src/assets/logo_splash.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Animated.Text style={styles.brandText}>Swasthify</Animated.Text>
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
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: width * 0.4,
        height: width * 0.4,
        marginBottom: 20,
    },
    brandText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#0DA96E', // BRAND_GREEN
        letterSpacing: 1,
    },
});

export default SplashScreen;
