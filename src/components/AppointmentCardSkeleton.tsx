import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const AppointmentCardSkeleton = () => {
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
        <View className="bg-white dark:bg-zinc-900 rounded-3xl mb-4 overflow-hidden border border-zinc-100 dark:border-zinc-800 flex-row">
            {/* Status Accent Line Placeholder */}
            <Animated.View style={{ width: 4, backgroundColor: '#E4E4E7', opacity: pulseAnim }} className="dark:bg-zinc-800" />

            <View className="flex-1 p-5">
                {/* Header Skeleton */}
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center flex-1">
                        <Animated.View
                            style={{ opacity: pulseAnim }}
                            className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800"
                        />
                        <View className="ml-3 flex-1 space-y-2">
                            <Animated.View
                                style={{ opacity: pulseAnim }}
                                className="w-2/3 h-4 rounded bg-zinc-100 dark:bg-zinc-800"
                            />
                            <Animated.View
                                style={{ opacity: pulseAnim }}
                                className="w-1/3 h-3 rounded bg-zinc-50 dark:bg-zinc-800/50"
                            />
                        </View>
                    </View>
                    <Animated.View
                        style={{ opacity: pulseAnim }}
                        className="w-16 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800"
                    />
                </View>

                {/* Info Grid Skeleton */}
                <View className="flex-row justify-between mb-5 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    {[1, 2, 3].map((i) => (
                        <View key={i} className="space-y-1">
                            <Animated.View
                                style={{ opacity: pulseAnim }}
                                className="w-8 h-2 rounded bg-zinc-200 dark:bg-zinc-800"
                            />
                            <Animated.View
                                style={{ opacity: pulseAnim }}
                                className="w-12 h-3 rounded bg-zinc-100 dark:bg-zinc-800"
                            />
                        </View>
                    ))}
                </View>

                {/* Actions Skeleton */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center space-x-2">
                        <Animated.View
                            style={{ opacity: pulseAnim }}
                            className="w-4 h-4 rounded bg-zinc-100 dark:bg-zinc-800"
                        />
                        <Animated.View
                            style={{ opacity: pulseAnim }}
                            className="w-20 h-3 rounded bg-zinc-100 dark:bg-zinc-800"
                        />
                    </View>
                    <View className="flex-row gap-x-2">
                        <Animated.View
                            style={{ opacity: pulseAnim }}
                            className="w-16 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800"
                        />
                        <Animated.View
                            style={{ opacity: pulseAnim }}
                            className="w-16 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default AppointmentCardSkeleton;
