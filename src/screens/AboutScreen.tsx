import React from 'react';
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import Footer from '../components/Footer';

/* ═══════════════════════════════════════════════════
 *  HERO SECTION
 * ═══════════════════════════════════════════════════ */
const HeroSection = () => (
    <View className="relative w-full py-16 overflow-hidden bg-[#0DA96E]/5">
        {/* Decorative circles */}
        <View className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#0DA96E]/10 rounded-full opacity-60" />
        <View className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#00C68A]/10 rounded-full opacity-50" />

        <View className="px-4 items-center relative z-10">
            {/* Badge */}
            <View className="px-4 py-1.5 rounded-full bg-[#0DA96E]/10 mb-6">
                <Text className="text-[#0DA96E] font-medium text-sm">Our Story</Text>
            </View>

            {/* Title */}
            <Text className="text-3xl font-bold tracking-tight mb-6 text-center text-gray-900">
                Revolutionizing{' '}
                <Text className="text-[#0DA96E]">Healthcare Access</Text>
            </Text>

            {/* Subtitle */}
            <Text className="text-base text-gray-500 text-center leading-relaxed max-w-lg">
                At Swasthify, we believe quality healthcare should be accessible to everyone, everywhere. We're bridging the gap between patients and providers with technology.
            </Text>
        </View>
    </View>
);

/* ═══════════════════════════════════════════════════
 *  MISSION & VISION SECTION
 * ═══════════════════════════════════════════════════ */
const missionPoints = [
    'Seamless Booking',
    'Digital Records',
    'Verified Providers',
    '24/7 Support',
];

const MissionVisionSection = () => (
    <View className="py-12 bg-white">
        <View className="px-4">
            {/* Badge */}
            <View className="flex-row items-center self-start px-4 py-1.5 rounded-full border border-[#0DA96E]/20 bg-[#0DA96E]/5 mb-6">
                <Text className="text-sm text-[#0DA96E]">❤️  Our Mission</Text>
            </View>

            {/* Title */}
            <Text className="text-3xl font-bold leading-tight mb-6 text-gray-900">
                Empowering{'\n'}
                <Text className="text-[#0DA96E]">Healthier Lives</Text>
            </Text>

            {/* Description */}
            <Text className="text-base text-gray-500 leading-relaxed mb-8">
                Our mission is to simplify the healthcare journey by providing a unified platform for appointments, diagnostics, and medical records. We strive to make healthcare transparent, affordable, and efficient for every individual.
            </Text>

            {/* Mission Points Grid */}
            <View className="flex-row flex-wrap gap-3 mb-8">
                {missionPoints.map((item, i) => (
                    <View
                        key={i}
                        className="w-[48%] flex-row items-center gap-3 p-3 rounded-lg bg-gray-100/30 border border-gray-300/50"
                    >
                        <View className="w-8 h-8 rounded-full bg-[#0DA96E]/10 items-center justify-center">
                            <Text className="text-[#0DA96E] text-xs">✓</Text>
                        </View>
                        <Text className="font-medium text-gray-900 text-sm flex-1">{item}</Text>
                    </View>
                ))}
            </View>

            {/* Stats Card */}
            <View className="bg-white rounded-2xl shadow-xl border border-gray-300/50 p-6 flex-row items-center gap-4">
                <View className="w-14 h-14 rounded-full bg-[#0DA96E]/10 items-center justify-center">
                    <Text className="text-2xl">🏆</Text>
                </View>
                <View>
                    <Text className="font-bold text-3xl text-[#0DA96E]">50k+</Text>
                    <Text className="text-sm text-gray-500 font-medium">Lives Impacted</Text>
                </View>
            </View>
        </View>
    </View>
);

/* ═══════════════════════════════════════════════════
 *  FOUNDER SECTION
 * ═══════════════════════════════════════════════════ */
