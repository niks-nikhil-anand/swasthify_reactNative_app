import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

const Hero = () => {
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

    return (
        <View className="bg-[#F2FAF7] dark:bg-slate-900/50 pt-12 pb-16 px-4">
            <View className="max-w-6xl mx-auto">
                <View className="mb-10">
                    {/* Badge */}
                    <View className="bg-[#D1F2E2]/50 dark:bg-[#0DA96E]/20 self-start px-3 py-1.5 rounded-md mb-6 border border-[#D1F2E2] dark:border-[#0DA96E]/30">
                        <Text className="text-[#0DA96E] dark:text-[#48C496] text-xs font-semibold uppercase tracking-wider">
                            Transforming Healthcare
                        </Text>
                    </View>

                    {/* Title */}
                    <Text className="text-5xl font-extrabold text-[#111827] dark:text-white leading-[1.1] mb-6">
                        Your Health.{'\n'}
                        <Text className="text-[#0DA96E] dark:text-[#48C496]">One Place.</Text>
                    </Text>

                    {/* Description */}
                    <Text className="text-[#4B5563] dark:text-gray-400 text-lg leading-7 mb-10 max-w-[90%]">
                        Link your ABHA, book trusted doctors, and manage lab reports securely. Expert healthcare is just a click away.
                    </Text>

                    {/* Search Bar */}
                    <View className="bg-white dark:bg-slate-800 rounded-full flex-row items-center p-1.5 shadow-xl shadow-black/5 mb-2 border border-gray-100 dark:border-slate-700">
                        <View className="pl-4 pr-3">
                            <Text className="text-gray-400 text-lg">🔍</Text>
                        </View>
                        <TextInput
                            placeholder="Search doctors, specialities, symptoms"
                            placeholderTextColor="#9CA3AF"
                            className="flex-1 text-base text-gray-900 dark:text-white h-10"
                        />
                        <TouchableOpacity className="bg-[#48C496] px-6 h-10 rounded-full items-center justify-center">
                            <Text className="text-white font-bold">Search</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Hero Image Container */}
                <View className="relative">
                    <View className="rounded-[40px] overflow-hidden shadow-2xl">
                        <Image
                            source={require('../../public/images/hero_img.png')}
                            style={{ width: '100%', height: width * 0.9, backgroundColor: '#E5E7EB' }}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Floating Card 1: Specialist Doctors */}
                    <View className="absolute top-8 right-6 bg-white/90 dark:bg-slate-800/90 p-4 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700">
                        <View className="flex-row items-center mb-1">
                            <View className="bg-[#D1F2E2] dark:bg-[#064E3B] w-6 h-6 rounded-full items-center justify-center mr-2">
                                <Text className="text-[#0DA96E] dark:text-[#48C496] text-[10px]">📍</Text>
                            </View>
                            <Text className="text-2xl font-bold text-[#111827] dark:text-white">500+</Text>
                        </View>
                        <Text className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                            Specialist{'\n'}Doctors
                        </Text>
                    </View>

                    {/* Floating Card 2: 24/7 Support */}
                    <View className="absolute bottom-10 left-6 bg-white/90 dark:bg-slate-800/90 px-5 py-3 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700">
                        <View className="flex-row items-center mb-0.5">
                            <View className="w-2.5 h-2.5 rounded-full bg-[#0DA96E] mr-2" />
                            <Text className="text-sm font-bold text-[#111827] dark:text-white">24/7 Support</Text>
                        </View>
                        <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium">Always here for you.</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Hero;
