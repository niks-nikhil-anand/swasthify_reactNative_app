import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import Feather from 'react-native-vector-icons/Feather';
import { useColorScheme } from 'nativewind';
import Footer from '../components/Footer';

type NavigationProp = DrawerNavigationProp<RootDrawerParamList>;

const pricingPlans = [
    {
        title: 'General Consultation',
        description: 'Connect with certified general physicians for common ailments.',
        price: '199',
        features: ['24/7 Availability', 'Instant Connections', 'Digital Prescriptions', 'Follow-up Reminders'],
        icon: 'user-check',
        popular: false,
    },
    {
        title: 'Specialist Consultation',
        description: 'Expert advice from top-tier specialists across all departments.',
        price: '499',
        features: ['Vetted Specialists', 'Video/Audio Consultation', 'Detailed Health Reports', 'Secure Data Sharing'],
        icon: 'shield',
        popular: true,
    },
    {
        title: 'Lab & Diagnostics',
        description: 'Book essential tests and diagnostics at your convenience.',
        price: '99',
        features: ['Home Sample Collection', 'Digital Test Results', 'Comparative Analysis', 'Accredited Labs'],
        icon: 'activity',
        popular: false,
    },
];

const testimonials = [
    {
        quote: 'Swasthify has completely transformed how we manage our clinic. The patient records and appointment features are a lifesaver.',
        name: 'Dr. Sharma',
        role: 'General Physician, Mumbai',
    },
    {
        quote: 'The Pro plan is incredible value. Being able to access lab reports and send prescriptions digitally has delighted our patients.',
        name: 'Dr. Priya Patel',
        role: 'Pediatrician, Bangalore',
    },
    {
        quote: 'We switched from a legacy system to Swasthify Enterprise. The migration was smooth and the support team is top-notch.',
        name: 'City Care Hospital',
        role: 'Administration Dept, Delhi',
    },
];

const faqs = [
    'Can I switch plans later?',
    'Is there a free trial?',
    'What payment methods do you accept?',
    'Is my data secure?',
    'Do you offer discounts for non-profits?',
];

const PricingCard = ({ plan, navigation }: { plan: typeof pricingPlans[0]; navigation: NavigationProp }) => (
    <View
        className={`rounded-2xl p-6 mb-5 border shadow-sm ${
            plan.popular
                ? 'bg-[#0DA96E] border-[#0DA96E]'
                : 'bg-white dark:bg-zinc-900 border-[#D9F3E8] dark:border-zinc-800'
        }`}
    >
        {plan.popular && (
            <View className="self-start bg-white/20 px-3 py-1 rounded-full mb-4">
                <Text className="text-[10px] font-bold text-white uppercase tracking-wider">Best Value</Text>
            </View>
        )}

        <View
            className={`w-12 h-12 rounded-2xl items-center justify-center mb-5 ${
                plan.popular ? 'bg-white/15' : 'bg-[#0DA96E]/10'
            }`}
        >
            <Feather name={plan.icon} size={22} color={plan.popular ? '#FFFFFF' : '#0DA96E'} />
        </View>

        <Text className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            {plan.title}
        </Text>
        <Text className={`text-sm leading-6 mb-6 ${plan.popular ? 'text-white/80' : 'text-gray-500 dark:text-zinc-400'}`}>
            {plan.description}
        </Text>

        <Text className={`text-xs font-semibold uppercase tracking-wider mb-1 ${plan.popular ? 'text-white/70' : 'text-gray-400'}`}>
            Starting from
        </Text>
        <View className="flex-row items-baseline mb-6">
            <Text className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                ₹{plan.price}
            </Text>
        </View>

        <View className="gap-y-3 mb-6">
            {plan.features.map((feature) => (
                <View key={feature} className="flex-row items-center">
                    <View className={`w-5 h-5 rounded-full items-center justify-center mr-3 ${plan.popular ? 'bg-white/20' : 'bg-[#0DA96E]/10'}`}>
                        <Feather name="check" size={12} color={plan.popular ? '#FFFFFF' : '#0DA96E'} />
                    </View>
                    <Text className={`text-sm font-medium ${plan.popular ? 'text-white' : 'text-gray-700 dark:text-zinc-300'}`}>
                        {feature}
                    </Text>
                </View>
            ))}
        </View>

        <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate(plan.title === 'Lab & Diagnostics' ? 'Labs' : 'Doctors')}
            className={`h-11 rounded-xl items-center justify-center ${
                plan.popular ? 'bg-white' : 'bg-[#0DA96E]'
            }`}
        >
            <Text className={`font-bold text-sm ${plan.popular ? 'text-[#0DA96E]' : 'text-white'}`}>Book Now</Text>
        </TouchableOpacity>
    </View>
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

const PricingScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-white dark:bg-zinc-950">
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="relative w-full py-16 overflow-hidden bg-[#F7FBF9] dark:bg-zinc-950 border-b border-[#D9F3E8] dark:border-zinc-900">
                    <View className="px-4 items-center">
                        <View className="px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-[#CDEFE2] dark:border-zinc-800 mb-6">
                            <Text className="text-[#0DA96E] dark:text-[#10B981] font-semibold text-xs uppercase tracking-wider">
                                Patient-First Pricing
                            </Text>
                        </View>
                        <Text className="text-4xl font-bold tracking-tight mb-6 text-center text-gray-900 dark:text-white leading-tight">
                            Affordable care,{'\n'}
                            <Text className="text-[#0DA96E]">zero hidden costs</Text>
                        </Text>
                        <Text className="text-base text-gray-600 dark:text-zinc-400 text-center leading-7 max-w-lg">
                            Transparent pricing for every service. Know exactly what you pay before you book. No surprises, just quality care.
                        </Text>
                    </View>
                </View>

                <View className="py-12 px-4 bg-white dark:bg-zinc-950">
                    {pricingPlans.map((plan) => (
                        <PricingCard key={plan.title} plan={plan} navigation={navigation} />
                    ))}
                </View>

                <View className="py-14 bg-[#F7FBF9] dark:bg-zinc-950 border-y border-[#D9F3E8] dark:border-zinc-900">
                    <SectionHeader
                        title="Trusted by Healthcare Professionals"
                        body="Doctors, clinics, and care teams use Swasthify to make healthcare easier to manage."
                    />
                    <View className="px-4 gap-y-4">
                        {testimonials.map((item) => (
                            <View key={item.name} className="bg-white dark:bg-zinc-900 rounded-2xl border border-[#D9F3E8] dark:border-zinc-800 p-5 shadow-sm">
                                <Text className="text-base text-gray-700 dark:text-zinc-300 leading-7 mb-5">"{item.quote}"</Text>
                                <Text className="text-base font-bold text-gray-900 dark:text-white">{item.name}</Text>
                                <Text className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{item.role}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View className="py-14 bg-white dark:bg-zinc-950">
                    <SectionHeader
                        title="Frequently Asked Questions"
                        body="Got questions? We have answers. Find everything you need to know about Swasthify."
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

                <View className="px-4 pb-10">
                    <View className="bg-[#0DA96E]/5 dark:bg-[#0DA96E]/10 rounded-2xl border border-[#0DA96E]/10 dark:border-[#0DA96E]/20 p-8 items-center">
                        <Text className="text-sm font-semibold text-[#0DA96E] uppercase tracking-wider mb-3">
                            Transform your health journey
                        </Text>
                        <Text className="text-2xl font-bold text-center mb-3 text-gray-900 dark:text-white">
                            Ready to find your doctor?
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-zinc-400 text-center leading-6 mb-6">
                            Join thousands of patients who trust Swasthify for quality healthcare at transparent prices.
                        </Text>
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => navigation.navigate('Doctors')}
                                className="bg-[#0DA96E] px-5 py-3 rounded-lg mr-3 shadow-md"
                            >
                                <Text className="text-white font-semibold text-sm">Find a Doctor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate('Contact')}
                                className="border border-gray-300 dark:border-zinc-700 px-5 py-3 rounded-lg"
                            >
                                <Text className="text-gray-900 dark:text-zinc-200 font-semibold text-sm">Contact Support</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
};

export default PricingScreen;