const FounderSection = () => (
    <View className="py-12 bg-white overflow-hidden relative">
        {/* Background decorations */}
        <View className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full opacity-60" />
        <View className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#0DA96E]/5 rounded-full opacity-60" />

        <View className="px-4 relative z-10">
            {/* Badge */}
            <View className="self-start px-4 py-1.5 rounded-full bg-emerald-100 mb-6">
                <Text className="text-sm font-medium text-emerald-700">Meet the Founder</Text>
            </View>

            {/* Title */}
            <Text className="text-3xl font-bold mb-8 text-gray-900 leading-tight">
                Building Trust Through{'\n'}
                <Text className="text-emerald-600">Execution & Excellence</Text>
            </Text>

            {/* Bio */}
            <View className="gap-6 mb-8">
                <Text className="text-base text-gray-500 leading-relaxed">
                    <Text className="text-gray-900 font-semibold">Abhinav Kumar</Text> is an award-winning entrepreneur from Rajendra Nagar, Patna, recognized for his ability to build sustainable businesses with a focus on operational excellence and customer trust.
                </Text>

                <Text className="text-base text-gray-500 leading-relaxed">
                    His entrepreneurial journey began with{' '}
                    <Text className="font-medium text-emerald-600">Tea Mount</Text>, a consumer brand that became a symbol of disciplined growth. This success demonstrated his capability to transform ideas into revenue-generating ventures.
                </Text>

                {/* Quote */}
                <View className="border-l-4 border-emerald-500/30 bg-emerald-50/50 p-4 rounded-r-xl">
                    <Text className="text-gray-900/80 italic text-base leading-relaxed">
                        "The future of healthcare lies in secure, connected, and patient-centric digital systems. Swasthify is our commitment to making that future a reality."
                    </Text>
                </View>

                <Text className="text-base text-gray-500 leading-relaxed">
                    Now, as the founder of <Text className="font-bold text-gray-900">Swasthify</Text>, Abhinav is on a mission to remove healthcare inefficiencies by combining technology with accessibility. His vision is to simplify how patients and doctors connect, creating a seamless ecosystem for everyone.
                </Text>
            </View>

            {/* Award Card */}
            <View className="bg-white p-6 rounded-3xl shadow-xl border border-emerald-100 overflow-hidden relative mb-4">
                <View className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[80px]" />
                <View className="relative z-10">
                    <View className="w-12 h-12 bg-emerald-100 rounded-2xl items-center justify-center mb-4">
                        <Text className="text-2xl">🏆</Text>
                    </View>
                    <Text className="text-xl font-bold text-gray-900 mb-1">Awarded</Text>
                    <Text className="text-lg font-semibold text-emerald-600 mb-2">Startup Winner 2025</Text>
                    <Text className="text-sm text-gray-500 font-medium uppercase tracking-wide">Bihar Entrepreneurship Association</Text>
                </View>
            </View>

            {/* Tea Mount Card */}
            <View className="bg-white p-6 rounded-3xl shadow-xl border border-emerald-100 overflow-hidden relative">
                <View className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[80px]" />
                <View className="relative z-10">
                    <View className="w-12 h-12 bg-emerald-100 rounded-2xl items-center justify-center mb-4">
                        <Text className="text-xl font-bold text-emerald-600">TM</Text>
                    </View>
                    <Text className="text-xl font-bold text-gray-900 mb-3">Tea Mount</Text>
                    <Text className="text-gray-500 leading-relaxed">
                        Tea Mount is a consumer brand that has become a symbol of disciplined and sustainable growth.
                    </Text>
                </View>
            </View>

            {/* Divider + Social */}
            <View className="mt-8 pt-6 border-t border-gray-300/50">
                <Text className="text-sm text-gray-500 mb-2">Connect with Abhinav</Text>
                <View className="h-2 w-20 bg-emerald-500/20 rounded-full" />
            </View>
        </View>
    </View>
);

/* ═══════════════════════════════════════════════════
 *  VALUES SECTION
 * ═══════════════════════════════════════════════════ */
