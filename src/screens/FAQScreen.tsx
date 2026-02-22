import React from 'react';
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import Footer from '../components/Footer';

/* ─── Data ─── */
const faqData = [
    {
        q: 'What is Swasthify?',
        a: 'Swasthify is a comprehensive healthcare platform that connects patients with qualified doctors and lab services for seamless medical consultations.',
    },
    {
        q: 'How do I book an appointment?',
        a: 'You can book an appointment by selecting a service from our home screen, choosing a doctor or lab, and selecting a preferred time slot.',
    },
    {
        q: 'Are the doctors verified?',
        a: 'Yes, every doctor on the Swasthify platform undergoes a rigorous verification process to ensure they are qualified and licensed.',
    },
    {
        q: 'What payment methods are accepted?',
        a: 'We accept all major credit/debit cards, UPI, and net banking for secure and easy payments.',
    },
    {
        q: 'Can I cancel my appointment?',
        a: 'Yes, you can cancel your appointment through the app. Please refer to our refund policy for details on cancellation charges.',
    },
    {
        q: 'Is my data secure?',
        a: 'Absolutely. We use industry-standard encryption to protect your personal and medical information.',
    },
];

type NavigationProp = DrawerNavigationProp<RootDrawerParamList>;

const FAQScreen = () => {
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
                                Help Center
                            </Text>
                        </View>

                        {/* Title */}
                        <Text className="text-3xl font-bold tracking-tight mb-6 text-center text-gray-900">
                            Got questions?{'\n'}
                            <Text className="text-[#0DA96E] font-extrabold italic">We've got answers</Text>
                        </Text>

                        {/* Subtitle */}
                        <Text className="text-base text-gray-500 text-center leading-relaxed max-w-lg">
                            Everything you need to know about our platform, services, and how we help you stay healthy.
                        </Text>
                    </View>
                </View>

                {/* ═══════════════ FAQ SECTION ═══════════════ */}
                <View className="px-4 py-12">
                    <View className="gap-4">
                        {faqData.map((faq, i) => (
                            <View key={i} className="bg-white rounded-xl border border-gray-300/50 p-5 shadow-sm">
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
                            Still have questions?
                        </Text>
                        <Text className="text-sm text-gray-500 text-center leading-6 mb-6 px-2">
                            Can't find the answer you're looking for? Our support team is here to help you with any queries or concerns you might have.
                        </Text>
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => navigation.navigate('Contact')}
                                className="bg-[#0DA96E] px-6 py-3 rounded-lg mr-3 shadow-md"
                            >
                                <Text className="text-white font-semibold text-sm">Contact Us</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate('About')}
                                className="border border-gray-300 px-6 py-3 rounded-lg"
                            >
                                <Text className="text-gray-900 font-semibold text-sm">About Us</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* ═══════════════ FOOTER ═══════════════ */}
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
};

export default FAQScreen;
