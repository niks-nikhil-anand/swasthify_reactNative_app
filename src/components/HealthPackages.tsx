import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const PackageCard = ({ title, price, features }: { title: string, price: string, features: string }) => (
    <View className="bg-white w-64 p-4 rounded-xl border border-gray-200 mr-4 shadow-sm">
        <View className="bg-green-50 self-start px-2 py-1 rounded-md mb-2">
            <Text className="text-green-700 text-xs font-bold">Recommended</Text>
        </View>
        <Text className="text-lg font-bold text-gray-900 mb-1">{title}</Text>
        <Text className="text-gray-500 text-xs mb-3">{features}</Text>

        <View className="flex-row items-end mb-4">
            <Text className="text-xl font-bold text-gray-900">{price}</Text>
            <Text className="text-gray-400 text-xs ml-1 mb-1 line-through">₹2999</Text>
        </View>

        <TouchableOpacity className="border border-blue-600 rounded-lg py-2 items-center">
            <Text className="text-blue-600 font-bold text-sm">View Details</Text>
        </TouchableOpacity>
    </View>
);

const HealthPackages = () => {
    return (
        <View className="py-6 px-0 bg-white">
            <View className="px-4 mb-4 flex-row justify-between items-end">
                <View>
                    <Text className="text-xl font-bold text-gray-900">Popular Health Packages</Text>
                    <Text className="text-gray-500 text-xs">Comprehensive checkups for better health.</Text>
                </View>
                <TouchableOpacity>
                    <Text className="text-blue-600 font-bold text-sm">See All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                <PackageCard
                    title="Full Body Checkup"
                    price="₹999"
                    features="83+ Tests • Liver, Kidney, Lipid Profiles & more"
                />
                <PackageCard
                    title="Diabetes Care"
                    price="₹1499"
                    features="45+ Tests • Hba1c, Glucose, Lipid Profiles"
                />
                <PackageCard
                    title="Women's Health"
                    price="₹1999"
                    features="60+ Tests • Thyroid, Iron, Vitamins Coverage"
                />
            </ScrollView>
        </View>
    );
};

export default HealthPackages;
