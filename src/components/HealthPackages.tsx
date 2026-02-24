import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';

const PackageCard = ({ title, price, features, image, isRecommended }: { title: string, price: string, features: string, image: any, isRecommended?: boolean }) => {
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('PackageDetail', { id: title.toLowerCase().replace(/ /g, '-'), title, price, features, image, isRecommended })}
            className="bg-white dark:bg-slate-800 w-[240px] h-auto rounded-[32px] border border-gray-100 dark:border-slate-700 mr-4 shadow-sm overflow-hidden"
            style={{ elevation: 2 }}
        >
            <Image
                source={image}
                style={{ height: 160, width: '100%' }}
                resizeMode="cover"
            />
            <View className="p-5">
                <View>
                    {isRecommended && (
                        <View className="bg-[#0DA96E]/10 self-start px-2 py-1 rounded-md mb-2">
                            <Text className="text-[#0DA96E] text-[10px] font-bold tracking-wider uppercase">Recommended</Text>
                        </View>
                    )}
                    <Text className="text-lg font-bold text-[#111827] dark:text-white mb-1" numberOfLines={1}>{title}</Text>
                    <Text className="text-[#6B7280] dark:text-gray-400 text-[10px] leading-4 mb-4" numberOfLines={2}>{features}</Text>
                </View>

                <View>
                    <View className="flex-row items-baseline mb-4">
                        <Text className="text-2xl font-bold text-[#111827] dark:text-white">{price}</Text>
                        <Text className="text-[#9CA3AF] text-[10px] ml-1 line-through">₹2999</Text>
                    </View>

                    <View
                        className="bg-[#0DA96E] rounded-xl py-3 items-center shadow-sm"
                        style={{ elevation: 1 }}
                    >
                        <Text className="text-white font-bold text-sm">View Details</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const HealthPackages = () => {
    return (
        <View className="py-8 px-0 bg-white dark:bg-zinc-950">
            <View className="px-5 mb-6 flex-row justify-between items-end">
                <View className="flex-1">
                    <View className="bg-[#0DA96E]/10 dark:bg-[#0DA96E]/20 self-start px-3 py-1 rounded-full mb-2">
                        <Text className="text-[#0DA96E] dark:text-[#10B911] text-[10px] font-bold tracking-widest uppercase">
                            Health Packages
                        </Text>
                    </View>
                    <Text className="section-heading dark:text-white">
                        Popular <Text className="section-heading-highlight">Checkups</Text>
                    </Text>
                    <Text className="section-description dark:text-gray-400 mt-1">
                        Comprehensive health screening for you and your family
                    </Text>
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
                    image={require('../../public/images/packages/full-body.png')}
                    isRecommended={true}
                />
                <PackageCard
                    title="Diabetes Care"
                    price="₹1499"
                    features="45+ Tests • Hba1c, Sugar, Cholesterol & Kidney"
                    image={require('../../public/images/packages/diabetes.png')}
                />
                <PackageCard
                    title="Women's Health"
                    price="₹1999"
                    features="60+ Tests • Thyroid, Iron, Vitamins Coverage & CBP"
                    image={require('../../public/images/packages/women.png')}
                />
            </ScrollView>
        </View>
    );
};

export default HealthPackages;
