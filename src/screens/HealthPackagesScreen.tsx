import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import Footer from '../components/Footer';

type NavigationProp = DrawerNavigationProp<RootDrawerParamList>;

const packages = [
    {
        title: 'Full Body Checkup',
        price: '₹999',
        oldPrice: '₹2999',
        tests: '83+ Tests',
        features: 'Liver, kidney, lipid profiles, sugar, vitamins and complete blood count.',
        image: require('../../public/images/packages/full-body.png'),
        isRecommended: true,
    },
    {
        title: 'Diabetes Care',
        price: '₹1499',
        oldPrice: '₹2499',
        tests: '45+ Tests',
        features: 'HbA1c, fasting sugar, cholesterol, kidney markers and diabetes monitoring.',
        image: require('../../public/images/packages/diabetes.png'),
    },
    {
        title: "Women's Health",
        price: '₹1999',
        oldPrice: '₹3499',
        tests: '60+ Tests',
        features: 'Thyroid, iron, vitamins, hormone markers and wellness screening.',
        image: require('../../public/images/packages/women.png'),
    },
];

const benefits = [
    {
        icon: 'home',
        title: 'Home Sample Collection',
        description: 'Trained sample collectors visit your home at your preferred slot.',
    },
    {
        icon: 'shield',
        title: 'Certified Lab Partners',
        description: 'Every report comes from trusted diagnostic partners and quality processes.',
    },
    {
        icon: 'file-text',
        title: 'Digital Reports',
        description: 'Reports are saved in your health records so you can access them anytime.',
    },
    {
        icon: 'user-check',
        title: 'Doctor Guidance',
        description: 'Understand what your results mean with follow-up consultation support.',
    },
];

const steps = [
    { icon: 'search', title: 'Choose Package', description: 'Pick a checkup based on your age, symptoms, or health goals.' },
    { icon: 'calendar', title: 'Book Slot', description: 'Select a convenient home collection time.' },
    { icon: 'activity', title: 'Track Reports', description: 'Get digital reports and keep them safely stored.' },
];

const faqs = [
    'Do I need fasting before a health package?',
    'Can I book sample collection at home?',
    'How soon will I receive reports?',
    'Can I share reports with a doctor?',
];

const PackageCard = ({ item, navigation }: { item: typeof packages[0]; navigation: NavigationProp }) => (
    <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('PackageDetail', {
            id: item.title.toLowerCase().replace(/ /g, '-'),
            title: item.title,
            price: item.price,
            features: `${item.tests} • ${item.features}`,
            image: item.image,
            isRecommended: item.isRecommended,
        })}
        className="bg-white dark:bg-zinc-900 rounded-2xl border border-[#D9F3E8] dark:border-zinc-800 shadow-sm overflow-hidden mb-5"
    >
        <Image source={item.image} className="w-full h-40" resizeMode="cover" />
        <View className="p-5">
            <View className="flex-row items-center justify-between mb-3">
                <View className="px-3 py-1 rounded-full bg-[#0DA96E]/10">
                    <Text className="text-[#0DA96E] text-[10px] font-bold uppercase tracking-wider">{item.tests}</Text>
                </View>
                {item.isRecommended && (
                    <View className="px-3 py-1 rounded-full bg-[#0DA96E]">
                        <Text className="text-white text-[10px] font-bold uppercase tracking-wider">Popular</Text>
                    </View>
                )}
            </View>

            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</Text>
            <Text className="text-sm text-gray-500 dark:text-zinc-400 leading-6 mb-5">{item.features}</Text>

            <View className="flex-row items-center justify-between">
                <View>
                    <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Starting from</Text>
                    <View className="flex-row items-baseline">
                        <Text className="text-2xl font-bold text-gray-900 dark:text-white">{item.price}</Text>
                        <Text className="text-xs text-gray-400 line-through ml-2">{item.oldPrice}</Text>
                    </View>
                </View>
                <View className="bg-[#0DA96E] px-4 py-3 rounded-xl flex-row items-center">
                    <Text className="text-white font-bold text-sm mr-2">Details</Text>
                    <Feather name="arrow-right" size={15} color="#FFFFFF" />
                </View>
            </View>
        </View>
    </TouchableOpacity>
);