const valuesData = [
    {
        emoji: '👥',
        title: 'Patient First',
        desc: 'Every feature we build starts with the patient\'s needs in mind. We prioritize user experience and accessibility above all.',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    {
        emoji: '🛡️',
        title: 'Trust & Safety',
        desc: 'We adhere to the highest standards of data privacy and medical ethics. Your health data is secure with us.',
        color: 'text-green-500',
        bg: 'bg-green-500/10',
    },
    {
        emoji: '❤️',
        title: 'Empathy',
        desc: 'We understand that healthcare is personal. We treat every interaction with compassion, care, and understanding.',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
    },
];

const ValuesSection = () => (
    <View className="py-16 bg-gray-100/30 relative overflow-hidden">
        {/* Top/Bottom borders */}
        <View className="absolute top-0 left-0 w-full h-px bg-gray-300/50" />
        <View className="absolute bottom-0 left-0 w-full h-px bg-gray-300/50" />

        <View className="px-4">
            {/* Header */}
            <View className="items-center mb-10">
                <View className="px-3 py-1 rounded-full bg-gray-200 mb-4">
                    <Text className="text-sm font-medium text-gray-700">Core Principles</Text>
                </View>
                <Text className="text-2xl font-bold mb-4 text-center text-gray-900">Our Core Values</Text>
                <Text className="text-lg text-gray-500 text-center">
                    The principles that guide every decision we make at Swasthify.
                </Text>
            </View>

            {/* Values Cards */}
            <View className="gap-6">
                {valuesData.map((value, i) => (
                    <View
                        key={i}
                        className="bg-white rounded-xl border border-gray-300/50 shadow-sm p-6"
                    >
                        <View className={`w-12 h-12 rounded-2xl ${value.bg} items-center justify-center mb-4`}>
                            <Text className="text-2xl">{value.emoji}</Text>
                        </View>
                        <Text className="text-xl font-bold mb-2 text-gray-900">{value.title}</Text>
                        <Text className="text-sm text-gray-500 leading-relaxed">{value.desc}</Text>
                    </View>
                ))}
            </View>
        </View>
    </View>
);

/* ═══════════════════════════════════════════════════
 *  LOCATION SECTION
 * ═══════════════════════════════════════════════════ */
const LocationSection = () => (
    <View className="py-12 bg-white relative overflow-hidden">
        <View className="px-4">
            {/* Header */}
            <View className="items-center mb-10">
                <View className="flex-row items-center px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 shadow-sm mb-6">
                    <Text className="text-sm text-emerald-700">📍  Our Presence</Text>
                </View>
                <Text className="text-3xl font-bold mb-4 text-center text-gray-900">
                    Where to Find Us
                </Text>
                <Text className="text-gray-500 text-lg text-center leading-relaxed max-w-lg">
                    Centered in the heart of heritage, operating with a vision for the future. Visit our registered office in Patna.
                </Text>
            </View>

            {/* Location Card */}
            <View className="bg-white/80 rounded-xl border border-gray-300/50 shadow-2xl overflow-hidden">
                <View className="p-6">
                    {/* Office Info */}
                    <View className="items-center mb-6">
                        <View className="w-16 h-16 rounded-2xl bg-emerald-100 items-center justify-center mb-4">
                            <Text className="text-3xl">📍</Text>
                        </View>
                        <Text className="text-2xl font-bold mb-2 text-gray-900">Registered Office</Text>
                        <Text className="text-gray-500">Headquarters & Operations</Text>
                    </View>

                    {/* Divider */}
                    <View className="w-full h-px bg-gray-300/60 my-6" />

                    {/* Address */}
                    <View className="items-center mb-6">
                        <Text className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">Address</Text>
                        <Text className="text-lg text-gray-900 text-center leading-relaxed font-medium">
                            Rajendra Nagar{'\n'}
                            Patna, Bihar{'\n'}
                            <Text className="text-gray-500">800016</Text>
                        </Text>
                    </View>

                    {/* Divider */}
                    <View className="w-full h-px bg-gray-300/60 my-6" />

                    {/* Contact Details */}
                    <View className="items-center">
                        <Text className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-4">Contact Details</Text>
                        <TouchableOpacity
                            onPress={() => Linking.openURL('mailto:support@swasthify.com')}
                            className="mb-3"
                        >
                            <Text className="text-lg font-medium text-gray-900">support@swasthify.com</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => Linking.openURL('tel:+919759225515')}
                        >
                            <Text className="text-lg font-medium text-gray-900">+91 97592 25515</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    </View>
);

/* ═══════════════════════════════════════════════════
 *  CTA SECTION
 * ═══════════════════════════════════════════════════ */
const CTASection = () => (
    <View className="px-4 pb-8">
        <View className="bg-[#0DA96E]/5 rounded-2xl border border-[#0DA96E]/10 p-8 items-center">
            <Text className="text-xl font-bold text-center mb-3 text-gray-900">
                Be Part of Our Mission
            </Text>
            <Text className="text-sm text-gray-500 text-center leading-6 mb-6 px-2">
                Join us in our journey to make healthcare accessible to everyone. Experience the difference with Swasthify.
            </Text>
            <TouchableOpacity
                activeOpacity={0.85}
                className="bg-[#0DA96E] px-8 py-3 rounded-lg shadow-md"
            >
                <Text className="text-white font-semibold text-sm">Join Now</Text>
            </TouchableOpacity>
        </View>
    </View>
);

/* ═══════════════════════════════════════════════════
 *  ABOUT SCREEN
 * ═══════════════════════════════════════════════════ */
const AboutScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView showsVerticalScrollIndicator={false}>
                <HeroSection />
                <MissionVisionSection />
                <FounderSection />
                <ValuesSection />
                <LocationSection />
                <CTASection />
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
};

export default AboutScreen;
