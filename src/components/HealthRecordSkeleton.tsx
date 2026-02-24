import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const HealthRecordSkeleton = () => {
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
        <View className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm mb-4 border border-zinc-100 dark:border-zinc-800 flex-row items-center">
            {/* Icon Placeholder */}
            <Animated.View
                style={{ opacity: pulseAnim }}
                className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mr-4"
            />

            <View className="flex-1">
                <View className="flex-row justify-between items-start mb-2">
                    {/* Title Placeholder */}
                    <Animated.View
                        style={{ opacity: pulseAnim }}
                        className="w-1/2 h-5 rounded-lg bg-zinc-100 dark:bg-zinc-800"
                    />
                    {/* Badge Placeholder */}
                    <Animated.View
                        style={{ opacity: pulseAnim }}
                        className="w-16 h-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50"
                    />
                </View>

                {/* Description Placeholder */}
                <Animated.View
                    style={{ opacity: pulseAnim }}
                    className="w-3/4 h-3 rounded-md bg-zinc-50 dark:bg-zinc-800/50 mb-3"
                />

                <View className="flex-row items-center">
                    {/* Date Placeholder */}
                    <Animated.View
                        style={{ opacity: pulseAnim }}
                        className="w-16 h-3 rounded-md bg-zinc-50 dark:bg-zinc-800/50 mr-4"
                    />
                    {/* Size Placeholder */}
                    <Animated.View
                        style={{ opacity: pulseAnim }}
                        className="w-12 h-3 rounded-md bg-zinc-50 dark:bg-zinc-800/50"
                    />
                </View>
            </View>
        </View>
    );
};

export const HealthRecordsListSkeleton = () => {
    return (
        <View>
            {[1, 2, 3, 4, 5].map((i) => (
                <HealthRecordSkeleton key={i} />
            ))}
        </View>
    );
};

export default HealthRecordSkeleton;
