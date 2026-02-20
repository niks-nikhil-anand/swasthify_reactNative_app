import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

const CampaignSkeleton = () => {
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

    return (
        <View
            style={{ width: CARD_WIDTH }}
            className="bg-zinc-50 dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-zinc-100 dark:border-zinc-800 mr-4 flex-col p-6"
        >
            {/* Header Skeleton */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center space-x-3">
                    <Animated.View
                        style={{ opacity: pulseAnim }}
                        className="w-20 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800"
                    />
                    <Animated.View
                        style={{ opacity: pulseAnim }}
                        className="w-24 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800"
                    />
                </View>
                <Animated.View
                    style={{ opacity: pulseAnim }}
                    className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800"
                />
            </View>

            {/* Title Skeleton */}
            <View className="space-y-2 mb-4">
                <Animated.View
                    style={{ opacity: pulseAnim }}
                    className="w-full h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800"
                />
                <Animated.View
                    style={{ opacity: pulseAnim }}
                    className="w-2/3 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800"
                />
            </View>

            {/* Location Skeleton */}
            <View className="flex-row items-center mb-6">
                <Animated.View
                    style={{ opacity: pulseAnim }}
                    className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-800 mr-2"
                />
                <Animated.View
                    style={{ opacity: pulseAnim }}
                    className="w-1/2 h-4 rounded bg-zinc-200 dark:bg-zinc-800"
                />
            </View>

            {/* Description Skeleton */}
            <View className="border-l-2 border-zinc-100 dark:border-zinc-800 pl-4 mb-6">
                <Animated.View
                    style={{ opacity: pulseAnim }}
                    className="w-full h-3 rounded bg-zinc-200 dark:bg-zinc-800 mb-2"
                />
                <Animated.View
                    style={{ opacity: pulseAnim }}
                    className="w-full h-3 rounded bg-zinc-200 dark:bg-zinc-800 mb-2"
                />
                <Animated.View
                    style={{ opacity: pulseAnim }}
                    className="w-1/2 h-3 rounded bg-zinc-100 dark:bg-zinc-800"
                />
            </View>

            {/* Footer Skeleton */}
            <View className="bg-white dark:bg-zinc-900 p-4 rounded-3xl flex-row items-center justify-between border border-zinc-100 dark:border-zinc-800">
                <View className="flex-row items-center">
                    <Animated.View
                        style={{ opacity: pulseAnim }}
                        className="w-11 h-11 rounded-full bg-zinc-200 dark:bg-zinc-800 mr-3"
                    />
                    <View className="space-y-1">
                        <Animated.View
                            style={{ opacity: pulseAnim }}
                            className="w-16 h-2 rounded bg-zinc-200 dark:bg-zinc-800"
                        />
                        <Animated.View
                            style={{ opacity: pulseAnim }}
                            className="w-20 h-6 rounded bg-zinc-200 dark:bg-zinc-800"
                        />
                    </View>
                </View>

                <Animated.View
                    style={{ opacity: pulseAnim }}
                    className="w-24 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800"
                />
            </View>
        </View>
    );
};

export const CampaignSectionSkeleton = () => {
    return (
        <View className="py-16">
            <View className="px-4 mb-12">
                <View className="space-y-4">
                    <View className="w-3/4 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
                    <View className="w-1/2 h-6 rounded-xl bg-zinc-50 dark:bg-zinc-900" />
                </View>
            </View>
            <View className="flex-row px-4">
                <CampaignSkeleton />
                <CampaignSkeleton />
            </View>
        </View>
    );
}

export default CampaignSkeleton;
