import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import Feather from 'react-native-vector-icons/Feather';

import { useAuth } from '../context/AuthContext';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { navigation } = props;
    const { user, logout } = useAuth();
    const { colorScheme, setColorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [user?.profilePic]);

    const handleAuthAction = async () => {
        if (user) {
            await logout();
            navigation.navigate('SignIn');
        } else {
            navigation.navigate('SignIn');
        }
    };

    const toggleValue = useSharedValue(isDark ? 1 : 0);

    useEffect(() => {
        toggleValue.value = withSpring(isDark ? 1 : 0, {
            damping: 15,
            stiffness: 120,
        });
    }, [isDark]);

    const toggleTheme = () => {
        const nextTheme = isDark ? 'light' : 'dark';
        setColorScheme(nextTheme);
    };

    const trackAnimatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            toggleValue.value,
            [0, 1],
            ['#E2E8F0', '#064E3B']
        );
        return { backgroundColor };
    });

    const thumbAnimatedStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            toggleValue.value,
            [0, 1],
            [2, 26]
        );
        return { transform: [{ translateX }] };
    });

    const sunAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(toggleValue.value, [0, 0.5], [1, 0], Extrapolate.CLAMP);
        const scale = interpolate(toggleValue.value, [0, 0.5], [1, 0], Extrapolate.CLAMP);
        return { opacity, transform: [{ scale }] };
    });

    const moonAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(toggleValue.value, [0.5, 1], [0, 1], Extrapolate.CLAMP);
        const scale = interpolate(toggleValue.value, [0.5, 1], [0, 1], Extrapolate.CLAMP);
        return { opacity, transform: [{ scale }] };
    });

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-white dark:bg-[#020817]">
            <View style={[styles.header, isDark && styles.headerDark]}>
                {user ? (
                    <View style={styles.profileContainer}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={user && user.profilePic && !imgError ? { uri: user.profilePic } : require('../assets/user_avatar.png')}
                                style={styles.profileImage}
                                onError={() => setImgError(true)}
                            />
                            <View style={[styles.onlineIndicator, isDark && { borderColor: '#111827' }]} />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text numberOfLines={1} style={[styles.profileName, isDark && styles.textWhite]}>{user.name}</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/logo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.logoText}>Swasthify</Text>
                    </View>
                )}

                <View style={styles.headerIcons}>
                    <TouchableOpacity
                        style={[styles.iconButton, isDark && styles.iconButtonDark]}
                        onPress={() => navigation.closeDrawer()}
                    >
                        <Feather
                            name="x"
                            size={20}
                            color={isDark ? "#94A3B8" : "#4B5563"}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.scrollContainer}
            >
                <View style={styles.navSection}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            <View style={[styles.footer, isDark && styles.footerDark]}>
                <View style={styles.themeToggleContainer}>
                    <View style={styles.themeInfo}>
                        <Feather name={isDark ? "moon" : "sun"} size={18} color={isDark ? "#94A3B8" : "#F59E0B"} />
                        <Text style={[styles.themeText, isDark && styles.textWhite]}>
                            {isDark ? 'Dark Mode' : 'Light Mode'}
                        </Text>
                    </View>

                    <Pressable onPress={toggleTheme} hitSlop={10}>
                        <Animated.View style={[styles.customTrack, trackAnimatedStyle]}>
                            <Animated.View style={[styles.customThumb, thumbAnimatedStyle]}>
                                <Animated.View style={[styles.iconContainer, sunAnimatedStyle]}>
                                    <Feather name="sun" size={10} color="#F59E0B" />
                                </Animated.View>
                                <Animated.View style={[styles.iconContainer, moonAnimatedStyle, StyleSheet.absoluteFill]}>
                                    <Feather name="moon" size={10} color="#0DA96E" />
                                </Animated.View>
                            </Animated.View>
                        </Animated.View>
                    </Pressable>
                </View>

                <TouchableOpacity
                    style={[styles.loginButton, isDark && styles.loginButtonDark, user && { borderColor: '#EF4444' }]}
                    onPress={handleAuthAction}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.loginButtonText, user && { color: '#EF4444' }]}>
                        {user ? 'Log out' : 'Log in'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const BRAND_GREEN = '#0DA96E';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.03)',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarWrapper: {
        position: 'relative',
    },
    profileImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: BRAND_GREEN,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        backgroundColor: '#10B981',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    profileInfo: {
        marginLeft: 12,
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    profileRole: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoImage: {
        width: 32,
        height: 32,
        marginRight: 10,
    },
    logoText: {
        fontSize: 22,
        fontWeight: '700',
        color: BRAND_GREEN,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F3F4F6', // gray-100
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    iconText: {
        fontSize: 18,
        color: '#374151', // gray-700
    },
    scrollContainer: {
        paddingTop: 0,
    },
    navSection: {
        paddingTop: 10,
    },
    footer: {
        paddingHorizontal: 16,
        paddingBottom: 30,
        paddingTop: 10,
    },
    loginButton: {
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    loginButtonText: {
        color: BRAND_GREEN,
        fontWeight: '600',
        fontSize: 16,
    },
    themeToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 4,
        marginBottom: 8,
    },
    themeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    themeText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4B5563',
        marginLeft: 10,
    },
    textWhite: {
        color: '#F9FAFB',
    },
    headerDark: {
        borderBottomColor: '#1F2937',
    },
    iconButtonDark: {
        backgroundColor: '#1F2937',
    },
    footerDark: {
        borderTopWidth: 1,
        borderTopColor: '#1F2937',
    },
    loginButtonDark: {
        borderColor: '#1F2937',
    },
    customTrack: {
        width: 52,
        height: 28,
        borderRadius: 14,
        padding: 2,
        justifyContent: 'center',
    },
    customThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        elevation: 3,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CustomDrawerContent;