const SectionHeader = ({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) => (
    <View className="items-center mb-8 px-4">
        {eyebrow && (
            <View className="px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-[#CDEFE2] dark:border-zinc-800 mb-4">
                <Text className="text-[#0DA96E] dark:text-[#10B981] font-semibold text-xs uppercase tracking-wider">{eyebrow}</Text>
            </View>
        )}
        <Text className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-3">{title}</Text>
        {body && <Text className="text-base text-gray-500 dark:text-zinc-400 text-center leading-6">{body}</Text>}
    </View>
);

const HealthPackagesScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-white dark:bg-zinc-950">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="relative w-full py-16 overflow-hidden bg-[#F7FBF9] dark:bg-zinc-950 border-b border-[#D9F3E8] dark:border-zinc-900">
                    <View className="px-4 items-center">
                        <View className="px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-[#CDEFE2] dark:border-zinc-800 mb-6">
                            <Text className="text-[#0DA96E] dark:text-[#10B981] font-semibold text-xs uppercase tracking-wider">Preventive Health</Text>
                        </View>
                        <View className="w-16 h-16 rounded-2xl bg-[#0DA96E]/10 items-center justify-center mb-6">
                            <Feather name="package" size={28} color="#0DA96E" />
                        </View>
                        <Text className="text-4xl font-bold tracking-tight mb-6 text-center text-gray-900 dark:text-white leading-tight">
                            Curated health{'\n'}
                            <Text className="text-[#0DA96E]">packages for every need</Text>
                        </Text>
                        <Text className="text-base text-gray-600 dark:text-zinc-400 text-center leading-7 max-w-lg">
                            Book preventive checkups, home sample collection, and digital reports in one simple healthcare journey.
                        </Text>
                    </View>
                </View>

                <View className="px-4 -mt-8 bg-white dark:bg-zinc-950">
                    <View className="bg-white dark:bg-zinc-900 rounded-3xl border border-[#D9F3E8] dark:border-zinc-800 shadow-sm overflow-hidden">
                        <View className="p-5">
                            <View className="flex-row items-start">
                                <View className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 items-center justify-center mr-4">
                                    <Feather name="clock" size={22} color="#D97706" />
                                </View>
                                <View className="flex-1">
                                    <View className="self-start px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 mb-3">
                                        <Text className="text-amber-600 dark:text-amber-300 font-black text-[10px] uppercase tracking-wider">Coming soon</Text>
                                    </View>
                                    <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        Health packages are almost ready
                                    </Text>
                                    <Text className="text-sm text-gray-500 dark:text-zinc-400 leading-6">
                                        We are curating trusted checkups, home sample collection, and clear digital reports so you can book preventive care with confidence.
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View className="h-1.5 bg-[#0DA96E]" />
                    </View>
                </View>

                <View className="py-12 px-4 bg-white dark:bg-zinc-950">
                    <SectionHeader
                        eyebrow="Popular Checkups"
                        title="Choose Your Health Package"
                        body="Designed for routine screening, chronic care monitoring, and complete family wellness."
                    />
                    {packages.map((item) => (
                        <PackageCard key={item.title} item={item} navigation={navigation} />
                    ))}
                </View>

                <View className="py-14 bg-[#F7FBF9] dark:bg-zinc-950 border-y border-[#D9F3E8] dark:border-zinc-900">
                    <SectionHeader
                        title="How It Works"
                        body="A simple flow from choosing a package to receiving your digital reports."
                    />
                    <View className="px-4 gap-y-4">
                        {steps.map((step, index) => (
                            <View key={step.title} className="bg-white dark:bg-zinc-900 rounded-2xl border border-[#D9F3E8] dark:border-zinc-800 p-5 flex-row items-start">
                                <View className="w-11 h-11 rounded-xl bg-[#0DA96E]/10 items-center justify-center mr-4">
                                    <Feather name={step.icon} size={20} color="#0DA96E" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-bold text-[#0DA96E] uppercase tracking-wider mb-1">Step {index + 1}</Text>
                                    <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">{step.title}</Text>
                                    <Text className="text-sm text-gray-500 dark:text-zinc-400 leading-6">{step.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <View className="py-14 bg-white dark:bg-zinc-950">
                    <SectionHeader
                        eyebrow="Why Swasthify"
                        title="Built for Preventive Care"
                        body="Health packages should feel convenient, transparent, and easy to understand."
                    />
                    <View className="px-4 flex-row flex-wrap justify-between">
                        {benefits.map((benefit) => (
                            <View key={benefit.title} className="w-[48%] bg-white dark:bg-zinc-900 rounded-2xl border border-[#D9F3E8] dark:border-zinc-800 p-4 mb-4">
                                <View className="w-10 h-10 rounded-xl bg-[#0DA96E]/10 items-center justify-center mb-4">
                                    <Feather name={benefit.icon} size={19} color="#0DA96E" />
                                </View>
                                <Text className="text-base font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</Text>
                                <Text className="text-xs text-gray-500 dark:text-zinc-400 leading-5">{benefit.description}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View className="py-14 bg-[#F7FBF9] dark:bg-zinc-950 border-y border-[#D9F3E8] dark:border-zinc-900">
                    <SectionHeader
                        title="Frequently Asked Questions"
                        body="Know what to expect before booking your package."
                    />
                    <View className="px-4 gap-y-3">
                        {faqs.map((faq) => (
                            <View key={faq} className="bg-white dark:bg-zinc-900 rounded-2xl border border-[#D9F3E8] dark:border-zinc-800 p-4 flex-row items-center justify-between">
                                <Text className="text-base font-semibold text-gray-900 dark:text-white flex-1 pr-3">{faq}</Text>
                                <Feather name="chevron-down" size={20} color="#0DA96E" />
                            </View>
                        ))}
                    </View>
                </View>

                <View className="px-4 py-10 bg-white dark:bg-zinc-950">
                    <View className="bg-[#0DA96E]/5 dark:bg-[#0DA96E]/10 rounded-2xl border border-[#0DA96E]/10 dark:border-[#0DA96E]/20 p-8 items-center">
                        <Text className="text-sm font-semibold text-[#0DA96E] uppercase tracking-wider mb-3">Prevent illness early</Text>
                        <Text className="text-2xl font-bold text-center mb-3 text-gray-900 dark:text-white">
                            Ready for your next checkup?
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-zinc-400 text-center leading-6 mb-6">
                            Compare packages and book a home collection slot when you are ready.
                        </Text>
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate('Labs')}
                            className="bg-[#0DA96E] px-7 py-3 rounded-lg shadow-md flex-row items-center"
                        >
                            <Text className="text-white font-semibold text-sm mr-2">Explore Lab Tests</Text>
                            <Feather name="arrow-right" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
};

export default HealthPackagesScreen;
