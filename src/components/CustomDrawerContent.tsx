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
        <SafeAreaView className="flex-1 bg-[#F8FAFC] dark:bg-[#09090B]">
            {/* Premium Header Profile Section */}
            <View className="px-5 pt-8 pb-6 border-b border-gray-200/50 dark:border-white/5 bg-white dark:bg-[#111827]">
                {user ? (
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View className="relative shadow-sm">
                                <Image
                                    source={user && user.profilePic && !imgError ? { uri: user.profilePic } : require('../assets/user_avatar.png')}
                                    className="w-14 h-14 rounded-full border-2 border-[#0DA96E]"
                                    onError={() => setImgError(true)}
                                />
                                <View className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[2px] border-white dark:border-[#111827]" />
                            </View>
                            <View className="ml-4 flex-1 justify-center">
                                <Text className="text-xl font-extrabold text-slate-900 dark:text-white" numberOfLines={1}>
                                    {user.name}
                                </Text>
                                <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5" numberOfLines={1}>
                                    {user.email || 'Welcome Back'}
                                </Text>
                            </View>
                        </View>
                        
                        {/* Close button relocated for a cleaner look */}
                        <TouchableOpacity
                            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center ml-2"
                            onPress={() => navigation.closeDrawer()}
                        >
                            <Feather name="chevron-left" size={18} color={isDark ? "#94A3B8" : "#475569"} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1 pt-2">
                            <Image
                                source={require('../assets/logo.png')}
                                style={{ width: 38, height: 38, marginRight: 12 }}
                                resizeMode="contain"
                            />
                            <View>
                                <Text className="text-[22px] font-black text-[#0DA96E] tracking-tight">Swasthify</Text>
                                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Healthcare</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center ml-2"
                            onPress={() => navigation.closeDrawer()}
                        >
                            <Feather name="chevron-left" size={18} color={isDark ? "#94A3B8" : "#475569"} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Navigation Options */}
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ paddingTop: 16 }}
                showsVerticalScrollIndicator={true}
            >
                <View className="px-2">
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            {/* Premium Footer Settings Section */}
            <View className="px-5 pt-4 pb-8 bg-white dark:bg-[#111827] border-t border-gray-200/50 dark:border-white/5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                
                {/* Theme Toggle Component */}
                <View className="flex-row items-center justify-between py-3 mb-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] px-4 border border-slate-100 dark:border-white/5">
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 items-center justify-center shadow-sm">
                            <Feather name={isDark ? "moon" : "sun"} size={16} color={isDark ? "#94A3B8" : "#F59E0B"} />
                        </View>
                        <Text className="text-[14px] font-bold text-slate-700 dark:text-slate-300 ml-3">
                            {isDark ? 'Dark Theme' : 'Light Theme'}
                        </Text>
                    </View>

                    <Pressable onPress={toggleTheme} hitSlop={10}>
                        <Animated.View style={[styles.customTrack, trackAnimatedStyle]}>
                            <Animated.View style={[styles.customThumb, thumbAnimatedStyle]}>
                                <Animated.View style={[styles.iconContainer, sunAnimatedStyle]}>
                                    <Feather name="sun" size={12} color="#F59E0B" />
                                </Animated.View>
                                <Animated.View style={[styles.iconContainer, moonAnimatedStyle, StyleSheet.absoluteFill]}>
                                    <Feather name="moon" size={12} color="#0DA96E" />
                                </Animated.View>
                            </Animated.View>
                        </Animated.View>
                    </Pressable>
                </View>

                {/* Log In/Out Primary Button */}
                <TouchableOpacity
                    className={`flex-row items-center justify-center py-3.5 rounded-xl border ${user ? 'border-red-100 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10' : 'bg-[#0DA96E] border-[#0DA96E]'}`}
                    onPress={handleAuthAction}
                    activeOpacity={0.8}
                >
                    <Feather name={user ? "log-out" : "log-in"} size={18} color={user ? '#EF4444' : '#FFFFFF'} className="mr-2" />
                    <Text className={`font-bold text-[15px] ml-2 ${user ? 'text-red-500' : 'text-white'}`}>
                        {user ? 'Log Out' : 'Sign In or Register'}
                    </Text>
                </TouchableOpacity>

                {/* Footer Subtext */}
                <View className="items-center mt-5">
                    <Text className="text-[10px] font-semibold text-slate-400">Swasthify v1.0.0</Text>
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
