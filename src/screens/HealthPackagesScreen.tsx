import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useColorScheme } from 'nativewind';

const { width } = Dimensions.get('window');

const BenefitCard = ({ icon, title, description, isDark }: { icon: string; title: string; description: string; isDark: boolean }) => (
    <View className="flex-row items-start mb-6">
        <View className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl items-center justify-center mr-4 border border-emerald-100 dark:border-emerald-500/20">
            <Feather name={icon} size={22} color="#10B981" />
        </View>
        <View className="flex-1">
            <Text className="text-base font-black text-zinc-900 dark:text-white mb-1">{title}</Text>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</Text>
        </View>
    </View>
);

const PackagePlaceholder = ({ title, tests, price, isDark }: { title: string; tests: string; price: string; isDark: boolean }) => (
    <View className="w-[280px] mr-4 bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <View className="flex-row justify-between items-start mb-4">
            <View className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">
                <Text className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Featured</Text>
            </View>
            <Feather name="bookmark" size={18} color={isDark ? '#3F3F46' : '#E4E4E7'} />
        </View>
        <Text className="text-xl font-black text-zinc-900 dark:text-white mb-2">{title}</Text>
        <View className="flex-row items-center mb-4">
            <Feather name="check-circle" size={14} color="#10B981" />
            <Text className="ml-2 text-sm font-bold text-zinc-500 dark:text-zinc-400">{tests}</Text>
        </View>
        <View className="flex-row items-baseline mb-6">
            <Text className="text-2xl font-black text-zinc-900 dark:text-white">₹{price}</Text>
            <Text className="ml-2 text-xs font-bold text-zinc-400 line-through">₹{parseInt(price) + 1000}</Text>
        </View>
        <View className="h-12 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700 items-center justify-center">
            <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Coming Soon</Text>
        </View>
    </View>
);

const HealthPackagesScreen = () => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView edges={['top', 'left', 'right', 'bottom']} className="flex-1 bg-zinc-50 dark:bg-zinc-950">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* 1. Hero Section */}
                <View className="px-6 pt-10 pb-12 items-center bg-white dark:bg-zinc-900 rounded-b-[3.5rem] shadow-sm">
                    <View className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2.5rem] items-center justify-center mb-8 border-2 border-white dark:border-zinc-800 shadow-xl shadow-emerald-500/10">
                        <Feather name="package" size={40} color="#10B981" />
                    </View>
                    <View className="px-3 py-1 bg-emerald-500 rounded-full mb-4">
                        <Text className="text-[10px] font-black text-white uppercase tracking-[0.2em]">New Feature</Text>
                    </View>
                    <Text className="text-4xl font-black text-zinc-900 dark:text-white text-center leading-[1.1] mb-4">
                        Curated Health{"\n"}Packages
                    </Text>
                    <Text className="text-base text-zinc-500 dark:text-zinc-400 text-center px-6 leading-relaxed">
                        Comprehensive health checkups designed for you and your family's specific needs.
                    </Text>
                </View>

                {/* 2. Coming Soon Teaser (Horizontal Scroll) */}
                <View className="mt-10">
                    <View className="px-6 flex-row items-center justify-between mb-6">
                        <Text className="text-xl font-black text-zinc-900 dark:text-white">Our Top Picks</Text>
                        <TouchableOpacity className="flex-row items-center">
                            <Text className="text-xs font-black text-emerald-600 uppercase tracking-widest mr-1">Preview</Text>
                            <Feather name="chevron-right" size={14} color="#10B981" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 10 }}
                    >
                        <PackagePlaceholder 
                            title="Full Body Platinum" 
                            tests="92+ Essential Tests" 
                            price="2499" 
                            isDark={isDark} 
                        />
                        <PackagePlaceholder 
                            title="Heart Care Basic" 
                            tests="45+ Essential Tests" 
                            price="1299" 
                            isDark={isDark} 
                        />
                        <PackagePlaceholder 
                            title="Women Wellness" 
                            tests="68+ Essential Tests" 
                            price="1899" 
                            isDark={isDark} 
                        />
                    </ScrollView>
                </View>

                {/* 3. Key Benefits Section */}
                <View className="px-8 mt-12 mb-10">
                    <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8 text-center">
                        Why Choose Swasthify?
                    </Text>
                    <BenefitCard 
                        icon="shield" 
                        title="Preventive Healthcare" 
                        description="Early detection of health issues with our comprehensive screening packages." 
                        isDark={isDark}
                    />
                    <BenefitCard 
                        icon="home" 
                        title="Free Home Collection" 
                        description="Professional phlebotomists will collect samples from the comfort of your home." 
                        isDark={isDark}
                    />
                    <BenefitCard 
                        icon="file-text" 
                        title="Smart Digital Reports" 
                        description="Interactive reports with trend analysis and doctor's recommendations." 
                        isDark={isDark}
                    />
                </View>

                {/* 4. Stay Notified Section */}
                <View className="mx-6 mb-12 p-8 bg-zinc-900 dark:bg-emerald-600 rounded-[3rem] shadow-2xl shadow-zinc-900/20">
                    <Text className="text-2xl font-black text-white text-center mb-2">Be the first to know</Text>
                    <Text className="text-zinc-400 dark:text-emerald-100/70 text-center text-sm mb-8 px-4">
                        We're launching soon. Join our waitlist to get exclusive early-bird discounts.
                    </Text>
                    <TouchableOpacity 
                        className="bg-emerald-500 dark:bg-white h-16 rounded-[1.5rem] items-center justify-center shadow-lg"
                        onPress={() => {}}
                    >
                        <Text className="text-white dark:text-emerald-600 font-black uppercase tracking-widest">
                            Join Waitlist
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HealthPackagesScreen;
