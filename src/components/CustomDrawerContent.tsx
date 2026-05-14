import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, Pressable } from 'react-native';
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
    DrawerContentScrollView,
    DrawerItemList,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import Icon from './Icon';

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
        <SafeAreaView className="flex-1 bg-white dark:bg-[#09090B]">
            {/* Premium Header Profile Section */}
            <View className="px-[18px] pt-6 pb-[14px] border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#09090B]">
                {user ? (
                    <View className="flex-row items-center">
                        <View className="relative">
                            <Image
                                source={user && user.profilePic && !imgError ? { uri: user.profilePic } : require('../assets/user_avatar.png')}
                                className="w-14 h-14 rounded-full border border-gray-100 dark:border-slate-800"
                                style={{ width: 56, height: 56 }}
                                onError={() => setImgError(true)}
                            />
                            <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#09090B]" />
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="text-[16px] text-slate-900 dark:text-white" style={{ fontWeight: '800', fontFamily: 'Plus Jakarta Sans' }} numberOfLines={1}>
                                {user.name}
                            </Text>
                            <Text className="text-[12px] text-slate-500 dark:text-slate-400" style={{ fontWeight: '400', fontFamily: 'Plus Jakarta Sans' }} numberOfLines={1}>
                                {user.email || 'Member'}
                            </Text>
                            <View className="flex-row mt-1">
                                <View className="bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                                    <Text className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400" style={{ fontFamily: 'Plus Jakarta Sans' }}>● Online</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 items-center justify-center ml-2 border border-slate-100 dark:border-white/5"
                            style={{ width: 32, height: 32, borderRadius: 10 }}
                            onPress={() => navigation.closeDrawer()}
                        >
                            <Icon name="back" size={16} color={isDark ? "#94A3B8" : "#475569"} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <Image
                                source={require('../assets/logo.png')}
                                style={{ width: 38, height: 38, marginRight: 12 }}
                                resizeMode="contain"
                            />
                            <View>
                                <Text className="text-[20px] font-black text-[#0DA96E] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>Swasthify</Text>
                                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'Plus Jakarta Sans' }}>Healthcare</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 items-center justify-center ml-2 border border-slate-100 dark:border-white/5"
                            style={{ width: 32, height: 32, borderRadius: 10 }}
                            onPress={() => navigation.closeDrawer()}
                        >
                            <Icon name="back" size={16} color={isDark ? "#94A3B8" : "#475569"} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Navigation Options */}
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ paddingTop: 0 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="px-1.5">
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            {/* Premium Footer Settings Section */}
            <View className="px-[18px] pt-2 pb-8 bg-white dark:bg-[#09090B]">
                
                {/* Theme Toggle Card */}
                <View className="flex-row items-center justify-between p-[10px] mb-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                    <View className="flex-row items-center flex-1">
                        <View className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 items-center justify-center shadow-sm">
                            <Icon name="sun" size={18} color={isDark ? "#94A3B8" : "#F59E0B"} />
                        </View>
                        <Text className="text-[13px] font-bold text-slate-800 dark:text-slate-200 ml-3" style={{ fontFamily: 'Plus Jakarta Sans' }}>
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
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: user ? '#FEF2F2' : '#E6F6EF',
                    }}
                    onPress={handleAuthAction}
                    activeOpacity={0.8}
                >
                    <Icon name={user ? "logout" : "log-in"} size={18} color={user ? '#DC2626' : '#0DA96E'} />
                    <Text style={{ 
                        fontWeight: '800', 
                        fontSize: 14, 
                        marginLeft: 8, 
                        color: user ? '#DC2626' : '#0DA96E',
                        fontFamily: 'Plus Jakarta Sans'
                    }}>
                        {user ? 'Log out' : 'Sign in'}
                    </Text>
                </TouchableOpacity>

                {/* Footer Subtext */}
                <View className="items-center mt-3">
                    <Text className="text-[11px] font-bold text-slate-400 dark:text-slate-500" style={{ fontFamily: 'Plus Jakarta Sans' }}>Swasthify v1.0.0</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
