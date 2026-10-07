import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, Pressable, ScrollView } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolateColor,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import {
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import Icon from './Icon';

import { useAuth } from '../context/AuthContext';

const BRAND_GREEN = '#0DA96E';

const drawerSections = [
    {
        title: 'Explore',
        items: [
            { route: 'Home', label: 'Home', icon: 'home' },
            { route: 'Doctors', label: 'Doctors', icon: 'doctor' },
            { route: 'Labs', label: 'Labs', icon: 'lab' },
            { route: 'HealthPackages', label: 'Health packages', icon: 'pkg' },
        ],
    },
    {
        title: 'My Care',
        items: [
            { route: 'Profile', label: 'My Profile', icon: 'user' },
            { route: 'Appointments', label: 'Appointments', icon: 'appointments' },
            { route: 'HealthRecords', label: 'Health records', icon: 'doc' },
        ],
    },
    {
        title: 'Support',
        items: [
            { route: 'Pricing', label: 'Pricing', icon: 'wallet' },
            { route: 'Contact', label: 'Contact', icon: 'mail' },
            { route: 'About', label: 'About', icon: 'info' },
        ],
    },
] as const;

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
            navigation.navigate('OTPLogin');
        } else {
            navigation.navigate('OTPLogin');
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

    const activeRoute = props.state.routeNames[props.state.index];

    const renderDrawerItem = (item: typeof drawerSections[number]['items'][number]) => {
        const isActive = activeRoute === item.route;
        const itemBackground = isActive
            ? isDark ? 'rgba(13, 169, 110, 0.16)' : '#E6F6EF'
            : 'transparent';
        const iconBackground = isActive
            ? isDark ? 'rgba(13, 169, 110, 0.2)' : '#D1F2E2'
            : isDark ? 'rgba(15, 23, 42, 0.86)' : '#F8FAFC';
        const labelColor = isActive
            ? isDark ? '#48C496' : BRAND_GREEN
            : isDark ? '#CBD5E1' : '#334155';

        return (
            <TouchableOpacity
                key={item.route}
                activeOpacity={0.82}
                onPress={() => navigation.navigate(item.route as never)}
                style={[
                    styles.drawerItem,
                    {
                        backgroundColor: itemBackground,
                        borderColor: isActive
                            ? isDark ? 'rgba(72, 196, 150, 0.22)' : 'rgba(13, 169, 110, 0.18)'
                            : 'transparent',
                    },
                ]}
            >
                {isActive && <View style={styles.activeIndicator} />}
                <View
                    style={[
                        styles.drawerIconWrap,
                        {
                            backgroundColor: iconBackground,
                            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(226, 232, 240, 0.72)',
                        },
                    ]}
                >
                    <Icon name={item.icon as any} size={18} color={isActive ? BRAND_GREEN : (isDark ? '#94A3B8' : '#64748B')} />
                </View>
                <Text
                    style={[
                        styles.drawerLabel,
                        {
                            color: labelColor,
                            fontWeight: isActive ? '800' : '600',
                        },
                    ]}
                    numberOfLines={1}
                >
                    {item.label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#09090B' : '#FFFFFF' }]}>
            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: isDark ? '#09090B' : '#FFFFFF',
                        borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                    },
                ]}
            >
                {user ? (
                    <View
                        style={[
                            styles.userCard,
                            {
                                backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                                borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                            },
                        ]}
                    >
                        <View style={styles.avatarWrap}>
                            <Image
                                source={user && user.profilePic && !imgError ? { uri: user.profilePic } : require('../assets/user_avatar.png')}
                                style={[
                                    styles.avatar,
                                    { borderColor: isDark ? '#1E293B' : '#F1F5F9' },
                                ]}
                                onError={() => setImgError(true)}
                            />
                            <View
                                style={[
                                    styles.statusDot,
                                    { borderColor: isDark ? '#0F172A' : '#FFFFFF' },
                                ]}
                            />
                        </View>
                        <View style={styles.userMeta}>
                            <Text style={[styles.userName, { color: isDark ? '#FFFFFF' : '#0F172A' }]} numberOfLines={1}>
                                {user.name}
                            </Text>
                            <Text style={[styles.userEmail, { color: isDark ? '#94A3B8' : '#64748B' }]} numberOfLines={1}>
                                {user.email || 'Member'}
                            </Text>
                            <View style={styles.onlineRow}>
                                <View
                                    style={[
                                        styles.onlinePill,
                                        {
                                            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5',
                                            borderColor: isDark ? 'rgba(16, 185, 129, 0.22)' : '#D1FAE5',
                                        },
                                    ]}
                                >
                                    <Text style={styles.onlineText}>Online</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.closeButton,
                                {
                                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                                    borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                                },
                            ]}
                            onPress={() => navigation.closeDrawer()}
                        >
                            <Icon name="back" size={16} color={isDark ? "#94A3B8" : "#475569"} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.guestHeader}>
                        <View style={styles.brandRow}>
                            <Image
                                source={require('../assets/logo.png')}
                                style={styles.brandLogo}
                                resizeMode="contain"
                            />
                            <View>
                                <Text style={styles.brandName}>Swasthify</Text>
                                <Text style={styles.brandSub}>Healthcare</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.guestCloseButton,
                                {
                                    backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                                    borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                                },
                            ]}
                            onPress={() => navigation.closeDrawer()}
                        >
                            <Icon name="back" size={16} color={isDark ? "#94A3B8" : "#475569"} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Navigation Options */}
            <ScrollView
                contentContainerStyle={{ paddingTop: 16, paddingBottom: 16, backgroundColor: isDark ? '#09090B' : '#FFFFFF' }}
                style={{ backgroundColor: isDark ? '#09090B' : '#FFFFFF' }}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.navBody, { backgroundColor: isDark ? '#09090B' : '#FFFFFF' }]}>
                    {drawerSections.map((section, sectionIndex) => (
                        <View key={section.title} style={sectionIndex > 0 ? styles.drawerSectionSpaced : undefined}>
                            <Text style={[styles.sectionLabel, { color: isDark ? '#64748B' : '#94A3B8' }]}>
                                {section.title}
                            </Text>
                            <View style={styles.sectionItems}>
                                {section.items.map(renderDrawerItem)}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View
                style={[
                    styles.footer,
                    {
                        backgroundColor: isDark ? '#09090B' : '#FFFFFF',
                        borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                    },
                ]}
            >
                
                <View
                    style={[
                        styles.themeCard,
                        {
                            backgroundColor: isDark ? '#0F172A' : 'rgba(248, 250, 252, 0.7)',
                            borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                        },
                    ]}
                >
                    <View style={styles.themeInfo}>
                        <View
                            style={[
                                styles.themeIcon,
                                {
                                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                                    borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                                },
                            ]}
                        >
                            <Icon name={isDark ? "moon" : "sun"} size={16} color={isDark ? "#94A3B8" : "#F59E0B"} />
                        </View>
                        <Text style={[styles.themeText, { color: isDark ? '#E2E8F0' : '#1E293B' }]}>
                            {isDark ? 'Dark theme' : 'Light theme'}
                        </Text>
                    </View>

                    <Pressable onPress={toggleTheme} hitSlop={10}>
                        <Animated.View style={[styles.customTrack, trackAnimatedStyle]}>
                            <Animated.View style={[styles.customThumb, thumbAnimatedStyle, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                                <Animated.View style={[styles.iconContainer, sunAnimatedStyle]}>
                                    <Icon name="sun" size={10} color="#F59E0B" />
                                </Animated.View>
                                <Animated.View style={[styles.iconContainer, moonAnimatedStyle, StyleSheet.absoluteFill]}>
                                    <Icon name="moon" size={10} color="#0DA96E" />
                                </Animated.View>
                            </Animated.View>
                        </Animated.View>
                    </Pressable>
                </View>

                {/* Log In/Out Primary Button */}
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 48,
                        borderRadius: 16,
                        backgroundColor: user ? '#FFF7F7' : '#F0FBF6',
                        borderColor: user ? '#FEE2E2' : '#CDEFE2',
                    }}
                    onPress={handleAuthAction}
                    activeOpacity={0.8}
                >
                    <Icon name={user ? "logout" : "log-in"} size={18} color={user ? '#DC2626' : '#0DA96E'} />
                    <Text style={{ 
                        fontWeight: '800', 
                        fontSize: 13,
                        marginLeft: 8, 
                        color: user ? '#DC2626' : '#0DA96E',
                        fontFamily: 'Plus Jakarta Sans'
                    }}>
                        {user ? 'Log out' : 'Sign in'}
                    </Text>
                </TouchableOpacity>

                {/* Footer Subtext */}
                <View style={styles.versionWrap}>
                    <Text style={[styles.versionText, { color: isDark ? '#64748B' : '#94A3B8' }]}>Swasthify v1.0.0</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        overflow: 'hidden',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 22,
        borderWidth: 1,
        padding: 14,
    },
    avatarWrap: {
        position: 'relative',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
    },
    statusDot: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        backgroundColor: '#10B981',
    },
    userMeta: {
        flex: 1,
        marginLeft: 14,
        paddingRight: 8,
    },
    userName: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '800',
    },
    userEmail: {
        marginTop: 2,
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 12,
        fontWeight: '400',
    },
    onlineRow: {
        flexDirection: 'row',
        marginTop: 6,
    },
    onlinePill: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        borderWidth: 1,
    },
    onlineText: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 10,
        fontWeight: '700',
        color: '#059669',
    },
    closeButton: {
        width: 34,
        height: 34,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    guestHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    brandRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    brandLogo: {
        width: 38,
        height: 38,
        marginRight: 12,
    },
    brandName: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 20,
        fontWeight: '900',
        color: BRAND_GREEN,
    },
    brandSub: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
        color: '#94A3B8',
        textTransform: 'uppercase',
    },
    guestCloseButton: {
        width: 32,
        height: 32,
        marginLeft: 8,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navBody: {
        paddingHorizontal: 16,
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 28,
        borderTopWidth: 1,
    },
    themeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
    },
    themeInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    themeIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    themeText: {
        marginLeft: 12,
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 13,
        fontWeight: '700',
    },
    versionWrap: {
        alignItems: 'center',
        marginTop: 12,
    },
    versionText: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 10,
        fontWeight: '600',
    },
    sectionLabel: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.7,
        marginBottom: 8,
        marginLeft: 8,
        textTransform: 'uppercase',
    },
    sectionItems: {
        gap: 6,
    },
    drawerSectionSpaced: {
        marginTop: 20,
    },
    drawerItem: {
        position: 'relative',
        minHeight: 54,
        borderRadius: 16,
        borderWidth: 1,
        paddingLeft: 12,
        paddingRight: 14,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    activeIndicator: {
        position: 'absolute',
        left: 0,
        top: 14,
        bottom: 14,
        width: 4,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        backgroundColor: BRAND_GREEN,
    },
    drawerIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    drawerLabel: {
        flex: 1,
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 14,
        lineHeight: 20,
    },
    customTrack: {
        width: 52,
        height: 30,
        borderRadius: 16,
        padding: 2,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    customThumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 4,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CustomDrawerContent;
