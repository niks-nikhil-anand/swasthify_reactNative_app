import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import Feather from 'react-native-vector-icons/Feather';
import { useColorScheme } from 'nativewind';
import Footer from '../components/Footer';

const { width } = Dimensions.get('window');

type NavigationProp = DrawerNavigationProp<RootDrawerParamList>;

const services = [
    {
        id: '1',
        title: 'Quick Connect',
        price: '199',
        duration: 'per session',
        description: 'Instant consultation for primary care and common health concerns.',
        features: [
            '15 min video call',
            'Digital prescription',
            '24/7 availability',
            'General Physician'
        ],
        icon: 'zap',
        color: '#3B82F6', // Blue
        popular: false
    },
    {
        id: '2',
        title: 'Specialist Care',
        price: '499',
        duration: 'per session',
        description: 'Deep dive consultations with board-certified specialists.',
        features: [
            '30 min video call',
            'Detailed health plan',
            'Specialist referral',
            'Priority queueing'
        ],
        icon: 'shield',
        color: '#10B981', // Emerald
        popular: true
    },
    {
        id: '3',
        title: 'Diagnostics',
        price: '99',
        duration: 'starting at',
        description: 'Quality lab tests with free home sample collection.',
        features: [
            'Home collection',
            'Certified labs',
            'Digital reports',
            'Dr. Consultation'
        ],
        icon: 'activity',
        color: '#F59E0B', // Amber
        popular: false
    }
];

const PricingCard = ({ item, isDark, navigation }: { item: typeof services[0], isDark: boolean, navigation: any }) => {
    return (
        <View 
            className={`w-full rounded-[3rem] p-8 mb-6 border ${
                item.popular 
                    ? 'bg-zinc-900 dark:bg-emerald-600 border-zinc-900 dark:border-emerald-600 shadow-2xl shadow-emerald-500/20' 
                    : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'
            }`}
        >
            {item.popular && (
                <View className="absolute top-8 right-8 bg-emerald-500 dark:bg-white/20 px-3 py-1 rounded-full">
                    <Text className="text-[10px] font-black text-white uppercase tracking-widest">Most Popular</Text>
                </View>
            )}

            <View className={`w-14 h-14 rounded-3xl items-center justify-center mb-6 ${
                item.popular ? 'bg-white/10' : 'bg-zinc-50 dark:bg-zinc-800'
            }`}>
                <Feather name={item.icon} size={24} color={item.popular ? '#FFFFFF' : item.color} />
            </View>

            <Text className={`text-2xl font-black mb-2 ${item.popular ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
                {item.title}
            </Text>
            <Text className={`text-sm leading-relaxed mb-8 ${item.popular ? 'text-emerald-50/70' : 'text-zinc-500 dark:text-zinc-400'}`}>
                {item.description}
            </Text>

            <View className="flex-row items-baseline mb-8">
                <Text className={`text-4xl font-black ${item.popular ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
                    ₹{item.price}
                </Text>
                <Text className={`ml-2 text-sm font-bold ${item.popular ? 'text-emerald-50/50' : 'text-zinc-400'}`}>
                    / {item.duration}
                </Text>
            </View>

            <View className="mb-2 gap-y-4">
                {item.features.map((feature, i) => (
                    <View key={i} className="flex-row items-center">
                        <View className={`w-5 h-5 rounded-full items-center justify-center mr-3 ${
                            item.popular ? 'bg-white/20' : 'bg-emerald-50 dark:bg-emerald-900/20'
                        }`}>
                            <Feather name="check" size={12} color={item.popular ? '#FFFFFF' : '#10B981'} />
                        </View>
                        <Text className={`text-sm font-semibold ${item.popular ? 'text-emerald-50' : 'text-zinc-600 dark:text-zinc-300'}`}>
                            {feature}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const PricingScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-zinc-50 dark:bg-zinc-950">
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            
            <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
                {/* Header */}
                <View className="px-6 py-6 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.3em] mb-1">
                                Pricing Plans
                            </Text>
                            <Text className="text-3xl font-black text-zinc-900 dark:text-white">
                                Transparent Care.
                            </Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => navigation.openDrawer()}
                            className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-800"
                        >
                            <Feather name="menu" size={20} color={isDark ? '#FFFFFF' : '#18181B'} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Hero / Value Prop */}
                <View className="px-6 pt-10 pb-12">
                    <Text className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Healthcare should be simple, accessible, and affordable. We've eliminated hidden costs so you can focus on what matters—your well-being.
                    </Text>
                </View>

                {/* Pricing List */}
                <View className="px-6">
                    {services.map(service => (
                        <PricingCard 
                            key={service.id} 
                            item={service} 
                            isDark={isDark} 
                            navigation={navigation}
                        />
                    ))}
                </View>

                {/* Trust Section */}
                <View className="px-8 py-16 items-center">
                    <View className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full items-center justify-center mb-6">
                        <Feather name="shield" size={28} color="#10B981" />
                    </View>
                    <Text className="text-xl font-black text-zinc-900 dark:text-white text-center mb-4">
                        Secure & Transparent
                    </Text>
                    <Text className="text-sm text-zinc-500 dark:text-zinc-400 text-center leading-relaxed px-4">
                        All payments are processed securely through Razorpay. You'll receive a detailed digital invoice for every transaction.
                    </Text>
                    
                    <View className="flex-row mt-10 gap-x-8">
                        <View className="items-center">
                            <Text className="text-2xl font-black text-zinc-900 dark:text-white">50k+</Text>
                            <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Users</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-black text-zinc-900 dark:text-white">4.9/5</Text>
                            <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Rating</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-black text-zinc-900 dark:text-white">100%</Text>
                            <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Secure</Text>
                        </View>
                    </View>
                </View>

                {/* Support CTA */}
                <View className="mx-6 mb-12 p-10 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm items-center">
                    <Text className="text-xl font-black text-zinc-900 dark:text-white text-center mb-2">
                        Still have questions?
                    </Text>
                    <Text className="text-sm text-zinc-500 dark:text-zinc-400 text-center mb-8">
                        Our support team is here to help you 24/7 with any billing or service queries.
                    </Text>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Contact')}
                        className="bg-zinc-50 dark:bg-zinc-800 px-8 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-700"
                    >
                        <Text className="text-zinc-900 dark:text-white font-black uppercase tracking-widest text-xs">
                            Contact Support
                        </Text>
                    </TouchableOpacity>
                </View>

                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
};

export default PricingScreen;
