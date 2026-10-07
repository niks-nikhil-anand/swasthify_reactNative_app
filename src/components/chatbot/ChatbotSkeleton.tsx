import React from 'react';
import { View } from 'react-native';

export function ChatbotSkeleton() {
    return (
        <View className="mb-4 flex-row justify-start">
            <View className="w-[72%] rounded-2xl rounded-bl-md px-4 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <View className="h-3 rounded-full bg-slate-200 dark:bg-slate-800 w-11/12 mb-3" />
                <View className="h-3 rounded-full bg-slate-200 dark:bg-slate-800 w-8/12 mb-3" />
                <View className="h-3 rounded-full bg-slate-200 dark:bg-slate-800 w-5/12" />
            </View>
        </View>
    );
}
