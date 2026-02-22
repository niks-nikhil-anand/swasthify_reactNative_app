import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const PackageCard = ({ title, price, features, isRecommended }: { title: string, price: string, features: string, isRecommended?: boolean }) => (
    <View
        className="bg-white w-[240px] h-[200px] p-5 rounded-[32px] border border-gray-100 mr-4 shadow-sm justify-between"
        style={{ elevation: 2 }}
    >
        <View>
            {isRecommended && (
                <View className="bg-[#0DA96E]/10 self-start px-2 py-1 rounded-md mb-2">
                    <Text className="text-[#0DA96E] text-[10px] font-bold tracking-wider uppercase">Recommended</Text>
                </View>
            )}
            <Text className="text-lg font-bold text-[#111827] mb-1">{title}</Text>
            <Text className="text-[#6B7280] text-[10px] leading-4 mb-2">{features}</Text>
        </View>

        <View>
            <View className="flex-row items-baseline mb-3">
                <Text className="text-2xl font-bold text-[#111827]">{price}</Text>
                <Text className="text-[#9CA3AF] text-[10px] ml-1 line-through">₹2999</Text>
            </View>

            <TouchableOpacity
                className="bg-[#0DA96E] rounded-xl py-2.5 items-center shadow-sm"
                style={{ elevation: 1 }}
            >
                <Text className="text-white font-bold text-xs">View Details</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const HealthPackages = () => {
    return (
        <View className="py-8 px-0 bg-white">
            <View className="px-5 mb-6 flex-row justify-between items-end">
                <View className="flex-1">
                    <View className="bg-[#0DA96E]/10 self-start px-3 py-1 rounded-full mb-2">
                        <Text className="text-[#0DA96E] text-[10px] font-bold tracking-widest uppercase">
                            Health Packages
                        </Text>
                    </View>
                    <Text className="section-heading">
                        Popular <Text className="section-heading-highlight">Checkups</Text>
                    </Text>
                    <Text className="section-description mt-1">
                        Comprehensive health screening for you and your family
                    </Text>
                    <TouchableOpacity className="self-end border mt-3 border-gray-100 dark:border-slate-700 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800">
                                        <Text className="text-[#0DA96E] dark:text-[#48C496] font-bold text-[10px]">See All {'>'}</Text>
                                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 20, paddingRight: 4, paddingBottom: 10 }}
                decelerationRate="fast"
                snapToInterval={256} // card width (240) + margin (16)
                scrollEventThrottle={16}
            >
                <PackageCard
                    title="Full Body Checkup"
                    price="₹999"
                    features="83+ Tests • Liver, Kidney, Lipid Profiles, Sugar & more"
                    isRecommended={true}
                />
                <PackageCard
                    title="Diabetes Care"
                    price="₹1499"
                    features="45+ Tests • Hba1c, Sugar, Cholesterol & Kidney"
                />
                <PackageCard
                    title="Women's Health"
                    price="₹1999"
                    features="60+ Tests • Thyroid, Iron, Vitamins Coverage & CBP"
                />
            </ScrollView>
        </View>
    );
};

export default HealthPackages;
