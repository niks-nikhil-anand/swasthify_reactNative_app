import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import Footer from '../components/Footer';

type NavigationProp = DrawerNavigationProp<RootDrawerParamList>;

/* ─── Data ─── */
const patientServices = [
    {
        name: 'General Consultation',
        price: '₹199',
        description: 'Connect with certified general physicians for common ailments.',
        features: [
            '24/7 Availability',
            'Instant Connections',
            'Digital Prescriptions',
            'Follow-up Reminders',
        ],
        emoji: '🩺',
        mostPopular: false,
    },
    {
        name: 'Specialist Consultation',
        price: '₹499',
        description: 'Expert advice from top-tier specialists across all departments.',
        features: [
            'Vetted Specialists',
            'Video/Audio Consultation',
            'Detailed Health Reports',
            'Secure Data Sharing',
        ],
        emoji: '🛡️',
        mostPopular: true,
    },
    {
        name: 'Lab & Diagnostics',
        price: '₹99',
        description: 'Book essential tests and diagnostics at your convenience.',
        features: [
            'Home Sample Collection',
            'Digital Test Results',
            'Comparative Analysis',
            'Accredited Labs',
        ],
        emoji: '⚡',
        mostPopular: false,
    },
];

/* ═══════════════════════════════════════════════════
 *  PRICING SCREEN
 * ═══════════════════════════════════════════════════ */
const PricingScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* ═══════════════ HERO SECTION ═══════════════ */}
                <View className="relative w-full py-16 overflow-hidden bg-[#0DA96E]/5">
                    {/* Decorative circle */}
                    <View className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#0DA96E]/10 rounded-full opacity-50" />

                    <View className="px-4 items-center relative z-10">
                        {/* Badge */}
                        <View className="px-4 py-1.5 rounded-full bg-[#0DA96E]/10 mb-6">
                            <Text className="text-[#0DA96E] font-medium text-sm">
                                Patient-First Pricing
                            </Text>
                        </View>

                        {/* Title */}
                        <Text className="text-3xl font-bold tracking-tight mb-6 text-center text-gray-900">
                            Affordable care,{'\n'}
                            <Text className="text-[#0DA96E] font-extrabold italic">zero hidden costs</Text>
                        </Text>

                        {/* Subtitle */}
                        <Text className="text-base text-gray-500 text-center leading-relaxed max-w-lg">
                            Transparent pricing for every service. Know exactly what you pay before you book. No surprises, just quality care.
                        </Text>
                    </View>
                </View>

                {/* ═══════════════ PRICING CARDS ═══════════════ */}
                <View className="px-4 py-8">
                    <View className="gap-6">
                        {patientServices.map((item) => (
                            <View
                                key={item.name}
                                className={`rounded-2xl overflow-hidden relative ${item.mostPopular
                                    ? 'border-2 border-[#0DA96E]/50 shadow-xl bg-white'
                                    : 'border border-gray-300/50 shadow-sm bg-white'
                                    }`}
                            >
                                {/* Most Popular Badge */}
                                {item.mostPopular && (
                                    <View className="absolute -top-0 right-4 z-10">
                                        <View className="bg-[#0DA96E] px-4 py-1.5 rounded-b-lg shadow-lg">
                                            <Text className="text-white text-xs font-bold">Best Value</Text>
                                        </View>
                                    </View>
                                )}

                                {/* Card Header */}
                                <View className="items-center pt-8 pb-4 px-6">
                                    <View className="w-14 h-14 rounded-2xl bg-[#0DA96E]/10 items-center justify-center mb-4">
                                        <Text className="text-2xl">{item.emoji}</Text>
                                    </View>
                                    <Text className="text-2xl font-bold tracking-tight text-gray-900 text-center">
                                        {item.name}
                                    </Text>
                                    <Text className="text-gray-500 mt-3 text-center leading-relaxed text-sm px-2">
                                        {item.description}
                                    </Text>
                                </View>

                                {/* Price */}
                                <View className="mx-6 mb-6 bg-[#0DA96E]/5 rounded-2xl py-5 border border-[#0DA96E]/10 items-center">
                                    <Text className="text-xs font-medium text-[#0DA96E]/60 uppercase tracking-wider mb-1">
                                        Starting from
                                    </Text>
                                    <Text className="text-4xl font-black text-gray-900">
                                        {item.price}
                                    </Text>
                                </View>

                                {/* Features */}
                                <View className="px-6 pb-2">
                                    <View className="gap-4">
                                        {item.features.map((feature) => (
                                            <View key={feature} className="flex-row items-start gap-3">
                                                <View className="p-0.5 rounded-full bg-[#0DA96E]/15 mt-0.5">
                                                    <Text className="text-[#0DA96E] text-xs font-bold">✓</Text>
                                                </View>
                                                <Text className="text-sm text-gray-900/85 font-medium flex-1">
                                                    {feature}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                {/* Button */}
                                <View className="px-6 pb-8 pt-6">
                                    <TouchableOpacity
                                        activeOpacity={0.85}
                                        className={`w-full h-12 rounded-lg items-center justify-center flex-row shadow-lg ${item.mostPopular
                                            ? 'bg-[#0DA96E]'
                                            : 'bg-white border-2 border-[#0DA96E]/20'
                                            }`}
                                    >
                                        <Text className={`text-base font-bold ${item.mostPopular ? 'text-white' : 'text-[#0DA96E]'
                                            }`}>
                                            Book Now
                                        </Text>
                                        <Text className={`text-base ml-2 ${item.mostPopular ? 'text-white' : 'text-[#0DA96E]'
                                            }`}>
                                            →
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ═══════════════ FAQ SECTION ═══════════════ */}
                <View className="px-4 py-12 bg-gray-50">
                    <View className="items-center mb-8">
                        <View className="px-3 py-1 rounded-full bg-gray-200 mb-4">
                            <Text className="text-sm font-medium text-gray-700">FAQ</Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
                            Frequently Asked Questions
                        </Text>
                        <Text className="text-base text-gray-500 text-center max-w-lg">
                            Everything you need to know about our pricing and services.
                        </Text>
                    </View>

                    <View className="gap-4">
                        {[
                            {
                                q: 'Are there any hidden charges?',
                                a: 'No. The price you see is the price you pay. We believe in complete transparency.',
                            },
                            {
                                q: 'How do I book a consultation?',
                                a: 'Simply register as a patient, browse available doctors, and book your appointment in just a few taps.',
                            },
                            {
                                q: 'Can I get a refund?',
                                a: 'Yes, if a consultation is cancelled before it starts, you will receive a full refund.',
                            },
                            {
                                q: 'Is home sample collection free?',
                                a: 'Home sample collection is included in the Lab & Diagnostics pricing with no extra charges.',
                            },
                        ].map((faq, i) => (
                            <View key={i} className="bg-white rounded-xl border border-gray-300/50 p-5">
                                <Text className="text-base font-bold text-gray-900 mb-2">{faq.q}</Text>
                                <Text className="text-sm text-gray-500 leading-relaxed">{faq.a}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ═══════════════ CTA SECTION ═══════════════ */}
                <View className="px-4 py-8">
                    <View className="bg-[#0DA96E]/5 rounded-2xl border border-[#0DA96E]/10 p-8 items-center">
                        <Text className="text-xl font-bold text-center mb-3 text-gray-900">
                            Ready to find your doctor?
                        </Text>
                        <Text className="text-sm text-gray-500 text-center leading-6 mb-6 px-2">
                            Join thousands of patients who trust Swastify for quality healthcare at transparent prices. Book your first consultation today.
                        </Text>
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                activeOpacity={0.85}
                                className="bg-[#0DA96E] px-6 py-3 rounded-lg mr-3 shadow-md"
                            >
                                <Text className="text-white font-semibold text-sm">Find a Doctor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate('Contact')}
                                className="border border-gray-300 px-6 py-3 rounded-lg"
                            >
                                <Text className="text-gray-900 font-semibold text-sm">Contact Support</Text>
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
