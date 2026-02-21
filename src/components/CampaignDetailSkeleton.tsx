import React, { useEffect, useRef } from 'react';
import { View, Animated, ScrollView, SafeAreaView, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const CampaignDetailSkeleton = () => {
    const pulseAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 0.7,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [pulseAnim]);

    const SkeletonBox = ({ width: w, height: h, className = "", style = {} }: any) => (
        <Animated.View
            style={[{ opacity: pulseAnim, width: w, height: h }, style]}
            className={`bg-zinc-200 dark:bg-zinc-800 rounded-xl ${className}`}
        />
    );

    return (
        <SafeAreaView className="flex-1 bg-zinc-50 dark:bg-zinc-950">
            {/* Header Skeleton */}
            <View className="px-6 py-4 flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
                <SkeletonBox width={32} height={32} className="rounded-full" />
                <SkeletonBox width={120} height={16} className="rounded-md" />
                <SkeletonBox width={32} height={32} className="rounded-full" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Hero Section Skeleton */}
                <View className="p-6">
                    <SkeletonBox width={150} height={32} className="rounded-full mb-6" />
                    <SkeletonBox width="100%" height={40} className="rounded-xl mb-2" />
                    <SkeletonBox width="60%" height={24} className="rounded-lg mb-6" />

                    <View className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <SkeletonBox width="100%" height={12} className="rounded-md mb-2" />
                        <SkeletonBox width="100%" height={12} className="rounded-md mb-2" />
                        <SkeletonBox width="40%" height={12} className="rounded-md" />
                    </View>
                </View>

                {/* Doctor Section Skeleton */}
                <View className="px-6 mb-8">
                    <SkeletonBox width={100} height={14} className="rounded-md mb-6" />
                    <View className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <View className="flex-row items-center mb-8">
                            <SkeletonBox width={96} height={96} className="rounded-[2rem]" />
                            <View className="flex-1 ml-6">
                                <SkeletonBox width="80%" height={24} className="rounded-lg mb-2" />
                                <SkeletonBox width="60%" height={16} className="rounded-md mb-3" />
                                <SkeletonBox width={120} height={24} className="rounded-xl" />
                            </View>
                        </View>
                        <View className="space-y-6">
                            <View>
                                <SkeletonBox width={80} height={12} className="rounded-md mb-3" />
                                <SkeletonBox width="100%" height={12} className="rounded-md mb-2" />
                                <SkeletonBox width="100%" height={12} className="rounded-md" />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Schedule Skeleton */}
                <View className="px-6 mb-8">
                    <SkeletonBox width={100} height={14} className="rounded-md mb-6" />
                    <View className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <View className="flex-row items-center justify-between mb-8">
                            <View>
                                <SkeletonBox width={60} height={12} className="rounded-md mb-1" />
                                <SkeletonBox width={150} height={32} className="rounded-xl" />
                            </View>
                            <SkeletonBox width={80} height={24} className="rounded-xl" />
                        </View>
                        <View className="flex-row flex-wrap gap-2">
                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                <SkeletonBox key={i} width={50} height={40} className="rounded-2xl" />
                            ))}
                        </View>
                    </View>
                </View>

                {/* Venue Skeleton */}
                <View className="px-6 mb-32">
                    <SkeletonBox width={120} height={14} className="rounded-md mb-6" />
                    <View className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <View className="px-8 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
                            <SkeletonBox width={150} height={24} className="rounded-md" />
                        </View>
                        <View className="p-8">
                            <SkeletonBox width="70%" height={24} className="rounded-lg mb-2" />
                            <SkeletonBox width="90%" height={16} className="rounded-md mb-1" />
                            <SkeletonBox width="80%" height={12} className="rounded-md mb-8" />
                            <SkeletonBox width={150} height={56} className="rounded-2xl mb-8" />
                            <SkeletonBox width="100%" height={224} className="rounded-[2.5rem]" />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Bar Skeleton */}
            <View className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 flex-row items-center justify-between">
                <View>
                    <SkeletonBox width={70} height={12} className="rounded-md mb-1" />
                    <SkeletonBox width={100} height={32} className="rounded-xl" />
                </View>
                <SkeletonBox width={150} height={64} className="rounded-[2rem]" />
            </View>
        </SafeAreaView>
    );
};

export default CampaignDetailSkeleton;
